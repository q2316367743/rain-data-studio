import Database from "@/entity/Database";
import Field from "@/entity/Field";
import Instance from "@/entity/Instance";
import Table from "@/entity/Table";
import DatabaseTreeItemType from "@/enumeration/DatabaseTreeItemType";

export default interface DatabaseTreeItem {

    /**
     * 唯一ID,同一组唯一
     */
    id: number;

    /**
     * 从头代为的ID，-分割，全局唯一
     */
    nodeKey: string;

    /**
     * 名字Key，用于搜索
     */
    nameKey: string;

    /**
     * 显示的名字
     */
    name: string;

    /**
     * 项的类型
     */
    type: DatabaseTreeItemType;

    /**
     * 此处保存的数据
     */
    data?: Instance | Database | Table | Field;

    /**
     * 子项，对于实例，此显示实例下全部可展示的数据库
     */
    children: Array<DatabaseTreeItem>;

    /**
     * 尽在实例下有效，实例下全部的数据库
     */
    all?: Array<DatabaseTreeItem>;

    /**
     * 是否在线，只有实例有效
     */
    online?: boolean;

}