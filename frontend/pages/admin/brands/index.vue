<template>
  <div class="card">
    <toolbar @open-modal="showCreateModal"/>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error?.message }}</div>
    <div v-else>
      <brands-table :data="data?.brands" title="Brands"
                    class="mt-10"
                    @open-edit="showEditModal"
                    @open-delete="showDeleteModal"
      />
    </div>
  </div>

  <create-brand v-if="openCreateBrandModal" @close="openCreateBrandModal = false" @refresh="fetchBrands" />
  <edit-brand v-if="openEditBrandModal" :id="brand_id" @close="openEditBrandModal = false" @refresh="fetchBrands" />
  <delete-brand v-if="openDeleteBrandModal" :id="brand_id" @close="openDeleteBrandModal = false" @refresh="fetchBrands" />
</template>

<script setup lang="ts">
import Toolbar from "~/components/admin/Toolbar.vue";
import BrandsTable from "~/components/admin/brands/BrandsTable.vue";
import {getAllBrands} from "~/services/admin/BrandService";
import {useQuery} from "@tanstack/vue-query";
import CreateBrand from "~/components/admin/brands/CreateBrand.vue";
import EditBrand from "~/components/admin/brands/EditBrand.vue";
import DeleteBrand from "~/components/admin/brands/DeleteBrand.vue";

definePageMeta({
  layout: 'admin-layout',
});

const brand_id = ref('')
const openCreateBrandModal = ref(false)
const openEditBrandModal = ref(false)
const openDeleteBrandModal = ref(false)

const fetchBrands = async () => {
  const response = await getAllBrands()
  return response.data
}

const {data, error, isLoading} = useQuery({
  queryKey: ["brands"],
  queryFn: () => fetchBrands(),
  keepPreviousData: true,
});

const showCreateModal = () => {
  openCreateBrandModal.value = true
}

const showEditModal = (id: string) => {
  brand_id.value = id;
  openEditBrandModal.value = true
}

const showDeleteModal = (id: string) => {
  brand_id.value = id;
  openDeleteBrandModal.value = true
}

</script>