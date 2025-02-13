<template>
  <DataTable :value="data" tableStyle="min-width: 50rem">
    <template #header>
      <table-header title="Categories"/>
    </template>
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

const emit = defineEmits<{
  (e: 'open-edit', id: string): void;
  (e: 'open-delete', id: string): void;
}>();

const openEditModal = (id: string) => {
  emit('open-edit', id)
}

const openDeleteModal = (id: string) => {
  emit('open-delete', id)
}
</script>