<template>
    <div id="main-container">
        <div class="main-container-title">
            <el-scrollbar>
                <div class="main-container-title-scrollbar">
                    <div class="main-container-title-item" v-for="item in stack" :key="'tab' + item.id"
                        :class="showTab === item.id ? 'active' : ''" @click="showTab = item.id">
                        <div>{{ item.name }}</div>
                        <el-icon :size="12" @click.stop="remove(item.id)">
                            <Close />
                        </el-icon>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="main-container-body">
            <component v-for="item in stack" :key="item.id" :is="item.component" :param="item.param"
                v-show="showTab === item.id"></component>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { Close } from "@element-plus/icons-vue";

// 引入状态
import useTabStore from '@/store/TabStore';

// 引入面板
import TablePanelVue from '@/panel/TablePanel.vue';
import emitter from "@/plugins/mitt";
import MessageEventEnum from '@/enumeration/MessageEventEnum';

export default defineComponent({
    name: 'MainContainer',
    components: { TablePanelVue, Close },
    computed: {
        ...mapState(useTabStore, ['stack'])
    },
    created() {
        emitter.on(MessageEventEnum.TAB_ADD, (id: any) => {
            this.showTab = id;
        })
    },
    data: () => ({
        showTab: 1
    }),
    methods: {
        remove(id: number) {
            useTabStore().remove(id);
            console.log(id, this.showTab)
        }
    }
});
</script>
<style scoped lang="less">
#main-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.main-container-title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    display: flex;
    line-height: 30px;
    background-color: #323130;
    overflow-y: auto;

    .main-container-title-scrollbar {
        display: flex;
    }

    .main-container-title-item {
        display: flex;
        border-right: var(--border-color);
        padding: 0 5px 0 10px;
        font-size: 13px;
        cursor: pointer;
        user-select: none;

        &.active {
            background-color: var(--background-color-main);
        }

        .el-icon {
            margin: 6px 2px;
            padding: 3px;
            border-radius: 4px;

            &:hover {
                background-color: #363737;
            }
        }
    }
}

.main-container-body {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>