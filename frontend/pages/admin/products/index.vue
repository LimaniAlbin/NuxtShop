<template>
  <div class="card">
    <toolbar @open-modal="showProductModal" />
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <products-table :data="data.products" title="Products" class="mt-10"/>
    </div>
  </div>

  <create-product v-if="openCreateProductModal" @close="openCreateProductModal = false" />

</template>

<script setup>
import ProductsTable from "~/components/admin/products/ProductsTable.vue";
import CreateProduct from "~/components/admin/products/CreateProduct.vue";
import Toolbar from "~/components/admin/Toolbar.vue";
import {useQuery} from "@tanstack/vue-query";

definePageMeta({
  layout: 'admin-layout',
})

const openCreateProductModal = ref(false)

const fetchProducts = async () => {
  return await $fetch("http://localhost:8080/api/products")
}

const {data, error, isLoading} = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts
})

const showProductModal = () => {
  openCreateProductModal.value = true
}


</script>
