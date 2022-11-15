import ConnectionOptions from "./ConnectionOptions";

export interface MySqlConnectionOptions extends ConnectionOptions {
    charsetNumber?: number;
    compress?: boolean;
    authSwitchHandler?: (data: any, callback: () => void) => any;
    connectAttributes?: { [param: string]: any };
    decimalNumbers?: boolean;
    isServer?: boolean;
    maxPreparedStatements?: number;
    namedPlaceholders?: boolean;
    nestTables?: boolean | string;
    passwordSha1?: string;
    pool?: any;
    rowsAsArray?: boolean;
    stream?: any;
    uri?: string;
    connectionLimit?: number;
    Promise?: any;
    queueLimit?: number;
    waitForConnections?: boolean;
}