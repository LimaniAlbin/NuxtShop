<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Filtering</div>
    <app-table />
  </div>

</template>

<script setup>
import AppTable from "~/components/admin/AppTable.vue";

definePageMeta({
  layout: 'admin-layout',
})
</script>
