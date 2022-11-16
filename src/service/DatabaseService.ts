import Dexie from 'dexie';
import Database from '@/entity/Database';
import DexieInstance from '@/plugins/dexie';
import ArrayUtil from '@/utils/ArrayUtil';

export default class DatabaseService {

    private readonly instance: Dexie.Table<Database, number>;
    private readonly dexieInstance: DexieInstance;

    constructor(dexieInstance: DexieInstance, instance: Dexie.Table<Database, number>) {
        this.instance = instance;
        this.dexieInstance = dexieInstance;
    }

    list(): Promise<Array<Database>> {
        return this.instance.toArray()
    }

    listByInstanceId(instanceId: number): Promise<Array<Database>> {
        return this.instance.where('instanceId').equals(instanceId).toArray()
    }

    save(database: Database): Promise<number> {
        database.createTime = new Date();
        database.updateTime = new Date();
        return this.instance.put(database);
    }

    /**
     * 展示数据库
     * 
     * @param instanceId  实例ID
     * @param databaseIds 需要展示的数据库ID
     */
    show(instanceId: number, databaseIds: Array<number>): Promise<void> {
        if (!databaseIds) {
            return Promise.reject('数据库ID不能为空')
        }
        // 先不显示这个实例的全部数据库
        return this.dexieInstance.transaction('readwrite', ['database'],
            async trans => {
                // 获取到数据库实例
                let databaseInstance = trans.table('database') as Dexie.Table<Database, number>;
                let databases = await databaseInstance.where('instanceId').equals(instanceId).toArray()
                // 下架全部
                for (let database of databases) {
                    database.show = false;
                    databaseInstance.put(database);
                }
                // 再将新的展示出来
                let databaseMap = ArrayUtil.map(databases, 'id');
                for (let databaseId of databaseIds) {
                    let temp = databaseMap.get(databaseId);
                    if (temp) {
                        temp.show = true;
                        databaseInstance.put(temp);
                    } else {
                        console.error('数据库[{}]不存在', databaseId);
                    }
                }

            })
    }

}