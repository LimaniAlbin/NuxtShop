<template>
  <base-modal
      title="Create Product"
      :visible="showModal"
      :is-loading="isPending"
      @submit="onCreateProduct"
      @close="closeModal"
  >
    <form @submit.prevent="onCreateProduct">
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
              v-model="product.name"
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
              v-model="product.description"
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
          <label for="shortDescription" class="block font-bold mb-3">Short Description</label>
          <Textarea
              v-model="product.shortDescription"
              id="shortDescription"
              fluid
              rows="3"
              cols="20"
              :invalid="!!errors.shortDescription"
              @value-change="validateField('shortDescription')"
          />
          <Message v-if="errors.shortDescription" severity="error" size="small" variant="simple">{{ errors.shortDescription }}</Message>
        </div>
        <div>
          <label for="brand" class="block font-bold mb-3">Brand</label>
          <Select
              v-model="selectedBrand"
              :options="data?.brands"
              option-label="name"
              id="brand"
              fluid
              :invalid="!!errors.brand"
              @change="validateField('brand')"
          />
          <Message v-if="errors.brand" severity="error" size="small" variant="simple">{{ errors.brand }}</Message>
        </div>
        <div>
          <label for="price" class="block font-bold mb-3">Price</label>
          <InputNumber
              v-model="product.price"
              input-id="price"
              mode="currency"
              currency="EUR"
              locale="de-DE"
              fluid
              :invalid="!!errors.price"
              @value-change="validateField('price')"
          />
          <Message v-if="errors.price" severity="error" size="small" variant="simple">{{ errors.price }}</Message>
        </div>
        <div>
          <label for="stock" class="block font-bold mb-3">Stock</label>
          <InputNumber
              v-model="product.stock"
              input-id="stock"
              :min="0"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              fluid
              :invalid="!!errors.stock"
              @value-change="validateField('stock')"
          >
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
          <Message v-if="errors.stock" severity="error" size="small" variant="simple">{{ errors.stock }}</Message>
        </div>
        <div>
          <label for="image" class="block font-bold mb-3">Image</label>
          <FileUpload
              name="demo[]"
              url="/api/upload"
              id="image"
              :show-upload-button="false"
              accept="image/*"
              :maxFileSize="1000000"
              @select="onImageSelect"
          >
            <template #empty>
              <span>Drag and drop files here to upload.</span>
            </template>
          </FileUpload>
          <Message v-if="errors.image" severity="error" size="small" variant="simple">{{ errors.image }}</Message>
        </div>
      </div>
    </form>
  </base-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import BaseModal from "~/components/admin/BaseModal.vue";
import { InputText, Textarea, InputNumber, FileUpload, Select } from "primevue";
import { createProduct } from "~/services/admin/ProductService";
import { getAllBrands } from "~/services/admin/BrandService";
import { productSchema } from "~/validators/productValidator";
import { validateField as globalValidateField } from "~/utils/validateField";
import { validateFormData } from "~/utils/validateForm";

const queryClient = useQueryClient();

// emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'refresh'): void;
}>();

// Reactive form state
const product = ref({
  name: "",
  description: "",
  shortDescription: "",
  price: 0,
  stock: 0,
});
const selectedBrand = ref<any>({});
const selectedImage = ref<File | null>(null);
const showModal = ref(true);

const errors = ref<Record<string, string | null>>({
  name: null,
  description: null,
  shortDescription: null,
  price: null,
  stock: null,
  brand: null,
  image: null,
});

const fetchBrands = async () => {
  const response = await getAllBrands();
  return response.data;
};

const { data, error, isLoading } = useQuery({
  queryKey: ["brands"],
  queryFn: fetchBrands,
  keepPreviousData: true,
});

// Local wrapper for field validation that uses the global function
const validateField = (field: "name" | "description" | "shortDescription" | "price" | "stock" | "brand" | "image") => {
  let value: any;
  if (field === "brand") {
    value = selectedBrand.value?._id || "";
  } else if (field === "image") {
    value = selectedImage.value;
  } else {
    value = product.value[field];
  }
  errors.value[field] = globalValidateField(field, value, productSchema);
};

const { mutate, isPending } = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries(["products"]);
    closeModal();
    refresh();
  },
  onError: (error) => {
    console.error("Error creating product:", error);
  }
});

const onImageSelect = (event: any) => {
  selectedImage.value = event.files[0];
  validateField("image");
};

const validateForm = () => {
  const formData = {
    name: product.value.name,
    description: product.value.description,
    shortDescription: product.value.shortDescription,
    price: product.value.price,
    stock: product.value.stock,
    brand: selectedBrand.value?._id || "",
    image: selectedImage.value || undefined,
  };

  const { valid, errors: formErrors } = validateFormData(formData, productSchema);
  errors.value = formErrors;
  return valid;
};

const onCreateProduct = async () => {
  if (!validateForm()) {
    return;
  }

  const formData = new FormData();
  formData.append("name", product.value.name);
  formData.append("description", product.value.description);
  formData.append("shortDescription", product.value.shortDescription);
  formData.append("price", product.value.price.toString());
  formData.append("brand", selectedBrand.value._id);
  formData.append("stock", product.value.stock.toString());
  if (selectedImage.value) {
    formData.append("image", selectedImage.value);
  }

  mutate(formData);
};

const refresh = () => {
  emit("refresh");
};

const closeModal = () => {
  showModal.value = false;
  emit("close");
};
</script>

