<template>
  <DataTable :value="data" tableStyle="min-width: 50rem">
    <template #header>
      <table-header title="Products"/>
    </template>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${runtimeConfig.public.backendUrl}/uploads/${slotProps?.data?.image}`" :alt="title + 'Image'"
             class="w-18 h-14 rounded"/>
      </template>
    </Column>
    <Column field="name" header="Name"></Column>
    <Column field="description" header="Description"></Column>
    <Column header="Brand">
      <template #body="slotProps">
        {{ slotProps?.data?.brand?.name }}
      </template>
    </Column>
    <Column field="price" header="Price"></Column>
    <Column field="stock" header="Stock"></Column>
    <Column :exportable="false" style="width: 10rem">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click.prevent="openEditModal(slotProps.data._id)"/>
        <Button icon="pi pi-trash" outlined rounded severity="danger"
                @click.prevent="openDeleteModal(slotProps.data._id)"/>
      </template>
    </Column>
  </DataTable>
  <Paginator :rows="selectedPageSize"
             :first="(currentPage -1) * selectedPageSize"
             :totalRecords="totalProducts"
             :rowsPerPageOptions="[ 8, 10, 20, 30]"
             @page="onPageChange"
  />
</template>

<script setup lang="ts">
import TableHeader from "~/components/admin/TableHeader.vue";
import Paginator from 'primevue/paginator';

const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  numberOfPages: {
    type: Number,
    required: true,
    default: 1
  },
  totalProducts: {
    type: Number,
    required: true,
    default: 1
  },
  pageSize: {
    type: Number,
    required: true,
    default: 8
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1
  }
})

const emit = defineEmits<{
  (e: 'paginate', page: number, pageSize: number): void;
  (e: 'open-edit', id: string): void;
  (e: 'open-delete', id: string): void;
}>();

const selectedPage = ref(1)
const selectedPageSize = ref(8)

const onPageChange = (event: any) => {
  selectedPage.value = event?.page + 1;
  selectedPageSize.value = event?.rows;
  console.log(selectedPageSize.value);
  emit('paginate', selectedPage.value, selectedPageSize.value)
}

const openEditModal = (id: string) => {
  emit('open-edit', id)
}

const openDeleteModal = (id: string) => {
  emit('open-delete', id)
}

</script>