import Dexie from 'dexie';
import Table from '@/entity/Table';

export default class TableService {

    private readonly instance: Dexie.Table<Table, number>;

    constructor(instance: Dexie.Table<Table, number>) {
        this.instance = instance;
    }

    list(): Promise<Array<Table>> {
        return this.instance.toArray()
    }

    save(table: Table): Promise<number> {
        table.createTime = new Date();
        table.updateTime = new Date();
        return this.instance.put(table);
    }

}