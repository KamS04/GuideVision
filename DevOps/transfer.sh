#!/bin/bash

# The Server to ssh into
server='homeserver'

# Where the temporary dump file will be created on the local machine
outputFile='D:\\Code\\web\\Projects\\CAS\\GuideVision\\output.sql'
# The location of the local database from which the dump will be created
database='D:\\Code\\web\\Projects\\CAS\\GuideVision\\DB-Browser\\database.db'

# Dump the database contents into a dump file
sqlite3 $database .dump > $outputFile

# Replace some stuff in the dump file
createOriginal='CREATE TABLE'
createNew='CREATE TABLE IF NOT EXISTS'

insertOriginal='INSERT INTO'
insertNew='INSERT OR REPLACE INTO'

sed -i -e "s/$createOriginal/$createNew/" -e "s/$insertOriginal/$insertNew/" $outputFile

# Where the overall GuideVision directory is located on the server
baseDirOnServer='~/Documents/GuideVision'

baseDir=$(ssh $server "realpath $baseDirOnServer")

outputFileOnServer="$baseDir/output.sql"

# Send the dump file to the server
scp $outputFile $server:$outputFileOnServer

rm $outputFile

databaseOnServer="$baseDir/api/guidingvision.db"

tempCommandFile='./temp_comms.sh'

appName='GuidingVision'

# Replace the paths in the comms template
sed -e "s+PUT_DATABASE_PATH_HERE+$databaseOnServer+" -e "s+PUT_OUTPUT_FILE_HERE+$outputFileOnServer+" -e "s+PUT_APP_NAME_HERE+$appName+" "./commands.template.sh" > $tempCommandFile

# Run the commands on the server
cat $tempCommandFile | ssh $server

rm $tempCommandFile