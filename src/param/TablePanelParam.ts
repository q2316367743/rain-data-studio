import Instance from "@/entity/Instance";
import Table from "@/entity/Table";

export default interface TablePanelParam {

    /**
     * 实例
     */
    instance: Instance;

    /**
     * 表
     */
    table: string;

    /**
     * 表
     */
    name: string;

}