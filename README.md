#etherfi-desktop

Set up guide: https://www.debugandrelease.com/creating-a-simple-electron-application/

## Make sure yarn is installed!!: 
```bash
npm install -g yarn # This is for mac
```

## How to run in dev mode: 
Note: make sure you run 'yarn install' before attempting to run the application
```bash
# This will run the webpack server. It will rebundle the application when you make front end changes
yarn run dev-server 
# This will launch the electron application using the webpack server.
yarn run dev
```

## How to run in prod mode: 
Note: make sure you run 'yarn install' before attempting to run the application
```bash
yarn run buildNode

yarn run buildcli 
# OR for windows
yarn run buildcliwin

yarn run prod
```

## How to build for distribution: 
Note: make sure you run 'yarn install' before attempting to run the application
```bash
yarn run buildNode
yarn run buildcli 
# OR for windows
yarn run buildcliwin

yarn run dist
```
