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
    <Column field="price" header="Price"></Column>
    <Column field="stock" header="Stock"></Column>
  </DataTable>
  <Paginator :rows="pageSize"
             :first="(currentPage -1) * pageSize"
             :totalRecords="totalProducts"
             :rowsPerPageOptions="[ 10, 20, 30]"
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
    default: 10
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1
  }
})

const emit = defineEmits<{
  (e: 'paginate', page: number, pageSize: number): void;
}>();

const selectedPage = ref(1)
const selectedPageSize = ref(10)

const onPageChange = (event: any) => {
  selectedPage.value = event?.page + 1;
  selectedPageSize.value = event?.rows;
  console.log(selectedPageSize.value)
  emit('paginate', selectedPage.value, selectedPageSize.value)
}
</script>