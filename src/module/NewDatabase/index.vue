<template>
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
    </el-form>
</template>
<script lang="ts">
import Instance from "@/entity/Instance";
import InstanceTypeEnum from "@/enumeration/InstanceTypeEnum";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: 'NewDatabase',
    props: {
        modelValue: Object as PropType<Instance>
    },
    data: () => ({
        instance: {
            name: '',
            type: InstanceTypeEnum.MYSQL,
            host: '127.0.0.1',
            port: 3306,
            username: '',
            password: ''
        } as Instance
    }),
    created() {
        if (this.modelValue) {
            this.instance = this.modelValue
        }
    },
    watch: {
        instance(newValue: Instance) {
            this.$emit('update:modelValue', newValue);
        }
    }
});
</script>
<style scoped>

</style>