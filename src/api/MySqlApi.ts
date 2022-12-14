import MessageEventEnum from "@/enumeration/MessageEventEnum";
import Result from "@/global/Result";
import emitter from "@/plugins/mitt";
import useInstanceStore from "@/store/InstanceStore";
import { resolve } from "path";
import { MySqlConnectionOptions } from "./entity/MySqlConnectionOptions";
import MySqlExecuteOptions from "./entity/MySqlExecuteOptions";

const { ipcRenderer } = window.require('electron');

// 接收主进程传递过来的消息
ipcRenderer.on('mysql:status', (event: Event, args: Result<any>) => {
    if (args.code) {
        for (let nodeKey of args.data.connectIds) {
            useInstanceStore().setOnline(nodeKey + '', true);
        }
    }
});

export default {
    async connect(options: MySqlConnectionOptions): Promise<void> {
        let result = await (ipcRenderer.invoke('mysql:connect', options) as Promise<Result<string>>);
        return Promise.resolve();
    },

    async execute(options: MySqlExecuteOptions): Promise<void> {
        let result = await (ipcRenderer.invoke('mysql:execute', options) as Promise<Result<string>>);
        return result.code ? Promise.resolve() : Promise.reject(result.message);
    },

    async query(options: MySqlExecuteOptions, connect: MySqlConnectionOptions): Promise<any> {
        console.log(options)
        let result = await (ipcRenderer.invoke('mysql:query', {
            options,
            connect
        }) as Promise<Result<any>>);
        return result.code ? Promise.resolve(result.data) : Promise.reject(result.message);
    },

    async disconnect(options: MySqlConnectionOptions): Promise<void> {
        let result = await (ipcRenderer.invoke('mysql:disconnect', options) as Promise<Result<void>>);
        return Promise.resolve();
    }
}