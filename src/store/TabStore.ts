import DatabaseTreeItemType from "@/enumeration/DatabaseTreeItemType";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import TablePanelParam from "@/param/TablePanelParam";
import emitter from "@/plugins/mitt";
import TableItem from "@/view/TabItem";
import { defineStore } from "pinia";

function getComponent(type: DatabaseTreeItemType): string {
    if (type === DatabaseTreeItemType.TABLE) {
        return 'table-panel-vue'
    }
    return '';
}

const useTabStore = defineStore('tab', {
    state: () => ({
        stack: new Array<TableItem>()
    }),

    actions: {
        add(type: DatabaseTreeItemType, param: TablePanelParam): number {
            let id = new Date().getTime();
            let component = getComponent(type);
            if (component === '') {
                console.error(type, param);
                return 0;
            }
            this.stack.push({
                id,
                name: `${param.name}[${param.instance.name}]`,
                component: component,
                param
            });
            emitter.emit(MessageEventEnum.TAB_ADD, id);
            return id;
        },
        remove(id: number) {
            this.stack = this.stack.filter(e => e.id != id);
        }
    }
});

export default useTabStore;