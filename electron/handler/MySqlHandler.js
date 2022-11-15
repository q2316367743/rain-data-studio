const { ipcMain } = require('electron');

const mysql = require('mysql2/promise');

const connectItems = [];

ipcMain.handle('mysql:connect', async (event, args) => {
    console.log('mysql:connect')
    // 链接
    try {
        let connect = await mysql.createConnection(args);
        connectItems.push({
            id: args.id,
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