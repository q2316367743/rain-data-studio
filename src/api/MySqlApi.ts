import MessageEventEnum from "@/enumeration/MessageEventEnum";
import Result from "@/global/Result";
import emitter from "@/plugins/mitt";
import useInstanceStore from "@/store/InstanceStore";
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

export async function disconnect(options: MySqlConnectionOptions): Promise<void> {
    let result = await (ipcRenderer.invoke('mysql:disconnect', options) as Promise<Result<void>>);
    return Promise.resolve();
}

// 接收主进程传递过来的消息
ipcRenderer.on('mysql:status', (event: Event, args: Result<any>) => {
    if (args.code) {
        for (let nodeKey of args.data.connectIds) {
            useInstanceStore().setOnline(nodeKey, true);
        }
    }
})