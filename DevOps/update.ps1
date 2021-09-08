param (
    [Parameter(Mandatory=$true)][string]$Server, # Server to connect to
    [Parameter(Mandatory=$true)][string]$BaseDirOnServer, # relative path to base directory
    [Parameter(Mandatory=$true)][string]$AppName, # nam of app listed in pm2
    [string]$CommandsTemplate = "./update.template.sh" # File to create commands from
)

$ErrorActionPreference = "Stop"

# Get the absolute path to the base directory
$BaseDir = ssh $server "realpath $BaseDirOnServer"
# Path to the frontend folder
$FrontEnd = "$BaseDir/frontend"
# Path to the api folder
$Api = "$BaseDir/api"

$TemporaryCommandsFile = "./temp_upd_comms.sh"

# Use the template commands file to create th ereal file
# And replace what's required
(Get-Content -Path $CommandsTemplate -Raw) `
    -replace "PUT_APP_NAME_HERE", $AppName `
    -replace "PUT_BASE_DIRECTORY_HERE", $BaseDir `
    -replace "PUT_FRONTEND_DIRECTORY_HERE", $FrontEnd `
    -replace "PUT_API_DIRECTORY_HERE", $Api |
Set-Content -Path $TemporaryCommandsFile -NoNewLine

# Run the commands on the server
Get-Content -Path $TemporaryCommandsFile -Raw | ssh $server

# Delete the commands file
Remove-Item -Path $TemporaryCommandsFile
