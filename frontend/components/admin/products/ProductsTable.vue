<template>
  <DataTable :value="data" tableStyle="min-width: 50rem">
    <template #header>
      <table-header title="Products"/>
    </template>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${runtimeConfig.public.backendUrl}/uploads/${slotProps?.data?.image}`" :alt="title + 'Image'"
             class="rounded" style="width: 64px"/>
      </template>
    </Column>
    <Column field="name" header="Name"></Column>
    <Column field="shortDescription" header="Description"></Column>
    <Column header="Brand">
      <template #body="slotProps">
        {{ slotProps?.data?.brand?.name }}
      </template>
    </Column>
    <Column header="Category">
      <template #body="slotProps">
        {{ slotProps?.data?.category?.name }}
      </template>
    </Column>
    <Column header="Price">
      <template #body="slotProps">
        {{ formatCurrency(slotProps?.data?.price) }}
      </template>
    </Column>
    <Column field="inventoryStatus" header="Status">
      <template #body="slotProps">
        <Tag :value="slotProps.data.stockStatus" :severity="setStatusColor(slotProps.data.stockStatus)" />
      </template>
    </Column>
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
const { formatCurrency } = useCurrencyFormatter()

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
const selectedPageSize = ref(props.pageSize)

const onPageChange = (event: any) => {
  selectedPage.value = event?.page + 1;
  selectedPageSize.value = event?.rows;
  emit('paginate', selectedPage.value, selectedPageSize.value)
}

const setStatusColor = (status: string) => {
  switch (status) {
    case 'In Stock':
      return 'success'
    case 'Low Stock':
      return 'warn'
    case 'Out of Stock':
      return 'danger'
    default:
      return undefined
  }
}

const openEditModal = (id: string) => {
  emit('open-edit', id)
}

const openDeleteModal = (id: string) => {
  emit('open-delete', id)
}

console.log(props.data)

</script>