<template>
    <div class="rain-menu">
        <slot />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'rain-menu',
    data: () => ({

    }),
});
</script>
<style scoped lang="less">
.rain-menu {
    display: flex;
}
</style>