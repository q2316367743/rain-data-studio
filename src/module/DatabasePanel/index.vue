<template>
    <div id="side-panel-database">
        <div class="side-panel-database-title"></div>
        <el-tree :data="treeItems" :props="defaultProps" class="rain-tree" :expand-on-click-node="false">
            <template #default="{ node, data }">
                <div class="rain-tree-node">
                    <el-icon :size="14">
                        <my-sql-icon v-if="data.type === 1" />
                        <architecture-icon v-else-if="data.type === 2" />
                        <folder-icon v-else-if="data.type === 3 || data.type === 6" />
                        <table-icon v-else-if="data.type === 4" />
                    </el-icon>
                    <span class="rain-tree-node-title">{{ node.label }}</span>
                </div>
            </template>
        </el-tree>
    </div>
</template>
<script lang="ts">
import DatabaseTreeItemType from "@/enumeration/DatabaseTreeItemType";
import DatabaseTreeItem from "@/view/DatabaseTreeItem";
import { defineComponent } from "vue";

// 引入图标
import MySqlIcon from '@/icon/MySql.vue';
import ArchitectureIcon from '@/icon/Architecture.vue';
import TableIcon from '@/icon/Architecture.vue';
import FolderIcon from '@/icon/Folder.vue';

export default defineComponent({
    name: 'DatabasePanel',
    components: { MySqlIcon, ArchitectureIcon, TableIcon, FolderIcon },
    data: () => ({
        defaultProps: {
            children: 'children',
            label: 'name',
        },
        treeItems: [{
            id: 1,
            name: 'root@192.168.0.222',
            type: DatabaseTreeItemType.INSTANCE,
            children: [{
                id: 11,
                name: 'mysql',
                type: DatabaseTreeItemType.DATABASE,
                children: [{
                    id: 111,
                    name: '表',
                    type: DatabaseTreeItemType.TYPE,
                    children: [{
                        id: 1111,
                        name: 'activity_area',
                        type: DatabaseTreeItemType.TABLE,
                        children: [],
                        data: {} as any
                    }],
                    data: {} as any
                }],
                data: {} as any
            }],
            data: {} as any
        }, {
            id: 2,
            name: 'root@192.168.0.253',
            type: DatabaseTreeItemType.INSTANCE,
            children: [],
            data: {} as any
        }] as Array<DatabaseTreeItem>
    }),
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

        .el-icon {
            color: #ffffff
        }
    }
}
</style>