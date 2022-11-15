import Dexie from 'dexie';
import Field from '@/entity/Field';

export default class FieldService {

    private readonly instance: Dexie.Table<Field, number>;

    constructor(instance: Dexie.Table<Field, number>) {
        this.instance = instance;
    }

    list(): Promise<Array<Field>> {
        return this.instance.toArray()
    }

    save(field: Field): Promise<number> {
        field.createTime = new Date();
        field.updateTime = new Date();
        return this.instance.put(field);
    }

}