import Dexie from 'dexie';
import Instance from '@/entity/Instance';
import DexieInstance from '@/plugins/dexie';
import Database from '@/entity/Database';
import Table from '@/entity/Table';
import Field from '@/entity/Field';

export default class InstanceService {

    private readonly instance: Dexie.Table<Instance, number>;
    private readonly dexieInstance: DexieInstance;

    constructor(dexieInstance: DexieInstance, instance: Dexie.Table<Instance, number>) {
        this.instance = instance;
        this.dexieInstance = dexieInstance;
    }

    list(): Promise<Array<Instance>> {
        return this.instance.toArray()
    }

    save(instance: Instance): Promise<number> {
        instance.createTime = new Date();
        instance.updateTime = new Date();
        return this.instance.put(instance);
    }

    removeAll(instanceId: number): Promise<void> {
        // 移除全部
        return this.dexieInstance.transaction(
            'readwrite',
            ['instance', 'database', 'table', 'field'],
            async trans => {
                let instanceDao = trans.table('instance') as Dexie.Table<Instance, number>;
                let databaseDao = trans.table('database') as Dexie.Table<Database, number>;
                let tableDao = trans.table('table') as Dexie.Table<Table, number>;
                let fieldDao = trans.table('field') as Dexie.Table<Field, number>;
                let instance = instanceDao.get(instanceId);
                if (!instance) {
                    return Promise.reject('实例不存在，请刷新后重试！')
                }
                // 实例删除
                await instanceDao.delete(instanceId);
                // 数据库删除
                let databases = await databaseDao.where('instanceId')
                    .equals(instanceId)
                    .toArray();
                let databaseIds = databases.map(e => e.id!);
                if (databaseIds) {
                    await databaseDao.bulkDelete(databaseIds);
                }
                // 表删除
                let tables = await tableDao.where('instanceId')
                    .equals(instanceId)
                    .toArray();
                let tableIds = tables.map(e => e.id!);
                if (tableIds) {
                    await tableDao.bulkDelete(tableIds);
                }
                // 字段删除
                let fields = await fieldDao.where('instanceId')
                    .equals(instanceId)
                    .toArray();
                let fieldIds = fields.map(e => e.id!);
                if (fieldIds) {
                    await fieldDao.bulkDelete(fieldIds);
                }
            })
    }

}