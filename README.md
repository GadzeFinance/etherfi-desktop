#etherfi-desktop

Set up guide: https://www.debugandrelease.com/creating-a-simple-electron-application/

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

# build the bundled app
yarn run dist --x64
# NOTE: --x64 will work for intel and Apple Silicon Macs
# You can do use the --arm64 flag to build specifically for Apple Silicon Macs
```

## Windows 10 Set up guide

### Install Required Software:

Install git: https://git-scm.com/download/win

Install node: https://nodejs.org/en/download/

Note: When installing Python make sure you select 'Add Python to Path' in the installer.
Install python3: https://www.python.org/downloads/windows/

```bash
python -m pip install --upgrade --user pip
python -m pip install --user pyinstaller
python -m pip install --user Cython
npm install -g yarn

yarn install
yarn buildNode
yarn buildcliwin
```
