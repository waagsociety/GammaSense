MY_HOME=${1}
NODE_VERSION=${2}
MY_USER=${3}

cd ${MY_HOME}
sudo su ${MY_USER} -c "curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} -o nodesource_setup.sh"

sudo bash nodesource_setup.sh

sudo apt-get install nodejs
sudo apt-get install build-essential
