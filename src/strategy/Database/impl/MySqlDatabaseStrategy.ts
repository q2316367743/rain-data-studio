import Instance from "@/entity/Instance";
import DatabaseStrategy from "../DatabaseStrategy";

import { connect, query } from '@/api/MySqlApi'
import { ElLoading } from "element-plus";
import { databaseService, fieldService, tableService } from "@/global/BeanFactory";

export default class MySqlDatabaseStrategy implements DatabaseStrategy {

    async init(instance: Instance): Promise<void> {
        const loading = ElLoading.service({
            lock: true,
            text: '开始连接数据库',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            // 创建链接
            await connect({
                id: instance.id!,
                user: instance.username,
                password: instance.password,
                host: instance.host,
                port: instance.port,
                database: instance.database
            });
            // 查询全部数据库
            loading.setText('查询全部数据库')
            let result = await query({
                id: instance.id!,
                sql: 'show databases;'
            });
            // 根据数据库，查询全部的表
            let databases = result[0] as Array<any>;
            for (let database of databases) {
                // 每个数据库
                let databaseName = database['Database'];
                loading.setText(`开始处理数据库【${databaseName}】`)
                let databaseId = await databaseService.save({
                    instanceId: instance.id!,
                    name: databaseName,
                    // 默认展示
                    show: true,
                    createTime: new Date(),
                });
                // 查询表的结果
                let tableResult = await query({
                    id: instance.id!,
                    sql: `select table_name from information_schema.tables where table_schema='${databaseName}';`
                });
                let tables = tableResult[0] as Array<any>;
                for (let table of tables) {
                    let tableName = table['table_name'];
                    loading.setText(`开始处理数据库【${databaseName}】 - 【${tableName}】`)
                    let tableId = await tableService.save({
                        databaseId: databaseId,
                        instanceId: instance.id!,
                        name: tableName
                    });
                    let fieldResult = await query({
                        id: instance.id!,
                        sql: `SHOW FULL COLUMNS FROM ${databaseName}.${tableName};`
                    });
                    let fields = fieldResult[0] as Array<any>;
                    for (let field of fields) {
                        await fieldService.save({
                            instanceId: instance.id!,
                            databaseId: databaseId,
                            tableId: tableId,
                            name: field['Field'],
                            type: field['Type'],
                            collation: field['Collation'],
                            notNull: field['NULL'] === 'NO',
                            defaultExpression: field['Default'],
                            comment: field['Comment']
                        })
                    }
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.close();
        }
        return Promise.resolve();
    }

}