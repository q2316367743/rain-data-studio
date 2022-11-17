import DatabaseTreeItem from "@/view/DatabaseTreeItem";
import DatabaseTreeItemType from '@/enumeration/DatabaseTreeItemType'
import { databaseService, fieldService, instanceService, tableService } from "@/global/BeanFactory";
import ArrayUtil from "@/utils/ArrayUtil";
import Database from "@/entity/Database";
import Table from "@/entity/Table";
import Field from "@/entity/Field";

function buildDatabase(
    instanceId: number,
    nameKey: string,
    nodeKey: string,
    instanceItemChildren: Array<DatabaseTreeItem>,
    instanceItemAll: Array<DatabaseTreeItem>,
    databaseMap: Map<number, Array<Database>>,
    tableMap: Map<number, Array<Table>>,
    fieldMap: Map<number, Array<Field>>,
    nodeKeys: Array<string>) {
    // 数据库
    let databaseList = databaseMap.get(instanceId);
    if (databaseList) {
        for (let database of databaseList) {
            let databaseItem = {
                id: database.id!,
                nodeKey: nodeKey + '-' + database.id!,
                nameKey: nameKey + database.name,
                name: database.name,
                type: DatabaseTreeItemType.DATABASE,
                data: database,
                children: []
            } as DatabaseTreeItem;
            if (database.show) {
                // 展示的表
                let tableTypeItem = {
                    id: new Date().getTime(),
                    nodeKey: databaseItem + '-t1',
                    nameKey: nameKey + database.name,
                    name: '表',
                    type: DatabaseTreeItemType.TYPE,
                    children: []
                } as DatabaseTreeItem;
                let viewTypeItem = {
                    id: new Date().getTime(),
                    nodeKey: databaseItem + '-t2',
                    nameKey: nameKey + database.name,
                    name: '视图',
                    type: DatabaseTreeItemType.TYPE,
                    children: []
                } as DatabaseTreeItem;
                // 构建表
                buildTable(databaseItem.id,
                    databaseItem.nameKey,
                    databaseItem.nodeKey,
                    tableTypeItem.children,
                    tableMap,
                    fieldMap,
                    nodeKeys);
                // 如果表至少存在一个
                if (tableTypeItem.children.length > 0) {
                    databaseItem.children.push(tableTypeItem);
                    nodeKeys.push(tableTypeItem.nodeKey);
                }
                // 如果视图至少存在一个
                if (viewTypeItem.children.length > 0) {
                    databaseItem.children.push(viewTypeItem);
                    nodeKeys.push(viewTypeItem.nodeKey);
                }
                // 将数据库插入的实例中
                instanceItemChildren.push(databaseItem);
                nodeKeys.push(databaseItem.nodeKey);
            }
            // 放到全部
            instanceItemAll.push(databaseItem);
        }
    }
}

function buildTable(
    databaseId: number,
    nameKey: string,
    nodeKey: string,
    databaseItemChildren: Array<DatabaseTreeItem>,
    tableMap: Map<number, Array<Table>>,
    fieldMap: Map<number, Array<Field>>,
    nodeKeys: Array<string>
) {
    let tableList = tableMap.get(databaseId);
    if (tableList) {
        for (let table of tableList) {
            let tableItem = {
                id: table.id!,
                nodeKey: nodeKey + '-' + table.id!,
                nameKey: nameKey + table.name,
                name: table.name,
                type: DatabaseTreeItemType.TABLE,
                data: table,
                children: []
            } as DatabaseTreeItem;
            let fieldTypeItem = {
                id: new Date().getTime(),
                nodeKey: tableItem.nodeKey + '-g1',
                nameKey: nameKey + table.name,
                name: '列',
                type: DatabaseTreeItemType.GROUP,
                children: []
            } as DatabaseTreeItem;
            // 字段
            buildField(tableItem.id,
                tableItem.nameKey,
                tableItem.nodeKey,
                fieldTypeItem.children,
                fieldMap,
                nodeKeys);
            if (fieldTypeItem.children.length > 0) {
                tableItem.children.push(fieldTypeItem);
                nodeKeys.push(fieldTypeItem.nodeKey);
            }
            // 将表插入
            databaseItemChildren.push(tableItem);
            nodeKeys.push(tableItem.nodeKey);
        }
    }
}

function buildField(
    tableId: number,
    nameKey: string,
    nodeKey: string,
    tableItemChildren: Array<DatabaseTreeItem>,
    fieldMap: Map<number, Array<Field>>,
    nodeKeys: Array<string>
) {
    let fieldList = fieldMap.get(tableId);
    if (fieldList) {
        for (let field of fieldList) {
            let fieldItem = {
                id: field.id!,
                nodeKey: nodeKey + '-' + field.id!,
                nameKey: nameKey + field.name,
                name: field.name,
                type: DatabaseTreeItemType.FIELD,
                data: field,
                children: []
            } as DatabaseTreeItem;
            tableItemChildren.push(fieldItem);
            nodeKeys.push(fieldItem.nodeKey);
        }
    }
}

/**
 * 数据库树构造器
 * 一共五级：实例 -> 数据库 -> [类型] -> 表/视图 -> [分组] -> 字段/键/索引
 * 
 * @returns 树
 */
export default async function databaseTreeBuild(): Promise<[Array<DatabaseTreeItem>, Array<string>]> {
    // 实例
    const items = new Array<DatabaseTreeItem>();
    // 节点唯一
    const nodeKeys = new Array<string>();
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
            nodeKey: instance.id! + '',
            nameKey: instance.name,
            type: DatabaseTreeItemType.INSTANCE,
            data: instance,
            children: [],
            all: [],
            online: false
        } as DatabaseTreeItem;
        buildDatabase(instanceItem.id,
            instanceItem.nameKey,
            instanceItem.nodeKey,
            instanceItem.children,
            instanceItem.all!,
            databaseMap,
            tableMap,
            fieldMap,
            nodeKeys)
        items.push(instanceItem);
        nodeKeys.push(instanceItem.nodeKey)
    }
    return Promise.resolve([items, nodeKeys]);
}