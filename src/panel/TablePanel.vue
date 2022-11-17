<!-- 表 - 面板 -->
<template>
    <div id="table-panel">
        <div class="table-panel-option">
            {{count}}
        </div>
        <div class="table-panel-condition">
            <div class="table-panel-condition-where">
                WHERE
            </div>
            <div class="table-panel-condition-order">
                ORDER BY
            </div>
        </div>
        <div class="table-panel-body">
            <el-scrollbar>
                <el-table :data="records" style="width: 100%">
                    <el-table-column v-for="field in param?.fields" :prop="field.name" :label="field.name"
                        min-width="80px" show-overflow-tooltip />
                </el-table>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import MySqlApi from "@/api/MySqlApi";
import TablePanelParam from "@/param/TablePanelParam";
import { defineComponent, PropType } from "vue";


export default defineComponent({
    name: 'TablePanel',
    props: {
        param: Object as PropType<TablePanelParam>
    },
    data: () => ({
        count: 0,
        where: '',
        orderBy: '',
        records: [] as Array<any>
    }),
    created() {
        this.query();
    },
    methods: {
        query() {
            let options = {
                id: this.param!.instance.id!,
                user: this.param!.instance.username,
                password: this.param!.instance.password,
                host: this.param!.instance.host,
                port: this.param!.instance.port,
                database: this.param!.instance.database
            };
            let sql = `FROM ${this.param?.database.name}.${this.param?.table.name}`;
            if (this.where !== '') {
                sql = sql + ` WHERE　${this.where}`;
            }
            if (this.orderBy !== '') {
                sql = sql + ` ORDER BY ${this.orderBy}`
            }
            sql = sql + ' LIMIT 500'
            MySqlApi.query({
                id: this.param?.instance.id!,
                sql: 'SELECT * ' + sql
            }, options).then((result) => {
                this.records = result[0];
                console.log(result)
            })
            MySqlApi.query({
                id: this.param?.instance.id!,
                sql: 'SELECT COUNT(1) ' + sql
            }, options).then((result) => {
                this.count = result[0][0]['COUNT(1)']
            })
        }
    }
});
</script>
<style lang="less">
#table-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.table-panel-option {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    border-bottom: 1px solid var(--border-color-main);
}

.table-panel-condition {
    position: absolute;
    top: 31px;
    left: 0;
    right: 0;
    height: 50px;
    border-bottom: 1px solid var(--border-color-main);
    display: flex;
    justify-content: space-between;
}

.table-panel-body {
    position: absolute;
    top: 82px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}
</style>