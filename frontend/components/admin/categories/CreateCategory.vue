<template>
  <base-modal title="Create Category" :visible="showModal" :is-loading="isPending" @submit="onCreateCategory" @close="closeModal">
    <form @submit.prevent="onCreateCategory">
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
              v-model="category.name"
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
              v-model="category.description"
              id="description"
              fluid
              rows="3"
              cols="20"
              :invalid="!!errors.description"
              @value-change="validateField('description')"
          />
          <Message v-if="errors.description" severity="error" size="small" variant="simple">{{ errors.description }}</Message>
        </div>
      </div>
    </form>
  </base-modal>
</template>
<script setup lang="ts">
import BaseModal from "~/components/admin/BaseModal.vue";
import {InputText, Textarea} from "primevue";
import {ref} from "vue";
import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {createCategory} from "~/services/admin/CategoryService";
import {validateField as globalValidateField} from "~/utils/validateField";
import {validateFormData} from "~/utils/validateForm";
import {categorySchema} from "~/validators/categoryValidator";

const queryClient = useQueryClient()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'refresh'): void;
}>();

const category = ref({
  name: "",
  description: "",
});
const showModal = ref(true);

const errors = ref<Record<string, string | null>>({
  name: null,
  description: null,
});

const validateField = (field: "name" | "description") => {
  let value: any;

  value = category.value[field];

  errors.value[field] = globalValidateField(field, value, categorySchema);
};

const validateForm = () => {
  const formData = {
    name: category.value.name,
    description: category.value.description,
  };

  const { valid, errors: formErrors } = validateFormData(formData, categorySchema);
  errors.value = formErrors;
  return valid;
};

const { mutate, isPending } = useMutation({
  mutationFn: createCategory,
  onSuccess: () => {
    queryClient.invalidateQueries(["categories"]);
    closeModal();
    refresh();
  },
  onError: (error) => {
    console.error("Error creating category:", error);
  }
});

const onCreateCategory = async () => {
  if (!validateForm()) {
    return;
  }

  const payload = {
    name: category.value.name,
    description: category.value.description,
  }

  mutate(payload);
};

const refresh = () => {
  emit("refresh");
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  emit("close");
};
</script>