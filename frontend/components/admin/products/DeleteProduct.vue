<template>
  <base-modal title="Delete Product" :visible="showModal" :isLoading="isPending" @submit="onDeleteProduct"
              @close="closeModal">
    <form @submit="onDeleteProduct">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl"/>
        <span>Are you sure you want to delete <b>{{ productName }}</b>?</span>
      </div>
    </form>
  </base-modal>
</template>
<script setup lang="ts">
import BaseModal from "~/components/admin/BaseModal.vue";
import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {deleteProduct, getProductById} from "~/services/admin/ProductService";
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

const productName = ref('')
const showModal = ref(true)

const {mutate, isPending} = useMutation({
  mutationFn: deleteProduct,
  onSuccess: (data, isLoading) => {
    queryClient.invalidateQueries(["products"]);
    closeModal();
    refresh();
  },
  onError: (error) => {
    console.error("Error updating product:", error);
  }
});

const getProduct = async () => {
  const response = await getProductById(props?.id);
  const fetchedProduct = response?.data?.product;
  productName.value = fetchedProduct?.name;
}

const onDeleteProduct = async () => {
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
  getProduct()
})
</script>