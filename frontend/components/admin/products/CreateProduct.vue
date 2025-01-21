<template>
  <base-modal title="Create Product" :visible="showModal" @close="closeModal">
    <Form v-slot="$form"
          :initial-values
          :resolver="resolver"
          @submit="onCreateProduct"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText v-model="product.name" id="name" autofocus fluid />
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">Description</label>
          <Textarea v-model="product.description" id="description" fluid rows="3" cols="20"/>
        </div>
        <div>
          <label for="price" class="block font-bold mb-3">Price</label>
          <InputNumber v-model="product.price" input-id="price" mode="currency" currency="EUR" locale="de-DE" fluid/>
        </div>
        <div>
          <label for="stock" class="block font-bold mb-3">Stock</label>
          <InputNumber v-model="product.stock" input-id="stock" :min="0" showButtons buttonLayout="horizontal" :step="1" fluid>
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
        </div>
        <div>
          <label for="image" class="block font-bold mb-3">Image</label>
          <FileUpload name="demo[]"
                      url="/api/upload"
                      id="image"
                      :show-upload-button="false"
                      :multiple="true"
                      accept="image/*"
                      :maxFileSize="1000000"
                      @upload="onAdvancedUpload($event)"
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
import BaseModal from "~/components/admin/BaseModal.vue";
import {InputText, Textarea, InputNumber, FileUpload} from "primevue";
import {Form} from "@primevue/forms";

// emits
const emit = defineEmits(['emit'])

// data
const product = ref({
  name: "",
  description: "",
  price: 0,
  stock: 0,
})
const showModal = ref(true)

// functions
const closeModal = () => {
  showModal.value = false
  emit('close')
}
</script>