<template>
    <div class="context-menu-item">
        <div>
            <slot name="default"></slot>
        </div>
        <div class="context-menu-item-icon" v-if="showExpand">
            <el-icon :size="14">
                <ArrowRight />
            </el-icon>
        </div>
        <slot name="expand"></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ArrowRight } from '@element-plus/icons-vue';

export default defineComponent({
    name: 'rain-context-menu-item',
    components: { ArrowRight },
    props: {
        showExpand: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data: () => ({})
});
</script>
<style lang="less">
.context-menu-item {
    width: calc(100% - 10px);
    padding: 3px 5px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    text-align: left;
    color: var(--color);
    position: relative;

    &:hover {
        color: var(--color);
        background-color: var(--bg-color-context-menu-hover);

        .context-menu-sub {
            display: block;
        }
    }

}
</style>