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
}