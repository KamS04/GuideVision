RED='\033[0;31m'
GREEN='\033[0;32m'
NOCOLOR='\033[0m'

appName='PUT_APP_NAME_HERE'
directory='PUT_BASE_DIRECTORY_HERE'
api="PUT_API_DIRECTORY_HERE"
frontend='PUT_FRONTEND_DIRECTORY_HERE'

pm2 stop $appName

cd $directory

# Get the commit id for the current commit
oldCommit=$(git log -1 | grep ^commit | cut -d " " -f 2)

# Get the hashed for the package, and package-lock files
old_api_package=$(sha1sum "$api/package.json")
old_api_package_lock=$(sha1sum "$api/package-lock.json")

old_frontend_package=$(sha1sum "$frontend/package.json")
old_frontend_package_lock=$(sha1sum "$frontend/package-lock.json")

git pull origin master

sleep 5s
# Get the commit id for the new commit
newCommit=$(git log -1 | grep ^commit | cut -d " " -f 2)

if [ $oldCommit = $newCommit ]
then
    printf "${RED}Nothing Changed\nAborting${NOCOLOR}\n"
else
    printf "${GREEN}Pull Successful\n${NOCOLOR}"
    # Get the new hashes for the package, package-lock files
    new_api_package=$(sha1sum "$api/package.json")
    new_api_package_lock=$(sha1sum "$api/package-lock.json")

    new_frontend_package=$(sha1sum "$frontend/package.json")
    new_frontend_package_lock=$(sha1sum "$frontend/package-lock.json")

    if [ old_api_package != new_api_package ] || [ old_api_package_lock != new_api_package_lock ]; then
        printf "${GREEN}Api package changed, installing...${NOCOLOR}\n"
        cd $api
        npm install
    fi

    if [ old_frontend_package != new_frontend_package ] || [ old_frontend_package_lock != new_frontend_package_lock ]; then
        printf "${GREEN}Frontend package changed, installing...${NOCOLOR}\n"
        cd $frontend
        npm install
    fi

    printf "${GREEN}Rebuilding Frontend${NOCOLOR}\n"
    cd $frontend
    npm run build
fi

pm2 start $appName

pm2 save
