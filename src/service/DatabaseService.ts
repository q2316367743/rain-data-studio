import Dexie from 'dexie';
import Database from '@/entity/Database';

export default class DatabaseService {

    private readonly instance: Dexie.Table<Database, number>;

    constructor(instance: Dexie.Table<Database, number>) {
        this.instance = instance;
    }

    list(): Promise<Array<Database>> {
        return this.instance.toArray()
    }

}