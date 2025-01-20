<template>
  <DataTable :value="data" tableStyle="min-width: 50rem">
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <p class="m-0 text-lg">Manage {{ title }}</p>
        <IconField>
          <InputIcon>
            <i class="pi pi-search"/>
          </InputIcon>
          <InputText placeholder="Search..."/>
        </IconField>
      </div>
    </template>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${runtimeConfig.public.backendUrl}/uploads/${slotProps?.data?.image}`" :alt="title + 'Image'" />
      </template>
    </Column>
    <Column field="name" header="Name"></Column>
    <Column field="description" header="Description"></Column>
    <Column field="price" header="Price"></Column>
    <Column field="stock" header="Stock"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import {IconField, InputIcon, InputText} from "primevue";

const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

onMounted(() => {
  console.log(props)
})
</script>