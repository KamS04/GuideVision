dumpFile='PUT_OUTPUT_FILE_HERE'
database='PUT_DATABASE_PATH_HERE'

appName='PUT_APP_NAME_HERE'

# Stop the pm2 app assuming it is running
pm2 stop $appName

# Delete the old database
rm -f $database

# Recreate the database from the dump file
sqlite3 $database ".read $dumpFile"

# Restart the pm2 app
pm2 start $appName

# Save the pm2 stack
pm2 save

# Delete the dumpFile
rm -f $dumpFile