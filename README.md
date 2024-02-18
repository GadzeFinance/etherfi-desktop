#etherfi-desktop

Set up guide: https://www.debugandrelease.com/creating-a-simple-electron-application/

## Notes

Python3.11 won't work, Python3.9 works

## Mac OS 11+ Set up guide

### Install Required Software:

```bash
# Use homebrew as a package manager see: https://brew.sh/ for more details
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

#----------------- Step 1: GIT ------------------
# check to see if you have git by running:
git --version
# If git is not found. Install it by running:
brew install git

#----------------- Step 2: NODE -----------------
# Check to see if you have node by running:
node --version
# If node is not found. Install it by running:
brew install node
# NOTE: you may want to install nvm which will allow
# you to change your node version (https://github.com/nvm-sh/nvm)

#----------------- Step 3: YARN -----------------
# Check to see if you have yarn by running:
yarn --version
# If yarn is not found. Install it by running:
npm install -g yarn

#---------------- Step 4: PYTHON ----------------
# Check if you have python3 and pip3 by running:
python3 --version
# NOTE: Python 3.11+ does not work. Please use Python version 3.9
pip3 --version
# If they are not found. Install them by running:
brew install python3

#---------------- Step 5: PYINSTALLER -----------
# check to see if you have pyinstaller by running:
pyinstaller --version
# If it is not found. Install it by running:
pip3 install pyinstaller
```

## The following steps assume you have all the required software installed, you have cloned etherfi-desktop and have changed into the directory.

### Run etherfi-desktop in dev mode (Allows you to update the frontend dynamically):

```bash
# Install node packages
yarn install

# build the python cli for generating validator keys
yarn buildclimac
# You may need to add executable permissions to the bundle_proxy_mac.sh script
# You can configure the python build by changing the bundle_proxy_mac.sh script
# Python is built with pyinstaller.

# IMPORTANT Run both of the following commands in seperate terminals AT THE SAME TIME!
yarn run dev-server # Running in one terminal
yarn run dev # Running in another terminal
```

### Run etherfi-desktop in Prod mode:

```bash
# Install node packages
yarn install

# Use webpack to bundle the electron and react code
yarn buildNode

# build the python cli for generating validator keys
yarn buildclimac
# You can configure the python build by changing the bundle_proxy_mac.sh script
# Python is built with pyinstaller.

# build the bundled app
yarn run prod
```

### Build etherfi-desktop:

```bash
# Install node packages
yarn install

# Use webpack to bundle the electron and react code
yarn buildNode

# build the python cli for generating validator keys
yarn buildclimac
# You can configure the python build by changing the bundle_proxy_mac.sh script
# Python is built with pyinstaller.

# build the bundled app
yarn run dist --x64
# NOTE: you can add flags to this command that will build the app for a specific architecture (Flag Examples: --x64, --arm64)
# You can do use the --arm64 flag to build specifically for Apple Silicon Macs
# You cannot build for arm64 on an intel (x64 machine)
# Electron builder is used under the hood to build

```

## Windows 10 Set up guide

### Install Required Software:

Step 1: Install git: https://git-scm.com/download/win

Step 2: Install node: https://nodejs.org/en/download/

Note: When installing Python make sure you select 'Add Python to Path' in the installer.
Step 3: Install python3: https://www.python.org/downloads/windows/

```bash
# Upgrade pip
python -m pip install --upgrade --user pip
# Install pyinstaller
python -m pip install --user pyinstaller
# Install Cython
python -m pip install --user Cython
# Install yarn
npm install -g yarn
```

## The following steps assume you have all the required software installed, you have cloned etherfi-desktop and have changed into the directory.

### Run etherfi-desktop in dev mode (Allows you to update the frontend dynamically):

```bash
# Install node packages
yarn install

# build the python cli for generating validator keys
yarn buildcliwin
# You can configure the python build by changing the bundle_proxy_win.bat script
# Python is built with pyinstaller.

# IMPORTANT Run both of the following commands in seperate terminals AT THE SAME TIME!
yarn run dev-server # Running in one terminal
yarn run dev # Running in another terminal
```

### Run etherfi-desktop in Prod mode:

```bash
# Install node packages
yarn install

# Use webpack to bundle the electron and react code
yarn buildNode

# build the python cli for generating validator keys
yarn buildcliwin
# You can configure the python build by changing the bundle_proxy_win.bat script
# Python is built with pyinstaller.

# build the bundled app
yarn run prod
```

### Build etherfi-desktop:

```bash
# Install node packages
yarn install

# Use webpack to bundle the electron and react code
yarn buildNode

# build the python cli for generating validator keys
yarn buildcliwin
# You can configure the python build by changing the bundle_proxy_win.bat script
# Python is built with pyinstaller.

# build the bundled app
yarn run dist
# NOTE: you can add flags to this command that will build the app for a specific architecture (Flag Examples: --x64, --arm64)
# Electron builder is used under the hood to build
```

## Ubuntu 18.04 Set up guide

### Install Required Software:

```bash
sudo apt update && sudo apt -y upgrade

sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

sudo apt install -y python3.10-dev python3.10-distutils zlib1g-dev build-essential nodejs git

PATH="$HOME/.local/bin:$PATH"

curl -sSL https://bootstrap.pypa.io/get-pip.py -o get-pip.py
alias python3=python3.10
echo -e "\nalias python3=python3.10" >> ~/.bash_aliases
python3 get-pip.py
pip3 install pyinstaller

sudo corepack enable
```

## The following steps assume you have all the required software installed, you have cloned etherfi-desktop and have changed into the directory.

### Run etherfi-desktop in dev mode (Allows you to update the frontend dynamically):

```bash
# Install node packages
yarn install

# build the python cli for generating validator keys
yarn buildcli
# You can configure the python build by changing the bundle_proxy_linux.sh script
# Python is built with pyinstaller.

# IMPORTANT Run both of the following commands in seperate terminals AT THE SAME TIME!
yarn run dev-server # Running in one terminal
yarn run dev # Running in another terminal
```

### Run etherfi-desktop in Prod mode:

```bash
# Install node packages
yarn install

# Use webpack to bundle the electron and react code
yarn buildNode

# build the python cli for generating validator keys
yarn buildcli
# You can configure the python build by changing the bundle_proxy_linux.sh script
# Python is built with pyinstaller.

# build the bundled app
yarn run prod
```

### Build etherfi-desktop:

```bash
# Install node packages
yarn install

# Use webpack to bundle the electron and react code
yarn buildNode

# build the python cli for generating validator keys
yarn buildcli
# You can configure the python build by changing the bundle_proxy_linux.sh script
# Python is built with pyinstaller.

# build the bundled app
yarn run dist
# NOTE: you can add flags to this command that will build the app for a specific architecture (Flag Examples: --x64, --arm64)
# Electron builder is used under the hood to build
```
