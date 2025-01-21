<template>
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

<script setup lang="ts">
import {IconField, InputIcon, InputText} from "primevue";

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
