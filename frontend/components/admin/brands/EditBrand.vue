<template>
  <base-modal v-if="dataLoaded"
              title="Edit Brand"
              :visible="showModal"
              :is-loading="isPending"
              @submit="onEditBrand"
              @close="closeModal"
  >
    <form @submit.prevent="onEditBrand">
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
              v-model="brand.name"
              id="name"
              autofocus
              fluid
              :invalid="!!errors.name"
              @value-change="validateField('name')"
          />
          <Message v-if="errors.name" severity="error" size="small" variant="simple">{{ errors.name }}</Message>
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">Description</label>
          <Textarea
              v-model="brand.description"
              id="description"
              fluid
              rows="3"
              cols="20"
              :invalid="!!errors.description"
              @value-change="validateField('description')"
          />
          <Message v-if="errors.description" severity="error" size="small" variant="simple">{{ errors.description }}</Message>
        </div>
        <div>
          <label for="logo" class="block font-bold mb-3">Image</label>
          <FileUpload
              name="demo[]"
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
          <Message v-if="errors.logo" severity="error" size="small" variant="simple">{{ errors.logo }}</Message>
        </div>
      </div>
    </form>
  </base-modal>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import BaseModal from "~/components/admin/BaseModal.vue";
import { InputText, Textarea, FileUpload, Message } from "primevue";
import { getBrandById, updateBrand } from "~/services/admin/BrandService";
import { validateField as globalValidateField } from "~/utils/validateField";
import { validateFormData } from "~/utils/validateForm";
import { updateBrandSchema } from "~/validators/brandValidator";

const runtimeConfig = useRuntimeConfig();
const queryClient = useQueryClient();

const props = defineProps({
  id: {
    type: String,
    required: true,
  }
});

// emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'refresh'): void;
}>();

// Reactive form state
const brand = ref({
  name: "",
  description: "",
});
const selectedImage = ref<File | null>(null);
const showModal = ref(true);
const dataLoaded = ref(false)

const errors = ref<Record<string, string | null>>({
  name: null,
  description: null,
  logo: null,
});

// Validation function
const validateField = (field: "name" | "description" | "logo") => {
  let value: any;
  if (field === "logo") {
    value = selectedImage.value;
  } else {
    value = brand.value[field];
  }
  errors.value[field] = globalValidateField(field, value, updateBrandSchema);
};

// Validate form data
const validateForm = () => {
  const formData = {
    name: brand.value.name,
    description: brand.value.description,
    logo: selectedImage.value || undefined,
  };

  const { valid, errors: formErrors } = validateFormData(formData, updateBrandSchema);
  errors.value = formErrors;
  return valid;
};

// Mutation to update the brand
const { mutate, isPending } = useMutation({
  mutationFn: updateBrand,
  onSuccess: () => {
    queryClient.invalidateQueries(["brands"]);
    closeModal();
    refresh();
  },
  onError: (error) => {
    console.error("Error editing brand:", error);
  }
});

// Fetch brand data
const getBrand = async () => {
  const response = await getBrandById(props?.id);
  const fetchedBrand = response?.data?.brand;
  brand.value = {
    ...fetchedBrand,
    imageUrl: fetchedBrand?.logo,
  };

  dataLoaded.value = true;
};

// Handle logo selection
const onImageSelect = (event: any) => {
  selectedImage.value = event.files[0];
  validateField("logo");
};

const onEditBrand = async () => {
  if (!validateForm()) {
    return;
  }

  const formData = new FormData();
  formData.append("name", brand.value.name);
  formData.append("description", brand.value.description);
  if (selectedImage.value) {
    formData.append("logo", selectedImage.value);
  } else if (brand.value.imageUrl) {
    // Optionally, append the existing image URL if no new image is selected
    formData.append("logo", brand.value.imageUrl);
  }

  mutate({ id: props.id, data: formData });
};

// Refresh the parent component
const refresh = () => {
  emit('refresh');
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  emit('close');
};

onMounted(() => {
  getBrand();
});
</script>

