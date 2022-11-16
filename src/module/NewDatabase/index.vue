<template>
    <el-dialog v-model="dialog" title="新建链接" draggable destroy-on-close append-to-body>
        <el-form class="new-database" v-model="instance" label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="instance.name" />
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="instance.type">
                    <el-option label="MySQL" :value="1" />
                    <el-option label="SQLite3" :value="2" disabled />
                </el-select>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="instance.host" />
            </el-form-item>
            <el-form-item label="端口">
                <el-input-number controls-position="right" :max="65535" :min="0" :step="1" v-model="instance.port" />
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="instance.username" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="instance.password" type="password" />
            </el-form-item>
            <el-form-item label="数据库">
                <el-input v-model="instance.database" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="createInstance">保存</el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import Instance from "@/entity/Instance";
import { ElMessage } from 'element-plus';
import InstanceTypeEnum from "@/enumeration/InstanceTypeEnum";


import { instanceService } from '@/global/BeanFactory';
import databaseStrategyContext from '@/strategy/Database/DatabaseStrategyContext';
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    name: 'NewDatabase',
    props: {
        modelValue: Boolean
    },
    data: () => ({
        instance: {
            name: '',
            type: InstanceTypeEnum.MYSQL,
            host: '127.0.0.1',
            port: 3306,
            username: '',
            password: '',
            database: ''
        } as Instance,
        dialog: false
    }),
    created() {
        if (this.modelValue) {
            this.dialog = this.modelValue
        }
    },
    watch: {
        dialog(newValue) {
            this.$emit('update:modelValue', newValue);
        }
    },
    methods: {
        async createInstance() {
            // 先保存实例
            let instance = JSON.parse(JSON.stringify(this.instance)) as Instance;
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
                    emitter.emit(MessageEventEnum.APPLICATION_INSTANCE_REFRESH)
                }).catch((e: Error) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '初始化失败，' + e
                    });
                }).finally(() => {
                    // 完成后关闭对话框
                    this.dialog = false;
                });
        },
    }
});
</script>
<style scoped>

</style>