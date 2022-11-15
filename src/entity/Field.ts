export default interface Field {

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
     * 表ID
     */
    tableId: number;

    /**
     * 名称
     */
    name: string;

    /**
     * 类型：包含了类型、长度、是否无符号
     */
    type: string;

    /**
     * 备注
     */
    comment?: string;

    /**
     * 是否不能为空
     */
    notNull: boolean;

    /**
     * 默认表达式
     */
    defaultExpression: string;

    /**
     * 自增数字
     */
    autoIncrement?: number;

    /**
     * 列类型：NORMAL、GENERATED_VIRTUAL、GENERATED_STORED
     */
    columnKind?: string;

    /**
     * 更新时
     */
    onUpdate?: string;

    /**
     * 排序：
     */
    collation?: string;

}