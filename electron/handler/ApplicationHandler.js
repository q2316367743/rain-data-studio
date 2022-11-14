const {ipcMain} = require('electron');

/**
 * 注册应用
 * @param mainWindow window对象
 */
module.exports = function registerApplication(mainWindow) {
    ipcMain.on('application:openDevTools', (event, args) => {
        console.log('application:openDevTools');
        // 打开开发工具
        mainWindow.webContents.openDevTools();
    });
    ipcMain.on('application:toMin', (event, args) => {
        console.log('application:toMin');
        // 最小化
        mainWindow.minimize();
    });
    ipcMain.on('application:toMax', (event, args) => {
        console.log('application:toMax');
        // 最大化
        if (mainWindow.isMaximized()) {
            console.log('取消最大化')
            mainWindow.unmaximize();
        }else {
            console.log('进行最大化')
            mainWindow.maximize();
        }
    });
    ipcMain.on('application:doClose', (event, args) => {
        console.log('application:doClose');
        // 关闭
        mainWindow.close();
    });
}

