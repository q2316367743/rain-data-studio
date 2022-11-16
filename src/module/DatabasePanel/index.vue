<template>
    <div id="side-panel-database" v-loading="loading" element-loading-text="数据渲染中"
        element-loading-background="rgba(0, 0, 0, 0.7)">
        <!-- 顶部按钮 -->
        <div class="side-panel-database-title">
            <div style="display: flex;">
                <div class="side-panel-database-option" @click="showNewDatabaseDialog">
                    <el-icon :size="16">
                        <Plus />
                    </el-icon>
                </div>
                <div class="side-panel-database-option" @click="refresh">
                    <el-icon :size="16">
                        <Refresh />
                    </el-icon>
                </div>
                <el-popover :width="200"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                    trigger="click" effect="dark">
                    <template #reference>
                        <div class="side-panel-database-option">
                            <el-badge is-dot :hidden="treeFilterText.length === 0">
                                <el-icon :size="16">
                                    <Search />
                                </el-icon>
                            </el-badge>
                        </div>
                    </template>
                    <el-input v-model="treeFilterText" size="small"></el-input>
                </el-popover>
            </div>
            <div style="display: flex;">
                <div class="side-panel-database-option">
                    <el-icon :size="16">
                        <end-open-icon />
                    </el-icon>
                </div>
                <div class="side-panel-database-option">
                    <el-icon :size="20" style="margin: 5px;">
                        <end-close-icon />
                    </el-icon>
                </div>
            </div>
        </div>
        <!-- 树形展示 -->
        <div class="side-panel-database-tree">
            <el-scrollbar>
                <el-tree :data="treeItems" :props="defaultProps" class="rain-tree" :expand-on-click-node="false"
                    empty-text="暂无链接" ref="treeRef" node-key="nodeKey" render-after-expand
                    :filter-node-method="filterNode">
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
                            <span class="rain-tree-node-comment" v-if="data.type === 3 || data.type === 6">{{
                                    data.children.length
                            }}</span>
                            <span class="rain-tree-node-comment" v-else-if="data.type === 7">{{ data.data.type }}</span>
                            <span class="rain-tree-node-instance" v-else-if="data.type === 1"
                                @click="openDatabaseShow(data.data)">
                                {{ data.children.length }}/{{ data.all.length }}
                            </span>
                        </div>
                    </template>
                </el-tree>
            </el-scrollbar>
        </div>
        <!-- 对话框 -->
        <el-dialog v-model="newDatabaseDialog" title="新建链接" draggable destroy-on-close append-to-body>
            <new-database v-model="newDatabaseData" />
            <template #footer>
                <el-button type="primary" @click="createInstance">保存</el-button>
            </template>
        </el-dialog>
        <!-- 实例下数据库是否显示 -->
        <el-dialog v-model="showDatabaseDialog" :title="showDatabaseTitle" draggable destroy-on-close append-to-body
            top="5vh">
            <el-checkbox-group v-model="showDatabaseModel" class="side-panel-database-db">
                <el-scrollbar>
                    <template v-for="item of showDatabaseData">
                        <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
                        <br />
                    </template>
                </el-scrollbar>
            </el-checkbox-group>
            <template #footer>
                <el-button type="primary" @click="clickDatabaseShow">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import DatabaseTreeItem from "@/view/DatabaseTreeItem";
import { defineComponent } from "vue";

import { Plus, Refresh, Search } from "@element-plus/icons-vue";

// 引入图标
import MySqlIcon from '@/icon/MySql.vue';
import ArchitectureIcon from '@/icon/Architecture.vue';
import TableIcon from '@/icon/Table.vue';
import FolderIcon from '@/icon/Folder.vue';
import FieldIcon from "@/icon/Field.vue";
import EndOpenIcon from "@/icon/EndOpen.vue";
import EndCloseIcon from "@/icon/EndClose.vue";

import databaseTreeBuild from "@/build/DatabaseTreeBuild";

// 模块
import NewDatabase from '@/module/NewDatabase/index.vue';

// 枚举
import InstanceTypeEnum from '@/enumeration/InstanceTypeEnum';
import MessageEventEnum from '@/enumeration/MessageEventEnum';

// 实体对象
import Instance from '@/entity/Instance';
import databaseStrategyContext from '@/strategy/Database/DatabaseStrategyContext';

// 其他
import { databaseService, instanceService } from '@/global/BeanFactory';
import { ElMessage } from 'element-plus';
import emitter from '@/plugins/mitt';
import Database from "@/entity/Database";
import DatabaseTreeItemType from "@/enumeration/DatabaseTreeItemType";

export default defineComponent({
    name: 'DatabasePanel',
    components: {
        MySqlIcon, ArchitectureIcon, TableIcon, FolderIcon, FieldIcon, Search, EndOpenIcon, EndCloseIcon,
        Plus, Refresh,
        NewDatabase
    },
    data: () => ({
        loading: false,
        defaultProps: {
            children: 'children',
            label: 'name'
        },
        treeFilterText: '',
        treeItems: [] as Array<DatabaseTreeItem>,
        treeNodeKeys: [] as Array<string>,
        defaultExpandedKeys: [] as Array<string>,
        newDatabaseDialog: false,
        newDatabaseData: {
            name: '',
            type: InstanceTypeEnum.MYSQL,
            host: '127.0.0.1',
            port: 3306,
            username: '',
            password: '',
            database: ''
        } as Instance,
        showDatabaseDialog: false,
        showDatabaseTitle: '',
        showDatabaseData: [] as Array<Database>,
        showDatabaseModel: [] as Array<number>,
        showDatabaseInstanceId: 0
    }),
    created() {
        this.refresh();
        emitter.on(MessageEventEnum.APPLICATION_INSTANCE_ADD, () => {
            this.showNewDatabaseDialog()
        })
    },
    watch: {
        treeFilterText(newValue: string) {
            (this.$refs['treeRef'] as any).filter(newValue)
        }
    },
    methods: {
        refresh() {
            this.loading = true;
            console.log('重新渲染')
            databaseTreeBuild().then((tree) => {
                this.treeItems = tree[0];
                this.treeNodeKeys = tree[1]
                this.loading = false;
            });
        },
        showNewDatabaseDialog() {
            this.newDatabaseDialog = true;
            this.newDatabaseData = {
                name: '测试',
                type: InstanceTypeEnum.MYSQL,
                host: '192.168.31.31',
                port: 3306,
                username: 'root',
                password: '123456',
                database: ''
            } as Instance;
        },
        async createInstance() {
            // 先保存实例
            let instance = JSON.parse(JSON.stringify(this.newDatabaseData)) as Instance;
            let instanceId = await instanceService.save(instance);
            instance.id = instanceId
            // 再进行初始化
            databaseStrategyContext.getStrategy(InstanceTypeEnum.MYSQL)
                .init(instance)
                .then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '初始化成功'
                    });
                    this.refresh();
                }).catch((e: Error) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '初始化失败，' + e
                    });
                }).finally(() => {
                    // 完成后关闭对话框
                    this.newDatabaseDialog = false;
                });
        },
        /**
         * 打开数据库展示选择
         * @param instance 实例
         */
        openDatabaseShow(instance: DatabaseTreeItem) {
            this.showDatabaseInstanceId = instance.id!
            databaseService.listByInstanceId(instance.id!).then(databases => {
                this.showDatabaseTitle = `实例【${instance.name}】下数据库`
                this.showDatabaseDialog = true;
                this.showDatabaseData = databases;
                this.showDatabaseModel = [];
                for (let database of databases) {
                    if (database.show) {
                        this.showDatabaseModel.push(database.id!);
                    }
                }
            })
        },
        clickDatabaseShow() {
            databaseService.show(this.showDatabaseInstanceId, this.showDatabaseModel)
                .then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '操作成功'
                    })
                    this.refresh()
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '操作成功，' + e
                    })
                }).finally(() => {
                    this.showDatabaseDialog = false;
                })
        },
        filterNode(value: string, data: DatabaseTreeItem) {
            if (!value) {
                return true
            }
            if (data.type === DatabaseTreeItemType.FIELD || data.type === DatabaseTreeItemType.GROUP) {
                // 搜索时，不显示字段
                return false;
            }
            return data.nameKey.includes(value)
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
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-color-main);

    .side-panel-database-option {
        width: 30px;
        cursor: pointer;

        &:hover {
            background-color: var(--border-color-main);
        }

        .el-icon {
            margin: 7px;
        }
    }
}

.side-panel-database-tree {
    position: absolute;
    top: 31px;
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

        .rain-tree-node-instance {
            border: 1px solid #202831;
            font-size: 12px;
            color: #6f7a86;
            margin-left: 5px;
            padding: 0 2px;
        }

        .el-icon {
            color: #ffffff
        }
    }
}

.side-panel-database-db {
    height: calc(85vh - 54px - 62px - 60px);
    overflow: auto;
}
</style>