<template>
  <base-modal title="Edit Product" :visible="showModal" :isLoading="isPending" @submit="onDeleteBrand"
              @close="closeModal">
    <Form v-slot="$form"
          :resolver="resolver"
          @submit="onDeleteBrand"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl"/>
        <span>Are you sure you want to delete <b>{{ brandName }}</b
        >?</span
        >
      </div>
    </Form>
  </base-modal>
</template>
<script setup lang="ts">
import BaseModal from "~/components/admin/BaseModal.vue";
import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {deleteBrand, getBrandById} from "~/services/admin/BrandService";
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

const brandName = ref('')
const showModal = ref(true)

const {mutate, isPending} = useMutation({
  mutationFn: deleteBrand,
  onSuccess: (data, isLoading) => {
    queryClient.invalidateQueries(["brands"]);
    closeModal();
    refresh();
  },
  onError: (error) => {
    console.error("Error updating product:", error);
  }
});

const getBrand = async () => {
  const response = await getBrandById(props?.id);
  const fetchedBrand = response?.data?.brand;
  brandName.value = fetchedBrand?.name;
}

const onDeleteBrand = async () => {
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
  getBrand()
})
</script>