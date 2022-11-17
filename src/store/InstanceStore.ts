import databaseTreeBuild from "@/build/DatabaseTreeBuild";
import DatabaseTreeItem from "@/view/DatabaseTreeItem";
import { defineStore } from "pinia";

/**
 * 实例状态管理
 */
const useInstanceStore = defineStore('instance', {
    state: () => ({
        treeItems: [] as Array<DatabaseTreeItem>,
        treeNodeKeys: [] as Array<string>,
        onlineNodeKeys: new Set<string>(),
    }),
    actions: {
        /**
         * 渲染实例数据
         */
        renderInstances() {
            databaseTreeBuild().then((tree) => {
                this.treeItems = [];
                this.treeNodeKeys = tree[1];
                // 渲染在线状态
                for (let item of tree[0]) {
                    item.online = this.onlineNodeKeys.has(item.nodeKey);
                    this.treeItems.push(item);
                }
            });
        },
        /**
         * 设置节点在线状态
         * 
         * @param nodeKey 唯一KEY
         * @param online 在线状态
         */
        setOnline(nodeKey: string, online: boolean) {
            if (online) {
                if (this.onlineNodeKeys.has(nodeKey)) {
                    // 存在，则已经在线，跳过
                    return;
                }
                for (let item of this.treeItems) {
                    if (item.nodeKey === nodeKey) {
                        item.online = online;
                        this.onlineNodeKeys.add(nodeKey);
                        return;
                    }
                }
            } else {
                if (this.onlineNodeKeys.has(nodeKey)) {
                    for (let item of this.treeItems) {
                        if (item.nodeKey === nodeKey) {
                            item.online = online;
                            this.onlineNodeKeys.delete(nodeKey);
                            return;
                        }
                    }
                }
            }
        },
        /**
         * 获取指定KEY的在线状态
         * @param nodeKey 唯一KEY
         */
        getOnline(nodeKey: string): boolean {
            return this.onlineNodeKeys.has(nodeKey);
        }
    }
});

export default useInstanceStore;