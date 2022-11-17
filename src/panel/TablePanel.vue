<!-- 表 - 面板 -->
<template>
    <div id="table-panel">
        {{ param?.instance.name }} - {{ param?.database.name }} - {{ param?.table.name }}
    </div>
</template>
<script lang="ts">
import TablePanelParam from "@/param/TablePanelParam";
import { defineComponent, PropType } from "vue";


export default defineComponent({
    name: 'TablePanel',
    props: {
        param: Object as PropType<TablePanelParam>
    },
    data: () => ({

    }),
});
</script>
<style scoped>

</style>