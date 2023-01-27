#etherfi-desktop

Set up guide: https://www.debugandrelease.com/creating-a-simple-electron-application/

## How to run in dev mode: 
Note: make sure you run 'npm install' before attempting to run the application
```bash
# This will run the webpack server. It will rebundle the application when you make front end changes
npm run dev-server 
# This will launch the electron application using the webpack server.
npm run dev
```

## How to run in prod mode: 
Note: make sure you run 'npm install' before attempting to run the application
```bash
npm run preprod

npm run prod

```

## How to build for distribution: 
Note: make sure you run 'npm install' before attempting to run the application
```bash
npm run dist

```
