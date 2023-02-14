const {dialog} = require('electron');
var fs = require('fs');

module.exports = {
    saveFile: async function (JSONfile, saveOptions) {
        saveOptions["filters"] = [{name: 'json', extensions: ['json']}]
        saveOptions["properties"] = [{createDirectory:true}]
        
        await dialog.showSaveDialog(null, saveOptions).then(({ filePath }) => {
            fs.writeFileSync(filePath, JSON.stringify(JSONfile), 'utf-8');            
        });
    },
    selectFolder: async function () {
        loadOptions = {
            properties: ['openDirectory', 'createDirectory']
        }
        return await dialog.showOpenDialog(loadOptions);
    },
    selectJsonFile: async function () {
        loadOptions = {
            filters: [{name: 'json', extensions: ['json']}],
            properties: ['openFile']
        }
        return await dialog.showOpenDialog(loadOptions);
    }
}