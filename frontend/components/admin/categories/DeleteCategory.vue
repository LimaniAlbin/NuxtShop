<template>
  <base-modal title="Delete Category" :visible="showModal" :isLoading="isPending" @submit="onDeleteCategory"
              @close="closeModal">
    <form @submit="onDeleteCategory">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl"/>
        <span>Are you sure you want to delete <b>{{ categoryName }}</b>?</span>
      </div>
    </form>
  </base-modal>
</template>
<script setup lang="ts">
import BaseModal from "~/components/admin/BaseModal.vue";
import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {deleteCategory, getCategoryById} from "~/services/admin/CategoryService";
const queryClient = useQueryClient()

const props = defineProps({
  id: {
    type: String,
    required: true,
  }
})

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'refresh'): void;
}>();

const categoryName = ref('')
const showModal = ref(true)

const {mutate, isPending} = useMutation({
  mutationFn: deleteCategory,
  onSuccess: (data, isLoading) => {
    queryClient.invalidateQueries(["categories"]);
    closeModal();
    refresh();
  },
  onError: (error) => {
    console.error("Error updating product:", error);
  }
});

const getCategory = async () => {
  const response = await getCategoryById(props?.id);
  const fetchedCategory = response?.data?.category;
  categoryName.value = fetchedCategory?.name;
}

const onDeleteCategory = async () => {
  mutate(props.id)
}

const refresh = () => {
  emit('refresh')
}

const closeModal = () => {
  showModal.value = false
  emit('close')
}

onMounted(() => {
  getCategory()
})
</script>