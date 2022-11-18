<!-- 表 - 面板 -->
<template>
    <div id="table-panel">
        <div class="table-panel-option">
            {{ count }}
        </div>
        <div class="table-panel-condition">
            <div class="table-panel-condition-where" :style="{ color: where.length > 0 ? '#ff91b2' : '' }">
                <span class="tag">WHERE</span>
                <el-input v-model="where" size="small" @keyup.enter="query"></el-input>
            </div>
            <div class="table-panel-condition-order">
                ORDER BY
            </div>
        </div>
        <div class="table-panel-body">
            <vxe-table border :data="records" height="100%" class="rain-scrollbar">
                <vxe-column v-for="header of headers" :key="header.id" :field="header.field" :title="header.field"
                    :width="header.minWidth" :title-help="header.help" show-overflow="tooltip" sortable
                    :formatter="format" />
            </vxe-table>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { VxeTablePropTypes, VxeColumnPropTypes, VxeTableDefines } from 'vxe-table'
import XEUtils from 'xe-utils'

import MySqlApi from "@/api/MySqlApi";
import TablePanelParam from "@/param/TablePanelParam";
import { ElMessage } from "element-plus";


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
        tableTooltipConfig: {
            showAll: true,
            enterable: true,
            contentMethod: ({ type, column, row, items, _columnIndex }) => {
                return column.title;
            }
        } as VxeTablePropTypes.TooltipConfig
    }),
    created() {
        // 构建列定义
        for (let field of this.param!.fields) {
            this.headers.push({
                id: field.id,
                field: field.name,
                minWidth: Math.max(field.name.length * 10 + 70, 90),
                headerName: field.name,
                help: {
                    message: `${field.name}：${field.type}\n${field.comment}`
                }
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
            MySqlApi.query({
                id: this.param?.instance.id!,
                sql: 'SELECT * ' + sql + ' LIMIT 500'
            }, options).then((result) => {
                this.records = result[0];
                console.log(result)
                // 查询完列表，再查询数量
                MySqlApi.query({
                    id: this.param?.instance.id!,
                    sql: 'SELECT COUNT(1) ' + sql
                }, options).then((result) => {
                    this.count = result[0][0]['COUNT(1)']
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '查询异常，' + e
                    });
                });
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '查询异常，' + e
                });
            });
        },
        format(column: { cellValue: any }): VxeColumnPropTypes.Formatter {
            if (column.cellValue instanceof Date) {
                return XEUtils.toDateString(column.cellValue, 'yyyy-MM-dd HH:ss:mm')
            }
            return column.cellValue;
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
    line-height: 30px;
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

/*滚动条整体部分*/
.rain-scrollbar ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

/*滚动条的轨道*/
.rain-scrollbar ::-webkit-scrollbar-track {
    background-color: #FFFFFF;
}

/*滚动条里面的小方块，能向上向下移动*/
.rain-scrollbar ::-webkit-scrollbar-thumb {
    background-color: #bfbfbf;
    border-radius: 5px;
    border: 1px solid #F1F1F1;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
}

.rain-scrollbar ::-webkit-scrollbar-thumb:hover {
    background-color: #A8A8A8;
}

.rain-scrollbar ::-webkit-scrollbar-thumb:active {
    background-color: #787878;
}

/*边角，即两个滚动条的交汇处*/
.rain-scrollbar ::-webkit-scrollbar-corner {
    background-color: #FFFFFF;
}
</style>