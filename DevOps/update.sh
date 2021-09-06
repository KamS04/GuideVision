server='homeserver' # server to connect to
baseDirOnServer='~/Documents/GuideVision' # relative path to base directory
appName='GuidingVision' # name of app listed in pm2

# Get the absolute path to the base directory
baseDir=$(ssh $server "realpath $baseDirOnServer")
# Path to the frontend folder
frontend="$baseDir/frontend"

tempCommandsFile="./temp_upd_comms.sh"

# Use the template commands file to create the real file
# And replace what's required
sed -e "s+PUT_APP_NAME_HERE+$appName+" \
    -e "s+PUT_BASE_DIRECTORY_HERE+$baseDir+" \
    -e "s+PUT_FRONTEND_DIRECTORY_HERE+$frontend+" "./update.template.sh" > $tempCommandsFile

# Run the commands on the server
cat $tempCommandsFile | ssh $server

# Delete the commands file
rm $tempCommandsFile