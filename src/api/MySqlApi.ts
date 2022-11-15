import Result from "@/global/Result";
import { resolve } from "path";
import { MySqlConnectionOptions } from "./entity/MySqlConnectionOptions";
import MySqlExecuteOptions from "./entity/MySqlExecuteOptions";

const { ipcRenderer } = window.require('electron');

export async function connect(options: MySqlConnectionOptions): Promise<void> {
    let result = await (ipcRenderer.invoke('mysql:connect', options) as Promise<Result<string>>);
    return Promise.resolve();
}

export async function execute(options: MySqlExecuteOptions): Promise<void> {
    let result = await (ipcRenderer.invoke('mysql:execute', options) as Promise<Result<string>>);
    return Promise.resolve();
}

export async function query(options: MySqlExecuteOptions): Promise<any> {
    let result = await (ipcRenderer.invoke('mysql:query', options) as Promise<Result<any>>);
    return Promise.resolve(result.data);
}