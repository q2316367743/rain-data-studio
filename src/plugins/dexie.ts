import Dexie from 'dexie';

import Instance from '@/entity/Instance';


export default class DexieInstance extends Dexie {

    private readonly instance: Dexie.Table<Instance, number>;

    constructor() {
        super('es-client');
        this.version(4).stores({
            instance: '++id, &name',
        }).upgrade(trans => {
            console.log(trans)
        })
        this.instance = this.table('instance');
    }

    public getInstance(): Dexie.Table<Instance, number> {
        return this.instance;
    }


}