param (
    [Parameter(Mandatory=$true)][string]$Server, # Server to ssh into 
    [string]$OutputFile = "$(Get-Location)\\output.sql", # Where the temporary dump file will be created, locally
    [Parameter(Mandatory=$true)][string]$LocalDatabase, # Local database to be transferred
    [Parameter(Mandatory=$true)][string]$BaseDirOnServer, # The root repository directory on the server
    [Parameter(Mandatory=$true)][string]$AppName, # App name listed in pm2
    [string]$CommandsTemplate = "./commands.template.sh" # File to create commands from
)

$ErrorActionPreference = "Stop"

# Dump the database contents into a dump file
".output $($OutputFile.Replace("\", "\\"))`n.dump" | sqlite3 $LocalDatabase

# Replace some stuff in the dump file to prevent warnings
$CreateOriginal = "CREATE TABLE"
$CreateNew = "CREATE TABLE IF NOT EXISTS"

$InsertOriginal = "INSERT INTO"
$InsertNew = "INSERT OR REPLACE INTO"

(Get-Content -Path $OutputFile) `
    -replace $CreateOriginal, $CreateNew `
    -replace $InsertOriginal, $InsertNew |
Set-Content -Path $OutputFile

$BaseDir = ssh $Server "realpath $BaseDirOnServer"

$OutputFileOnServer = "$BaseDir/output.sql"

# Send the dump file to the server
scp $OutputFile $Server`:$OutputFileOnServer

Remove-Item -Path $OutputFile

$DatabaseOnServer = "$BaseDir/api/guidingvision.db"

$TemporaryCommandsFile = "./temp_comms.sh"

(Get-Content -Path $CommandsTemplate -Raw) `
    -replace "PUT_DATABASE_PATH_HERE", $DatabaseOnServer `
    -replace "PUT_OUTPUT_FILE_HERE", $OutputFileOnServer `
    -replace "PUT_APP_NAME_HERE", $AppName |
Set-Content -Path $TemporaryCommandsFile -NoNewLine

# Run the commands on the server
Get-Content -Path $TemporaryCommandsFile -Raw | ssh $Server

Remove-Item $TemporaryCommandsFile
