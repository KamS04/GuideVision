$ErrorActionPreference = "Stop"

$server = 'homeserver' # The Server to ssh into

# Where the temporary dump file will be created on the local machine
$outputFile = 'D:\Code\web\Projects\CAS\GuideVision\output.sql'
# The location of the local database from which the dump will be created
$database = 'D:\Code\web\Projects\CAS\GuideVision\DB-Browser\database.db' 

# Dump the database contents into a dump file
".output $($outputFile.Replace("\", "\\"))`n.dump" | sqlite3 $database

# Replace some stuff in the dump file
$createOriginal = "CREATE TABLE"
$createNew = "CREATE TABLE IF NOT EXISTS"

$insertOriginal = "INSERT INTO"
$insertNew = "INSERT OR REPLACE INTO"

(Get-Content -Path $outputFile ) -replace $createOriginal, $createNew -replace $insertOriginal, $insertNew | Set-Content -Path $outputFile

# Where the overall GuideVision directory is located
$baseDirOnServer = "~/Documents/GuideVision"

$baseDir = ssh $server "realpath $baseDirOnServer"

$outputFileOnServer = "$baseDir/output.sql"

# Send the dump file to the server
scp $outputFile $server`:$outputFileOnServer

Remove-Item -Path $outputFile

$databaseOnServer = "$baseDir/api/guidingvision.db"

$tempCommandFile = "./temp_comms.sh"

$appName="GuidingVision"

# Replace the paths in the comms template
(Get-Content -Path "./commands.template.sh" -Raw) -replace "PUT_DATABASE_PATH_HERE", $databaseOnServer -replace "PUT_OUTPUT_FILE_HERE", $outputFileOnServer -replace "PUT_APP_NAME_HERE", $appName | Set-Content -Path $tempCommandFile

# run the commands on the server
Get-Content -Path $tempCommandFile -Raw | ssh $server

Remove-Item -Path $tempCommandFile