<template>
  <DataTable :value="data" tableStyle="min-width: 50rem">
    <template #header>
      <table-header title="Products" />
    </template>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${runtimeConfig.public.backendUrl}/uploads/${slotProps?.data?.image}`" :alt="title + 'Image'" class="w-18 h-14 rounded" />
      </template>
    </Column>
    <Column field="name" header="Name"></Column>
    <Column field="description" header="Description"></Column>
    <Column field="price" header="Price"></Column>
    <Column field="stock" header="Stock"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import TableHeader from "~/components/admin/TableHeader.vue";

const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
</script>