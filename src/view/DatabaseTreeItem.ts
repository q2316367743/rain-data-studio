import Database from "@/entity/Database";
import Field from "@/entity/Field";
import Instance from "@/entity/Instance";
import Table from "@/entity/Table";
import DatabaseTreeItemType from "@/enumeration/DatabaseTreeItemType";

export default interface DatabaseTreeItem {

    /**
     * 唯一ID
     */
    id: number;

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
     * 子项
     */
    children: Array<DatabaseTreeItem>;

}