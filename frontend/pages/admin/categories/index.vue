<template>
  <div class="card">
    <toolbar @open-modal="showCreateModal"/>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error?.message }}</div>
    <div v-else>
      <categories-table :data="data?.categories" title="Brands"
                    class="mt-10"
                    @open-edit="showEditModal"
                    @open-delete="showDeleteModal"
      />
    </div>
  </div>

  <create-category v-if="openCreateCategoryModal" @close="openCreateCategoryModal = false" @refresh="fetchCategories" />
  <edit-category v-if="openEditCategoryModal" :id="category_id" @close="openEditCategoryModal = false" @refresh="fetchCategories" />
  <delete-category v-if="openDeleteCategoryModal" :id="category_id" @close="openDeleteCategoryModal = false" @refresh="fetchCategories" />
</template>

<script setup lang="ts">
import Toolbar from "~/components/admin/Toolbar.vue";
import CategoriesTable from "~/components/admin/categories/CategoriesTable.vue";
import {useQuery} from "@tanstack/vue-query";
import {getAllCategories} from "~/services/admin/CategoryService.ts";
import CreateCategory from "~/components/admin/categories/CreateCategory.vue";
import EditCategory from "~/components/admin/categories/EditCategory.vue";
import DeleteCategory from "~/components/admin/categories/DeleteCategory.vue";

definePageMeta({
  layout: 'admin-layout',
})

const category_id = ref('')
const openCreateCategoryModal = ref(false)
const openEditCategoryModal = ref(false)
const openDeleteCategoryModal = ref(false)


const fetchCategories = async () => {
  const response = await getAllCategories()
  return response.data
}

const { data, error, isLoading } = useQuery({
  queryKey: ['categories'],
  queryFn: () => fetchCategories(),
  keepPreviousData: true,
})

const showCreateModal = () => {
  openCreateCategoryModal.value = true
}

const showEditModal = (id: string) => {
  category_id.value = id;
  openEditCategoryModal.value = true
}

const showDeleteModal = (id: string) => {
  category_id.value = id;
  openDeleteCategoryModal.value = true
}
</script>