import Database from "@/entity/Database";
import Instance from "@/entity/Instance";
import Table from "@/entity/Table";

export default interface TablePanelParam {

    /**
     * 实例
     */
    instance: Instance;

    /**
     * 数据库
     */
    database: Database;

    /**
     * 表
     */
    table: Table;


}