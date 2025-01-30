<template>
  <base-modal title="Edit Product" :visible="showModal" :isLoading="isPending" @submit="onEditProduct" @close="closeModal">
    <Form v-slot="$form"
          :resolver="resolver"
          :initial-values="product"
          @submit="onEditProduct"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText v-model="product.name" id="name" autofocus fluid/>
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">Description</label>
          <Textarea v-model="product.description" id="description" fluid rows="3" cols="20"/>
        </div>
        <div>
          <label for="brand" class="block font-bold mb-3">Brand</label>
          <Select v-model="selectedBrand" :options="brands?.brands" option-label="name" id="brand" fluid/>
        </div>
        <div>
          <label for="price" class="block font-bold mb-3">Price</label>
          <InputNumber v-model="product.price" input-id="price" mode="currency" currency="EUR" locale="de-DE" fluid/>
        </div>
        <div>
          <label for="stock" class="block font-bold mb-3">Stock</label>
          <InputNumber v-model="product.stock" input-id="stock" :min="0" showButtons buttonLayout="horizontal" :step="1"
                       fluid>
            <template #incrementbuttonicon>
              <span class="pi pi-plus"/>
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus"/>
            </template>
          </InputNumber>
        </div>
        <div>
          <label for="image" class="block font-bold mb-3">Image</label>
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
                <div v-if="product?.imageUrl" class="mt-3">
                  <img :src="`${runtimeConfig.public.backendUrl}/uploads/${product?.imageUrl}`"
                       :alt="product?.imageUrl"
                       style="max-width: 100px;"
                  />
                  <p class="mt-2">{{ product.imageUrl }}</p>
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
import {InputText, Textarea, InputNumber, FileUpload, Select} from "primevue";
import {updateProduct, getProductById} from "~/services/admin/ProductService"
import {getAllBrands} from "~/services/admin/BrandService";

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
const product = ref({
  name: "",
  description: "",
  price: 0,
  stock: 0,
})
const selectedBrand = ref({})
const selectedImage = ref<File>()
const showModal = ref(true)

// functions
const { mutate, isPending } = useMutation({
  mutationFn: updateProduct,
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
  product.value = {
    ...fetchedProduct,
    imageUrl: fetchedProduct?.image,
    brand: fetchedProduct?.brand
  };

  selectedBrand.value = brands.value?.brands?.find(b => b.id === fetchedProduct?.brand?.id) || null;
}

const fetchBrands = async () => {
  const response = await getAllBrands()
  return response.data
}

const {data: brands, error, isLoading} = useQuery({
  queryKey: ["brands"],
  queryFn: () => fetchBrands(),
  keepPreviousData: true,
});

// handle image select
const onImageSelect = (event: any) => {
  selectedImage.value = event.files[0];
}


const onEditProduct = async () => {
  const formData = new FormData();
  formData.append("name", product.value.name);
  formData.append("description", product.value.description);
  formData.append("price", product.value.price.toString());
  formData.append('brand', selectedBrand.value._id)
  formData.append("stock", product.value.stock.toString());

  // Append image if selected
  if (selectedImage.value) {
    formData.append("image", selectedImage.value);
  } else if (product.value.imageUrl) {
    // Optionally, append the existing image URL if no new image is selected
    formData.append("image", product.value.imageUrl);
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
  getProduct()
  fetchBrands()
})
</script>
