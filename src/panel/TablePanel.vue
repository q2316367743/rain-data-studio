<!-- 表 - 面板 -->
<template>
    <div id="table-panel">
        <div class="table-panel-option">
            {{ count }}
        </div>
        <div class="table-panel-condition">
            <div class="table-panel-condition-where" :style="{ color: where.length > 0 ? '#ff91b2' : '' }">
                <span class="tag">WHERE</span>
                <el-input v-model="where" size="small"></el-input>
            </div>
            <div class="table-panel-condition-order">
                ORDER BY
            </div>
        </div>
        <div class="table-panel-body">
            <el-scrollbar>
                <vxe-table border :data="records" height="calc(100vh - 170px)">
                    <vxe-column v-for="item of headers" :key="item.id" :field="item.field" :title="item.field"
                        :width="item.minWidth" show-overflow="tooltip" sortable />
                </vxe-table>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

import MySqlApi from "@/api/MySqlApi";
import TablePanelParam from "@/param/TablePanelParam";


export default defineComponent({
    name: 'TablePanel',
    props: {
        param: Object as PropType<TablePanelParam>
    },
    data: () => ({
        count: 0,
        where: '',
        orderBy: '',
        records: [] as Array<any>,
        headers: [] as Array<any>,
    }),
    created() {
        // 构建列定义
        for (let field of this.param!.fields) {
            this.headers.push({
                id: field.id,
                field: field.name,
                minWidth: Math.max(field.name.length * 16, 40),
                headerName: field.name
            });
        }
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


    .table-panel-condition-where {
        display: flex;

        .tag {
            line-height: 50px;
            font-weight: bold;
        }
        .el-input {
            margin: 13px 5px;
        }
    }
}

.table-panel-body {
    position: absolute;
    top: 82px;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>