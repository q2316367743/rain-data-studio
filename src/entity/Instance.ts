import InstanceTypeEnum from "@/enumeration/InstanceTypeEnum";

/**
 * 实例
 */
export default interface Instance {

    /**
     * 主键，自增
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
     * 数据库名字
     */
    name: string;

    /**
     * 数据库类型
     */
    type: InstanceTypeEnum;

    /**
     * 主机
     */
    host: string;

    /**
     * 端口
     */
    port: number;

    /**
     * 用户名
     */
    username: string;

    /**
     * 密码
     */
    password: string;

}