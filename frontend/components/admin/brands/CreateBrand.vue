<template>
  <base-modal title="Create Brand" :visible="showModal" :is-loading="isPending" @submit="onCreateBrand" @close="closeModal">
    <form @submit.prevent="onCreateBrand">
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
          <Message v-if="errors.logo" severity="error" size="small" variant="simple">{{ errors.logo }}</Message>
        </div>
      </div>
    </form>
  </base-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import BaseModal from "~/components/admin/BaseModal.vue";
import { InputText, Textarea, FileUpload } from "primevue";
import { createBrand } from "~/services/admin/BrandService";
import { validateField as globalValidateField } from "~/utils/validateField";
import { validateFormData } from "~/utils/validateForm";
import {brandSchema} from "~/validators/brandValidator";

const queryClient = useQueryClient();

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
  errors.value[field] = globalValidateField(field, value, brandSchema);
};

// Validate form data
const validateForm = () => {
  const formData = {
    name: brand.value.name,
    description: brand.value.description,
    logo: selectedImage.value || undefined,
  };

  const { valid, errors: formErrors } = validateFormData(formData, brandSchema);
  errors.value = formErrors;
  return valid;
};

// Mutation to create a brand
const { mutate, isPending } = useMutation({
  mutationFn: createBrand,
  onSuccess: () => {
    queryClient.invalidateQueries(["brands"]);
    closeModal();
    refresh();
  },
  onError: (error) => {
    console.error("Error creating brand:", error);
  }
});

// Handle logo selection
const onImageSelect = (event: any) => {
  selectedImage.value = event.files[0];
  validateField("logo");
};

// Create brand
const onCreateBrand = async () => {
  if (!validateForm()) {
    return;
  }

  const formData = new FormData();
  formData.append("name", brand.value.name);
  formData.append("description", brand.value.description);
  if (selectedImage.value) {
    formData.append("logo", selectedImage.value);
  }

  mutate(formData);
};

// Refresh the parent component
const refresh = () => {
  emit("refresh");
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  emit("close");
};
</script>
