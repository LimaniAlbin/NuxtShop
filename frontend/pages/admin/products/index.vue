<template>
  <div class="card">
    <toolbar />
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <app-table :data="data.products" title="Products" class="mt-10"/>
    </div>

  </div>

</template>

<script setup>
import AppTable from "~/components/admin/AppTable.vue";
import Toolbar from "~/components/admin/Toolbar.vue";
import {useQuery} from "@tanstack/vue-query";

definePageMeta({
  layout: 'admin-layout',
})

const fetchProducts = async () => {
  return await $fetch("http://localhost:8080/api/products")
}

const {data, error, isLoading} = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts
})


</script>
