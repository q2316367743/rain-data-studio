import DatabaseTreeItem from "@/view/DatabaseTreeItem";
import DatabaseTreeItemType from '@/enumeration/DatabaseTreeItemType'
import { databaseService, fieldService, instanceService, tableService } from "@/global/BeanFactory";
import ArrayUtil from "@/utils/ArrayUtil";
import Database from "@/entity/Database";
import Table from "@/entity/Table";
import Field from "@/entity/Field";

function buildDatabase(
    instanceId: number,
    instanceItemChildren: Array<DatabaseTreeItem>,
    databaseMap: Map<number, Array<Database>>,
    tableMap: Map<number, Array<Table>>,
    fieldMap: Map<number, Array<Field>>) {
    // 数据库
    let databaseList = databaseMap.get(instanceId);
    if (databaseList) {
        for (let database of databaseList) {
            let databaseItem = {
                id: database.id!,
                name: database.name,
                type: DatabaseTreeItemType.DATABASE,
                data: database,
                children: []
            } as DatabaseTreeItem;
            let tableTypeItem = {
                id: new Date().getTime(),
                name: '表',
                type: DatabaseTreeItemType.TYPE,
                children: []
            } as DatabaseTreeItem;
            let viewTypeItem = {
                id: new Date().getTime(),
                name: '视图',
                type: DatabaseTreeItemType.TYPE,
                children: []
            } as DatabaseTreeItem;
            // 构建表
            buildTable(databaseItem.id,
                tableTypeItem.children,
                tableMap,
                fieldMap);
            // 如果表至少存在一个
            if (tableTypeItem.children.length > 0) {
                databaseItem.children.push(tableTypeItem);
            }
            // 如果视图至少存在一个
            if (viewTypeItem.children.length > 0) {
                databaseItem.children.push(viewTypeItem);
            }
            // 将数据库插入的实例中
            instanceItemChildren.push(databaseItem);
        }
    }
}

function buildTable(
    databaseId: number,
    databaseItemChildren: Array<DatabaseTreeItem>,
    tableMap: Map<number, Array<Table>>,
    fieldMap: Map<number, Array<Field>>
) {
    let tableList = tableMap.get(databaseId);
    if (tableList) {
        for (let table of tableList) {
            let tableItem = {
                id: table.id,
                name: table.name,
                type: DatabaseTreeItemType.TABLE,
                data: table,
                children: []
            } as DatabaseTreeItem;
            // 字段
            buildField(tableItem.id, tableItem.children, fieldMap);
            // 将表插入
            databaseItemChildren.push(tableItem);
        }
    }
}

function buildField(
    tableId: number,
    tableItemChildren: Array<DatabaseTreeItem>,
    fieldMap: Map<number, Array<Field>>
) {
    let fieldList = fieldMap.get(tableId);
    if (fieldList) {
        for (let field of fieldList) {
            let fieldItem = {
                id: field.id!,
                name: field.name,
                type: DatabaseTreeItemType.FIELD,
                data: field,
                children: []
            } as DatabaseTreeItem;
            tableItemChildren.push(fieldItem);
        }
    }
}

/**
 * 数据库树构造器
 * 一共五级：实例 -> 数据库 -> [类型] -> 表/视图 -> [分组] -> 字段/键/索引
 * 
 * @returns 树
 */
export default async function databaseTreeBuild(): Promise<Array<DatabaseTreeItem>> {
    const items = new Array<DatabaseTreeItem>();
    // 查询全部实例
    const instances = await instanceService.list();
    // 查询全局数据库
    const databases = await databaseService.list();
    // 数据库map
    const databaseMap = ArrayUtil.group(databases, 'instanceId');
    // 查询全部的表
    const tables = await tableService.list();
    // 表map
    const tableMap = ArrayUtil.group(tables, 'databaseId');
    // 查询全部的字段
    const fields = await fieldService.list();
    // 字段map
    const fieldMap = ArrayUtil.group(fields, 'tableId');
    for (let instance of instances) {
        // 实例
        let instanceItem = {
            id: instance.id!,
            name: instance.name,
            type: DatabaseTreeItemType.INSTANCE,
            data: instance,
            children: []
        } as DatabaseTreeItem;
        buildDatabase(instanceItem.id,
            instanceItem.children,
            databaseMap,
            tableMap,
            fieldMap)
        items.push(instanceItem)
    }
    return Promise.resolve(items);
}