export default interface Database {

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
     * 数据库名名称
     */
    name: string;

    /**
     * 默认字符集名称
     */
    defaultCharacterSetName?: string;

    /**
     * 默认集合名称
     */
    defaultCollationName?: string;

    /**
     * SQL路径
     */
    sqlPath: string;

}