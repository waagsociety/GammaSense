MY_FILE=${1}
NODE_VERSION=${2}
MY_USER=${3}

sudo su ${MY_USER} -c "curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} -o ${MY_FILE}"

sudo bash ${MY_FILE}

sudo apt-get install nodejs
sudo apt-get install build-essential
