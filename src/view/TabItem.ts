import TablePanelParam from "@/param/TablePanelParam";

export default interface TableItem {

    /**
     * 唯一，使用时间戳
     */
    id: number;

    /**
     * 名字
     */
    name: string;

    /**
     * 组件名称
     */
    component: string;

    /**
     * 参数
     */
    param: TablePanelParam;

}