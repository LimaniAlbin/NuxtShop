<template>
  <div class="card">
    <toolbar @open-modal="showProductModal" />
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <products-table :data="data.products" title="Products" class="mt-10"/>
    </div>
  </div>

  <create-product v-if="openCreateProductModal" @close="openCreateProductModal = false" @refresh="fetchProducts"/>

</template>

<script setup>
import ProductsTable from "~/components/admin/products/ProductsTable.vue";
import CreateProduct from "~/components/admin/products/CreateProduct.vue";
import Toolbar from "~/components/admin/Toolbar.vue";
import {useQuery} from "@tanstack/vue-query";
import { getAllProducts } from "~/services/admin/ProductService.ts";


definePageMeta({
  layout: 'admin-layout',
})

const openCreateProductModal = ref(false)

const fetchProducts = async () => {
  const response = await getAllProducts()
  return response.data
}

const {data, error, isLoading} = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts
})

const showProductModal = () => {
  openCreateProductModal.value = true
}


</script>
