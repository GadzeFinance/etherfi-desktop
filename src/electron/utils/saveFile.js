const {dialog} = require('electron');
var fs = require('fs');

module.exports = {
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