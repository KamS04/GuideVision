#!/bin/bash

usage() { echo "Usage $0 [-s server] [-b BaseDirectoryOnServer] [-a AppName] [-c Commands Template]" 1>&2; exit 1; }

commandsTemplate="./update.template.sh"

while getopts ":s:b:a:c" option; do
    case "${option}" in
        s)
            server=${OPTARG} # server to connect to
            ;;
        b)
            baseDirOnServer=${OPTARG} # relative path to base directory
            ;;
        a)
            appName=${OPTARG} # name of app listed in pm2
            ;;
        c)
            commandsTemplate=${OPTARG} # file from which to create commands
            ;;
        *)
            usage
            ;;
    esac
done

# If anything is empty or null, show help and exit
if     [ -z "${server}" ] \
    || [ -z "${baseDirOnServer}" ] \
    || [ -z "${appName}" ] \
    || [ -z "${commandsTemplate}" ]; then
    usage
fi

# Get the absolute path to the base directory
baseDir=$(ssh $server "realpath $baseDirOnServer")
# Path to the frontend folder
frontend="$baseDir/frontend"
# Path to the api folder
api="$baseDir/api"

tempCommandsFile="./temp_upd_comms.sh"

# Use the template commands file to create the real file
# And replace what's required
sed -e "s+PUT_APP_NAME_HERE+$appName+" \
    -e "s+PUT_BASE_DIRECTORY_HERE+$baseDir+" \
    -e "s+PUT_FRONTEND_DIRECTORY_HERE+$frontend+" \
    -e "s+PUT_API_DIRECTORY_HERE+$api+" $commandsTemplate > $tempCommandsFile

# Run the commands on the server
cat $tempCommandsFile | ssh $server

# Delete the commands file
rm $tempCommandsFile
