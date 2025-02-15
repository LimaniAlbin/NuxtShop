<template>
  <base-modal
      v-if="dataLoaded"
      title="Edit Product"
      :visible="showModal"
      :is-loading="isPending"
      @submit="onEditProduct"
      @close="closeModal"
  >
    <p v-if="loading">Loading...</p>
    <form v-else @submit.prevent="onEditProduct">
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
          <Message
              v-if="errors.name"
              severity="error"
              size="small"
              variant="simple"
          >
            {{ errors.name }}
          </Message>
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">Description</label>
          <Editor
              v-model="product.description"
              id="description"
              fluid
              :invalid="!!errors.description"
              @value-change="validateField('description')"
          />
          <Message
              v-if="errors.description"
              severity="error"
              size="small"
              variant="simple"
          >
            {{ errors.description }}
          </Message>
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
          <Message
              v-if="errors.shortDescription"
              severity="error"
              size="small"
              variant="simple"
          >
            {{ errors.shortDescription }}
          </Message>
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label for="brand" class="block font-bold mb-3">Brand</label>
            <Select
                v-model="selectedBrand"
                :options="brands?.brands"
                option-label="name"
                id="brand"
                fluid
                :invalid="!!errors.brand"
                @change="validateField('brand')"
            />
            <Message v-if="errors.brand" severity="error" size="small" variant="simple">{{ errors.brand }}</Message>
          </div>

          <div class="flex-1">
            <label for="category" class="block font-bold mb-3">Category</label>
            <Select
                v-model="selectedCategory"
                :options="categories?.categories"
                option-label="name"
                id="category"
                fluid
                :invalid="!!errors.category"
                @change="validateField('category')"
            />
            <Message v-if="errors.category" severity="error" size="small" variant="simple">{{ errors.category }}</Message>
          </div>
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
          <Message
              v-if="errors.price"
              severity="error"
              size="small"
              variant="simple"
          >
            {{ errors.price }}
          </Message>
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
              <span class="pi pi-plus"/>
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus"/>
            </template>
          </InputNumber>
          <Message
              v-if="errors.stock"
              severity="error"
              size="small"
              variant="simple"
          >
            {{ errors.stock }}
          </Message>
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
          <Message
              v-if="errors.image"
              severity="error"
              size="small"
              variant="simple"
          >
            {{ errors.image }}
          </Message>
          <div v-if="product.imageUrl" class="mt-3">
            <img
                :src="`${runtimeConfig.public.backendUrl}/uploads/${product.imageUrl}`"
                :alt="product.imageUrl"
                style="max-width: 100px;"
            />
            <p class="mt-2">{{ product.imageUrl }}</p>
          </div>
        </div>
      </div>
    </form>
  </base-modal>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useMutation, useQuery, useQueryClient} from '@tanstack/vue-query';
import BaseModal from '~/components/admin/BaseModal.vue';
import {InputText, Textarea, InputNumber, FileUpload, Select, Message} from 'primevue';
import Editor from 'primevue/editor';
import {updateProduct, getProductById} from '~/services/admin/ProductService';
import {getAllBrands} from '~/services/admin/BrandService';
import {updateProductSchema} from '~/validators/productValidator';
import {validateField as globalValidateField} from '~/utils/validateField';
import {validateFormData} from "~/utils/validateForm";
import {getAllCategories} from "~/services/admin/CategoryService";

const runtimeConfig = useRuntimeConfig();
const queryClient = useQueryClient();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'refresh'): void;
}>();

// Reactive Data
const product = ref({
  name: '',
  description: '',
  shortDescription: '',
  price: 0,
  stock: 0,
  imageUrl: '',
});
const selectedBrand = ref<any>({});
const selectedCategory = ref<any>({});
const selectedImage = ref<File | null>(null);
const showModal = ref(true);
const dataLoaded = ref(false);

// Error messages for each field
const errors = ref<Record<string, string | null>>({
  name: null,
  description: null,
  shortDescription: null,
  price: null,
  stock: null,
  brand: null,
  category: null,
  image: null,
});

// Local field validation wrapper using the global validator
const validateField = (field: 'name' | 'description'| 'shortDescription' | 'price' | 'stock' | 'brand' | 'category' | 'image') => {
  let value: any;
  if (field === 'brand') {
    value = selectedBrand.value?._id || '';
  } else if (field === "category") {
    value = selectedCategory.value?._id || "";
  } else if (field === 'image') {
    value = selectedImage.value;
  } else {
    value = product.value[field];
  }
  errors.value[field] = globalValidateField(field, value, updateProductSchema);
};

// Full form validation function
const validateForm = () => {
  const formData = {
    name: product.value.name,
    description: product.value.description,
    shortDescription: product.value.shortDescription,
    price: product.value.price,
    stock: product.value.stock,
    brand: selectedBrand.value?._id || "",
    category: selectedCategory.value?._id || "",
    image: selectedImage.value || undefined,
  };

  const {valid, errors: formErrors} = validateFormData(formData, updateProductSchema);
  errors.value = formErrors;
  return valid;
};

// Query for available brands
const {data: brands, isPending: loading} = useQuery({
  queryKey: ['brands'],
  queryFn: async () => {
    const response = await getAllBrands();
    return response.data;
  },
  keepPreviousData: true,
});

const {data: categories} = useQuery({
  queryKey: ['categories'],
  queryFn: async () => {
    const response = await getAllCategories();
    return response.data;
  },
  keepPreviousData: true,
});

// Mutation for updating the product
const {mutate, isPending} = useMutation({
  mutationFn: updateProduct,
  onSuccess: () => {
    queryClient.invalidateQueries(['products']);
    closeModal();
    refresh();
  },
  onError: (error) => {
    console.error('Error updating product:', error);
  },
});

// Image selection handler
const onImageSelect = (event: any) => {
  selectedImage.value = event.files[0];
  validateField('image');
};

// Fetch the product data by id
const getProduct = async () => {
  const response = await getProductById(props.id);
  const fetchedProduct = response?.data?.product;
  product.value = {
    ...fetchedProduct,
    imageUrl: fetchedProduct?.image,
  };

  // Set the selected brand from the available brands
  if (brands.value && fetchedProduct?.brand) {
    selectedBrand.value =
        brands.value.brands.find((b: any) => b._id === fetchedProduct.brand._id) || null;
  }

  if (categories.value && fetchedProduct?.category) {
    selectedCategory.value =
        categories.value.categories.find((c: any) => c._id === fetchedProduct.category._id) || null;
  }
  dataLoaded.value = true; // Mark data as loaded
};

// Form submit handler
const onEditProduct = async () => {
  if (!validateForm()) return;

  const formData = new FormData();
  formData.append('name', product.value.name);
  formData.append('description', product.value.description);
  formData.append('shortDescription', product.value.shortDescription);
  formData.append('price', product.value.price.toString());
  formData.append('brand', selectedBrand.value._id);
  formData.append('category', selectedCategory.value._id);
  formData.append('stock', product.value.stock.toString());
  if (selectedImage.value) {
    formData.append('image', selectedImage.value);
  } else if (product.value.imageUrl) {
    formData.append('image', product.value.imageUrl);
  }

  console.log(formData)

  mutate({id: props.id, data: formData});
};

const refresh = () => {
  emit('refresh');
};

const closeModal = () => {
  showModal.value = false;
  emit('close');
};

onMounted(() => {
  getProduct();
});
</script>
