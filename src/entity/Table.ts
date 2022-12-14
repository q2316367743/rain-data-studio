export default interface Table {

    /**
     * ID
     */
    id?: number;

    /**
     * 创建时间，创建时赋值
     */
    createTime?: Date;

    /**
     * 更新时间，更新时赋值
     */
    updateTime?: Date;

    /**
     * 实例ID
     */
    instanceId: number;

    /**
     * 数据库ID
     */
    databaseId: number;

    /**
     * 表名
     */
    name: string;

}