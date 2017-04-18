GIT_DIR="${1}"
DEST_DIR="${2}"
REPO="${3}"
MY_USER=${4}

APP_DIR=${GIT_DIR}/app

if [ ! -d "${GIT_DIR}" ]
then
	sudo su $MY_USER -c "git clone ${REPO} ${GIT_DIR}"
elif sudo su $MY_USER -c "git -C ${GIT_DIR} remote -v update" | grep master | grep 'origin/master' | grep -v 'up to date' >/dev/null
then
  echo "Code not changed"
  exit 0
fi

cd ${GIT_DIR};

if ! sudo su $MY_USER -c "git pull"
then
    echo "ERROR pulling"
    exit 1
fi

cd ${APP_DIR}

if ! sudo su $MY_USER -c "npm prune && npm install"
then
    echo "Error running npm install"
    exit 1
fi

sudo su $MY_USER -c "rm -rf ./build"

if ! sudo su $MY_USER -c "npm run build"
then
    echo "Error running npm build"
    exit 1
fi

if [ -d "${DEST_DIR}" ]
then
    sudo rm -rf ${DEST_DIR}
fi

sudo mkdir ${DEST_DIR}

sudo cp -r ${APP_DIR}/build/* ${DEST_DIR}
sudo chown -R www-data:www-data ${DEST_DIR}
sudo chmod -R ug-w,o-rwx ${DEST_DIR}
