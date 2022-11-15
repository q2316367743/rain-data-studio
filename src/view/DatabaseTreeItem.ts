import Instance from "@/entity/Instance";
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
    data: Instance;

    /**
     * 子项
     */
    children: Array<DatabaseTreeItem>;

}