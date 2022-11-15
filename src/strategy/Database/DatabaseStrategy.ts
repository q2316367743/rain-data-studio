import Instance from "@/entity/Instance";

/**
 * 数据库策略
 */
export default interface DatabaseStrategy {

    /**
     * 初始化
     */
    init: (instance: Instance) => Promise<void>;

}