adduser gv
# set password and friends
id gv
usermod -aG sudo gv
id gv

cd /home/gv
mkdir .ssh
cd .ssh
touch authorized_keys
sudo nano authorized_keys
# Copy paste ssh key
exit

ssh gv@host
# Make sure it works
# Everything else is using the new "gv" user
sudo nano /etc/ssh/sshd_config
# Set the following
PermitRootLogin no
PasswordAuthentication no
# Exit from nano
sudo systemctl reload sshd
# This stops ssh from being conducted with the root usermod

sudo chown -R gv:gv /home/gv
chmod 700 /home/gv/.ssh

# Update Apt and stuff
sudo apt update
sudo apt upgrade

sudo apt install sqlite3

# Install Node + Npm

curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Resolve EACCESS for npm
cd ~
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
sudo nano ~/.profile
# Add the following line
export PATH=~/.npm-global/bin:$PATH
# Exit from nano
source ~/.profile

# Update npm
npm install -g npm

# Download website
cd ~
npm install -g pm2
mkdir GuidingVision
cd GuidingVision
git clone git@github.com:KamS04/GuideVision.git .

# Install npm packages
cd api
npm install
cd ../frontend
npm install

# Build frontend
npm run build

sudo ufw enable
sudo ufw status
sudo ufw allow ssh
sudo ufw allow http

# Install+Setup Nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
# Put in the config that is in the GuideVision/nginx/default file
sudo nginx -that
# If all good
sudo service nginx restart

# Start the api
cd ~/GuidingVision/api
pm2 start ecosystem.config.js
pm2 show GuidingVision
# Make sure its all good
pm2 startup
# run the command it gives
pm2 save

# Then transfer the database and its all good
# Add the server to the namecheap dns