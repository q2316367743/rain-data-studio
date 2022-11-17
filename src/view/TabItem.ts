import TabPanelComponentEnum from "@/enumeration/TabPanelComponentEnum";
import TablePanelParam from "@/param/TablePanelParam";

export default interface TableItem {

    /**
     * 唯一，使用时间戳
     */
    id: number;

    /**
     * 名字，选项卡使用的名字
     */
    name: string;

    /**
     * 组件名称
     */
    component: TabPanelComponentEnum;

    /**
     * 参数
     */
    param: TablePanelParam;

}