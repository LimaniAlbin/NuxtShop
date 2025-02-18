<template>
  <div class="card">
    <toolbar @open-modal="showCreateModal"/>
    <div v-if="isPending">Loading...</div>
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
          @open-edit="showEditModal"
          @open-delete="showDeleteModal"
          @paginate="onPaginate"
      />
    </div>
  </div>

  <create-product v-if="openCreateProductModal" @close="openCreateProductModal = false" @refresh="fetchProducts" />
  <edit-product v-if="openEditProductModal" :id="product_id" @close="openEditProductModal = false" @refresh="fetchProducts" />
  <delete-product v-if="openDeleteModal" :id="product_id" @close="openDeleteModal = false" @refresh="fetchProducts" />
</template>

<script setup lang="ts">
import {ref} from 'vue';
import ProductsTable from "~/components/admin/products/ProductsTable.vue";
import CreateProduct from "~/components/admin/products/CreateProduct.vue";
import EditProduct from "~/components/admin/products/EditProduct.vue";
import DeleteProduct from "~/components/admin/products/DeleteProduct.vue";
import Toolbar from "~/components/admin/Toolbar.vue";
import {keepPreviousData, useQuery} from "@tanstack/vue-query";
import {getAllProducts} from "~/services/admin/ProductService";

// Page meta
definePageMeta({
  layout: 'admin-layout',
});

// State for pagination
const currentPage = ref(1);
const pageSize = ref(8);
const openCreateProductModal = ref(false);
const openEditProductModal = ref(false);
const openDeleteModal = ref(false);
const product_id = ref('');

// Function to fetch products
const fetchProducts = async (page: number, pageSize: number) => {
  const response = await getAllProducts(page, pageSize);
  return response?.data;
}

// Handler for pagination changes
const onPaginate = (page: number, size: number) => {
  currentPage.value = page;
  pageSize.value = size;
}

const showCreateModal = () => {
  openCreateProductModal.value = true
}

const showEditModal = (id: string) => {
  product_id.value = id;
  openEditProductModal.value = true
}

const showDeleteModal = (id: string) => {
  product_id.value = id;
  openDeleteModal.value = true
}

// tanstack query
const {data, error, isPending} = useQuery({
  queryKey: ["products", currentPage, pageSize],
  queryFn: () => fetchProducts(currentPage.value, pageSize.value),
  placeholderData: keepPreviousData
});
</script>
