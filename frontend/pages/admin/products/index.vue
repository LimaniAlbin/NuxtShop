<template>
  <div class="card">
    <toolbar @open-modal="showProductModal"/>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error?.message }}</div>
    <div v-else>
      <products-table
          :data="data?.products"
          title="Products"
          :number-of-pages="data?.totalPages"
          :total-products="data?.total"
          :page-size="data?.pageSize"
          :current-page="data?.currentPage"
          class="mt-10"
          @paginate="onPaginate"
      />
    </div>
  </div>

  <create-product v-if="openCreateProductModal" @close="openCreateProductModal = false" @refresh="fetchProducts"/>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import ProductsTable from "~/components/admin/products/ProductsTable.vue";
import CreateProduct from "~/components/admin/products/CreateProduct.vue";
import Toolbar from "~/components/admin/Toolbar.vue";
import {useQuery} from "@tanstack/vue-query";
import {getAllProducts} from "~/services/admin/ProductService.ts";

// Page meta
definePageMeta({
  layout: 'admin-layout',
});

// State for pagination
const currentPage = ref(1);
const pageSize = ref(10);
const openCreateProductModal = ref(false);

// Function to fetch products
const fetchProducts = async (page: number, pageSize: number) => {
  const response = await getAllProducts(page, pageSize);
  return response?.data;
}

const {data, error, isLoading} = useQuery({
  queryKey: ["products", currentPage, pageSize],
  queryFn: () => fetchProducts(currentPage.value, pageSize.value),
  keepPreviousData: true,
});

// Handler for pagination changes
const onPaginate = (page: number, size: number) => {
  currentPage.value = page;
  pageSize.value = size;
}
</script>
