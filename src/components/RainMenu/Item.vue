<template>
    <div class="rain-menu-item">
        <slot />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'rain-menu-item',
    data: () => ({
    }),
});
</script>
<style scoped lang="less">
.rain-menu-item {
    padding: 0 5px;
    cursor: pointer;
    -webkit-app-region: no-drag;
    position: relative;
    line-height: 30px;
    color: #ffffff;
    font-size: 16px;

    &:hover {
        background-color: #363636;
    }


}
</style>