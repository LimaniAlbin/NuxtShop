<template>
  <DataTable :value="data" tableStyle="min-width: 50rem">
    <template #header>
      <table-header title="Brands"/>
    </template>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${runtimeConfig.public.backendUrl}/uploads/${slotProps?.data?.logo}`" :alt="title + 'Image'"
             class="w-18 h-14 rounded"/>
      </template>
    </Column>
    <Column field="name" header="Name"></Column>
    <Column field="description" header="Description"></Column>
    <Column :exportable="false" style="width: 10rem">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click.prevent="openEditModal(slotProps.data._id)" />
        <Button icon="pi pi-trash" outlined rounded severity="danger" @click.prevent="openDeleteModal(slotProps.data._id)" />
      </template>
    </Column>
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