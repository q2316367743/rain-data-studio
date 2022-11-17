import MessageEventEnum from "@/enumeration/MessageEventEnum";
import emitter from "@/plugins/mitt";
import TableItem from "@/view/TabItem";
import { defineStore } from "pinia";

const useTabStore = defineStore('tab', {
    state: () => ({
        stack: new Array<TableItem>()
    }),

    actions: {
        add(item: TableItem) {
            this.stack.push(item);
            emitter.emit(MessageEventEnum.TAB_ADD, item.id);
        },
        remove(id: number) {
            this.stack = this.stack.filter(e => e.id !== id);
        }
    }
});

export default useTabStore;