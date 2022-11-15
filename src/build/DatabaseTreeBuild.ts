import DatabaseTreeItem from "@/view/DatabaseTreeItem";
import DatabaseTreeItemType from '@/enumeration/DatabaseTreeItemType'
import { instanceService } from "@/global/BeanFactory";

/**
 * 数据库树构造器
 * 一共五级：实例 -> 数据库 -> 类型 -> 表/视图 -> 字段
 * 
 * @returns 树
 */
export default async function databaseTreeBuild(): Promise<Array<DatabaseTreeItem>> {
    const items = new Array<DatabaseTreeItem>();
    // 查询全部实例
    const instances = await instanceService.list();
    for (let instance of instances) {
        items.push({
            name: instance.name,
            type: DatabaseTreeItemType.INSTANCE,
            data: instance,
            children: []
        })
    }
    return Promise.resolve(items);
}