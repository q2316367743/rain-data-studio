const { ipcMain } = require('electron');

const mysql = require('mysql2/promise');

const schedule = require("node-schedule");

const connectItems = [];

module.exports = function registerApplication(mainWindow) {
    // 定时任务，每隔5秒钟，向渲染进程发送数据库连接情况
    schedule.scheduleJob('0/5 * * * * ?', () => {
        let connectIds = [];
        for (let item of connectItems) {
            connectIds.push(item.id);
        }
        console.log('mysql:status')
        mainWindow.webContents.send('mysql:status', {
            code: true,
            message: '成功',
            data: {
                time: new Date().getTime(),
                connectIds: connectIds
            }
        })
    })

    ipcMain.handle('mysql:connect', async (event, args) => {
        console.log('mysql:connect')
        // 链接
        try {
            let id = args.id;

            // 连接前，先判断ID是否存在
            for (let item of connectItems) {
                if (item.id === id) {
                    // 找到ID，直接返回成功
                    return {
                        code: true,
                        message: '成功'
                    }
                }
            }

            // 删除多余的ID属性
            delete args.id;
            let connect = await mysql.createConnection(args);
            connectItems.push({
                id: id,
                connect: connect
            });
            return {
                code: true,
                message: '成功'
            }
        } catch (e) {
            return {
                code: false,
                message: '失败',
                data: e
            }
        }
    });

    ipcMain.handle('mysql:execute', async (event, args) => {
        console.log('mysql:execute');
        for (let connect of connectItems) {
            if (connect.id = args.id) {
                return {
                    code: true,
                    message: '成功',
                    data: await connect.connect.execute(args.sql)
                }
            }
        }
        return {
            code: false,
            message: '未找到链接，请连接数据库后重试'
        }
    });

    ipcMain.handle('mysql:query', async (event, args) => {
        console.log('mysql:query');
        for (let connect of connectItems) {
            if (connect.id = args.id) {
                return {
                    code: true,
                    message: '成功',
                    data: await connect.connect.execute(args.sql)
                }
            }
        }
        return {
            code: false,
            message: '未找到链接，请连接数据库后重试'
        }
    })

}