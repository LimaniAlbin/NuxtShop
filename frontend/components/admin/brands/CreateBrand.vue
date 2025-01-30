<template>
  <base-modal title="Create Brand" :visible="showModal" :is-loading="isPending" @submit="onCreateBrand" @close="closeModal">
    <Form v-slot="$form"
          :resolver="resolver"
          @submit="onCreateBrand"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText v-model="brand.name" id="name" autofocus fluid/>
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">Description</label>
          <Textarea v-model="brand.description" id="description" fluid rows="3" cols="20"/>
        </div>
        <div>
          <label for="logo" class="block font-bold mb-3">Image</label>
          <FileUpload name="demo[]"
                      url="/api/upload"
                      id="logo"
                      :show-upload-button="false"
                      accept="image/*"
                      :maxFileSize="1000000"
                      @select="onImageSelect($event)"
          >
            <template #empty>
              <span>Drag and drop files to here to upload.</span>
            </template>
          </FileUpload>
        </div>
      </div>
    </Form>
  </base-modal>
</template>

<script setup lang="ts">
import {useMutation, useQuery, useQueryClient} from '@tanstack/vue-query';
import BaseModal from "~/components/admin/BaseModal.vue";
import { InputText, Textarea, FileUpload } from "primevue";
import { createBrand } from "~/services/admin/BrandService";

const queryClient = useQueryClient()

// emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'refresh'): void;
}>();

// data
const brand = ref({
  name: "",
  description: "",
})
const selectedImage = ref<File>()
const showModal = ref(true)

// functions
const { mutate, isPending } = useMutation({
  mutationFn: createBrand,
  onSuccess: (data) => {
    queryClient.invalidateQueries(["brands"]);
    closeModal();
    refresh()
  },
  onError: (error) => {
    console.error("Error creating product:", error);
  }
});

// handle logo select
const onImageSelect = (event: any) => {
  selectedImage.value = event.files[0];
}

const onCreateBrand = async () => {
  const formData = new FormData();
  formData.append("name", brand.value.name);
  formData.append("description", brand.value.description);
  if (selectedImage.value) {
    formData.append("logo", selectedImage.value);
  }

  mutate(formData);
}

const refresh = () => {
  emit('refresh')
}

const closeModal = () => {
  showModal.value = false
  emit('close')
}
</script>
