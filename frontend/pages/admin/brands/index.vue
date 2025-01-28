<template>
  <div class="card">
    <toolbar @open-modal="showCreateModal"/>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error?.message }}</div>
    <div v-else>
      <brands-table :data="data?.brands" title="Brands" class="mt-10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Toolbar from "~/components/admin/Toolbar.vue";
import BrandsTable from "~/components/admin/brands/BrandsTable.vue";
import {getAllBrands} from "~/services/admin/BrandService";
import {useQuery} from "@tanstack/vue-query";

definePageMeta({
  layout: 'admin-layout',
});

const fetchBrands = async () => {
  const response = await getAllBrands(1, 10)
  return response.data
}

const {data, error, isLoading} = useQuery({
  queryKey: ["brands"],
  queryFn: () => fetchBrands(),
  keepPreviousData: true,
});

</script>