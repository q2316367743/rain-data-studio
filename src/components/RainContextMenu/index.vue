<template>
    <div class="context-menu" @click.stop="onClick" v-if="modelValue" :style="style" ref="contextMenu">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'rain-context-menu',
    props: {
        modelValue: Boolean,
        top: Number,
        left: Number
    },
    data: () => ({
    }),
    computed: {
        style() {
            return `top: ${this.top! + 2}px;left: ${this.left! + 2}px`;
        }
    },
    created() {
        let that = this;
        document.body.addEventListener('click', () => {
            that.$emit("update:modelValue", false)
            that.$emit('hide-context');
        })
    },
    methods: {
        onClick() {
            this.$emit("update:modelValue", false)
        }
    }
});
</script>
<style>
.context-menu {
    position: fixed;
    background-color: var(--bg-color-context-menu-main);
    color: var(--color);
    width: 120px;
    border: var(--border-color-main) solid 1px;
    padding: 5px;
    border-radius: 5px;
    z-index: 9999999;
}
</style>