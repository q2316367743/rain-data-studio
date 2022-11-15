import Dexie from 'dexie';
import Instance from '@/entity/Instance';

export default class InstanceService {

    private readonly instance: Dexie.Table<Instance, number>;

    constructor(instance: Dexie.Table<Instance, number>) {
        this.instance = instance;
    }

    list(): Promise<Array<Instance>> {
        return this.instance.toArray()
    }

    save(instance: Instance): Promise<number> {
        instance.createTime = new Date();
        instance.updateTime = new Date();
        return this.instance.put(instance);
    }

}