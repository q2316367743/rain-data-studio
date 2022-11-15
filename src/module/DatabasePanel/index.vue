<template>
    <div id="side-panel-database">
        <div class="side-panel-database-title">
            <div class="side-panel-database-option" @click="refresh">
                刷新
            </div>
        </div>
        <div class="side-panel-database-tree">
            <el-scrollbar>
                <el-tree :data="treeItems" :props="defaultProps" class="rain-tree" :expand-on-click-node="false">
                    <template #default="{ node, data }">
                        <div class="rain-tree-node">
                            <el-icon :size="14">
                                <my-sql-icon v-if="data.type === 1" />
                                <architecture-icon v-else-if="data.type === 2" />
                                <folder-icon v-else-if="data.type === 3 || data.type === 6" />
                                <table-icon v-else-if="data.type === 4" />
                                <field-icon v-else-if="data.type === 7" />
                            </el-icon>
                            <span class="rain-tree-node-title">{{ node.label }}</span>
                            <span class="rain-tree-node-comment"
                                v-if="data.type === 1 || data.type === 3 || data.type === 6">{{
                                        data.children.length
                                }}</span>
                            <span class="rain-tree-node-comment" v-else-if="data.type === 7">{{ data.data.type }}</span>
                        </div>
                    </template>
                </el-tree>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import DatabaseTreeItemType from "@/enumeration/DatabaseTreeItemType";
import DatabaseTreeItem from "@/view/DatabaseTreeItem";
import { defineComponent } from "vue";

// 引入图标
import MySqlIcon from '@/icon/MySql.vue';
import ArchitectureIcon from '@/icon/Architecture.vue';
import TableIcon from '@/icon/Table.vue';
import FolderIcon from '@/icon/Folder.vue';
import FieldIcon from "@/icon/Field.vue";

import databaseTreeBuild from "@/build/DatabaseTreeBuild";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    name: 'DatabasePanel',
    components: { MySqlIcon, ArchitectureIcon, TableIcon, FolderIcon, FieldIcon },
    data: () => ({
        defaultProps: {
            children: 'children',
            label: 'name',
        },
        treeItems: [] as Array<DatabaseTreeItem>
    }),
    created() {
        databaseTreeBuild().then((treeItems) => {
            this.treeItems = treeItems
        });
        emitter.on(MessageEventEnum.APPLICATION_DATABASE_REFRESH, () => {
            this.refresh()
        })
    },
    methods: {
        refresh() {
            console.log('重新渲染')
            databaseTreeBuild().then((treeItems) => {
                this.treeItems = treeItems
            });
        }
    }
});
</script>
<style lang="less">
#side-panel-database {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.side-panel-database-title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    width: 100%;
}

.side-panel-database-tree {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}

.rain-tree {
    background-color: var(--background-color-main) !important;
    color: var(--color) !important;

    .el-tree-node__content {
        &:hover {
            background-color: var(--border-color-main);
        }

        &:focus {
            background-color: var(--border-color-main);
        }
    }

    .el-tree-node {

        &:focus {
            .el-tree-node__content {
                background-color: var(--border-color-main);
            }
        }

    }

    .is-current {

        .el-tree-node__content {
            background-color: var(--border-color-main);
        }

        .el-tree-node__children {
            .el-tree-node__content {
                background-color: var(--background-color-main);
            }
        }
    }

    .rain-tree-node {
        .rain-tree-node-title {
            margin-left: 5px;
        }

        .rain-tree-node-comment {
            margin-left: 5px;
            font-size: 12px;
            color: #6f7a86;
        }

        .el-icon {
            color: #ffffff
        }
    }
}
</style>