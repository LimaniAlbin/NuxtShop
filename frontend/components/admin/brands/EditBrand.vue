<template>
  <base-modal title="Create Brand" :visible="showModal" :is-loading="isPending" @submit="onEditBrand" @close="closeModal">
    <Form v-slot="$form"
          :resolver="resolver"
          :initial-values="brand"
          @submit="onEditBrand"
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
                      id="image"
                      :show-upload-button="false"
                      accept="image/*"
                      :maxFileSize="1000000"
                      @select="onImageSelect($event)"
          >
            <template #empty>
              <div>
                <span>Drag and drop files to here to upload.</span>
                <!-- Display existing image if available -->
                <div v-if="brand?.imageUrl" class="mt-3">
                  <img :src="`${runtimeConfig.public.backendUrl}/uploads/${brand?.imageUrl}`"
                       :alt="brand?.imageUrl"
                       style="max-width: 100px;"
                  />
                  <p class="mt-2">{{ brand.imageUrl }}</p>
                </div>

              </div>
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
import {getBrandById, updateBrand} from "~/services/admin/BrandService";

const runtimeConfig = useRuntimeConfig();
const queryClient = useQueryClient()

const props = defineProps({
  id: {
    type: String,
    required: true,
  }
})

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
  mutationFn: updateBrand,
  onSuccess: (data) => {
    queryClient.invalidateQueries(["brands"]);
    closeModal();
    refresh()
  },
  onError: (error) => {
    console.error("Error creating product:", error);
  }
});

const getBrand = async () => {
  const response = await getBrandById(props?.id);
  const fetchedBrand = response?.data?.brand;
  console.log(fetchedBrand)
  brand.value = {
    ...fetchedBrand,
    imageUrl: fetchedBrand?.logo,
  };
}

// handle logo select
const onImageSelect = (event: any) => {
  selectedImage.value = event.files[0];
}

const onEditBrand = async () => {
  const formData = new FormData();
  formData.append("name", brand?.value?.name);
  formData.append("description", brand?.value?.description);
  if (selectedImage?.value) {
    formData.append("logo", selectedImage?.value);
  } else if (brand?.value?.imageUrl) {
    // Optionally, append the existing image URL if no new image is selected
    formData.append("logo", brand?.value?.imageUrl);
  }

  // Now pass the correct object to the mutate function
  mutate({ id: props.id, data: formData });
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
