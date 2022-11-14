const { dialog } = require('electron');
const { ipcMain } = require('electron');

module.exports = function registerApplication(mainWindow) {
    ipcMain.on('dialog:message', (event, args) => {
        console.log('dialog:message');
        dialog.showMessageBox(mainWindow, args)
    })
}