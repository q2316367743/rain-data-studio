import Dexie from 'dexie';

import Instance from '@/entity/Instance';
import Database from '@/entity/Database';
import Table from '@/entity/Table';
import Field from '@/entity/Field';


export default class DexieInstance extends Dexie {

    private readonly instance: Dexie.Table<Instance, number>;
    private readonly database: Dexie.Table<Database, number>;
    private readonly tableDexie: Dexie.Table<Table, number>;
    private readonly field: Dexie.Table<Field, number>;

    constructor() {
        super('rain-data-studio');
        this.version(4).stores({
            instance: '++id, &name',
            database: '++id, instanceId',
            table: '++id, instanceId, databaseId',
            field: '++id, instanceId, databaseId, tableId'
        }).upgrade(trans => {
            console.log(trans)
        })
        this.instance = this.table('instance');
        this.database = this.table('database');
        this.tableDexie = this.table('table');
        this.field = this.table('field');
    }

    public getInstance(): Dexie.Table<Instance, number> {
        return this.instance;
    }

    public getDatabase(): Dexie.Table<Database, number> {
        return this.database;
    }

    public getTable(): Dexie.Table<Table, number> {
        return this.tableDexie;
    }

    public getField(): Dexie.Table<Field, number> {
        return this.field;
    }


}