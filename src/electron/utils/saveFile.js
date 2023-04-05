const {dialog} = require('electron');

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