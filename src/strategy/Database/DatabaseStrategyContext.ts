import InstanceTypeEnum from "@/enumeration/InstanceTypeEnum";
import DatabaseStrategy from "./DatabaseStrategy";
import MySqlDatabaseStrategy from "./impl/MySqlDatabaseStrategy";

/**
 * 策略上下文
 */
class DatabaseStrategyContext {

    private strategyMap = new Map<number, DatabaseStrategy>();
    private static instance = new DatabaseStrategyContext();

    private constructor() { }

    public static getInstance(): DatabaseStrategyContext {
        return this.instance;
    }

    public register(type: InstanceTypeEnum, strategy: DatabaseStrategy) {
        this.strategyMap.set(type, strategy);
    }

    public getStrategy(type: InstanceTypeEnum): DatabaseStrategy {
        let strategy = this.strategyMap.get(type);
        if (!strategy) {
            throw new Error('系统异常，数据库实例类型未知')
        }
        return strategy;
    }

}

const databaseStrategyContext = DatabaseStrategyContext.getInstance();

databaseStrategyContext.register(InstanceTypeEnum.MYSQL, new MySqlDatabaseStrategy())

export default databaseStrategyContext;