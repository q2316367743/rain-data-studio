const { ipcMain } = require('electron');

const mysql = require('mysql2/promise');

const schedule = require("node-schedule");

let connectItems = [];

async function connect(args) {
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
}

async function query(args) {
    for (let connect of connectItems) {
        if (connect.id = args.id) {
            console.log(args.sql)
            return {
                code: true,
                message: '成功',
                data: await connect.connect.query(args.sql)
            }
        }
    }
    return {
        code: false,
        message: '未找到链接，请连接数据库后重试'
    }
}

module.exports = function registerApplication(mainWindow) {
    // 定时任务，每隔5秒钟，向渲染进程发送数据库连接情况
    schedule.scheduleJob('0/5 * * * * ?', () => {
        let connectIds = [];
        for (let item of connectItems) {
            connectIds.push(item.id);
        }
        console.log('mysql:status - ', connectIds)
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
        return await connect(args);
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
        console.log('mysql:query - 1');
        let result = await query(args.options);
        if (!result.code) {
            // 失败了，重新链接
            console.log('mysql:query - 2');
            let conn = await connect(args.connect);
            if (!conn.code) {
                return {
                    code: false,
                    message: '链接失败'
                }
            }
        }
        console.log('mysql:query - 3');
        return await query(args.options);
    });

    ipcMain.handle('mysql:disconnect', (event, args) => {
        console.log('mysql:disconnect');
        for (let item of connectItems) {
            if (item.id = args.id) {
                // 移除这个
                connectItems = connectItems.filter(e => e.id !== args.id);
                break;
            }
        }
        return {
            code: true,
            message: '成功'
        };
    })

}