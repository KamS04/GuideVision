RED='\033[0;31m'
GREEN='\033[0;32m'
NOCOLOR='\033[0m'

appName='PUT_APP_NAME_HERE'
directory='PUT_BASE_DIRECTORY_HERE'
frontend='PUT_FRONTEND_DIRECTORY_HERE'

pm2 stop $appName

cd $directory

oldHash=$(git log -1 | grep ^commit | cut -d " " -f 2)

git pull origin master

sleep 5s

newHash=$(git log -1 | grep ^commit | cut -d " " -f 2)

if [ $oldHash = $newHash ]
then
    printf "${RED}Nothing Changed\nAborting${NOCOLOR}\n"
else
    printf "${GREEN}Pull Successful\n${GREEN}Rebuilding${NOCOLOR}\n"
    cd $frontend
    npm run build
fi

pm2 start $appName

pm2 save
