#!/bin/bash

usage() { echo "Usage $0 [-s Server] [-o Local Output File] [-l Local Database File] [-b BaseDirOnServer] [-a AppName] [-c CommandsTemplate]" 1>&2; exit 1; }

commandsTemplate="./commands.template.sh" # File to create commands from
outputFile="./output.sql" # Where the temporary dump file will be created on the local machine

while getopts ":s:o:l:b:a:c" option; do
    case "${option}" in
        s)
            server=${OPTARG} # Server to ssh into 
            ;;
        o)
            outputFile=${OPTARG}
            ;;
        l)
            database=${OPTARG} # The location of the local database from which the dump will be created
            ;;
        b)
            baseDirOnServer=${OPTARG} # Where the overall GuideVision directory is located on the server
            ;;
        a)
            appName=${OPTARG}
            ;;
        c)
            commandsTemplate=${OPTARG}
            ;;
        *)
            usage
            ;;
    esac
done

if     [ -z "$server" ] \
    || [ -z "$outputFile" ] \
    || [ -z "$database" ] \
    || [ -z "$baseDirOnServer" ] \
    || [ -z "$appName" ]; then
    usage
fi

# Dump the database contents into a dump file
sqlite3 $database .dump > $outputFile

# Replace some stuff in the dump file
createOriginal='CREATE TABLE'
createNew='CREATE TABLE IF NOT EXISTS'

insertOriginal='INSERT INTO'
insertNew='INSERT OR REPLACE INTO'

sed -i -e "s/$createOriginal/$createNew/" -e "s/$insertOriginal/$insertNew/" $outputFile

baseDir=$(ssh $server "realpath $baseDirOnServer")

outputFileOnServer="$baseDir/output.sql"

# Send the dump file to the server
scp $outputFile $server:$outputFileOnServer

rm $outputFile

databaseOnServer="$baseDir/api/guidingvision.db"

tempCommandFile='./temp_comms.sh'

# Replace the paths in the comms template
sed -e "s+PUT_DATABASE_PATH_HERE+$databaseOnServer+" \
    -e "s+PUT_OUTPUT_FILE_HERE+$outputFileOnServer+" \
    -e "s+PUT_APP_NAME_HERE+$appName+" $commandsTemplate > $tempCommandFile

# Run the commands on the server
cat $tempCommandFile | ssh $server

rm $tempCommandFile
