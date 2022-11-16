<template>
    <div class="context-menu-sub">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'rain-context-menu-sub',
    data: () => ({})
});
</script>
<style>
.context-menu-sub {
    position: absolute;
    background-color: var(--bg-color-context-menu-main);
    width: 120px;
    border: var(--border-color-main) solid 1px;
    padding: 5px;
    border-radius: 5px;
    z-index: 9999999;
    display: none;
    top: 0;
    left: 120px;
}
</style>