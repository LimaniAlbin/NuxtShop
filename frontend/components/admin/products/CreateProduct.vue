<template>
  <base-modal title="Create Product" :visible="showModal" @close="closeModal">
    <input-text />
  </base-modal>/
</template>
<script setup lang="ts">
import BaseModal from "~/components/admin/BaseModal.vue";
import {InputText} from "primevue";

// emits
const emit = defineEmits(['emit'])

// data
const showModal = ref(true)

// functions
const closeModal = () => {
  showModal.value = false
  emit('close')
}
</script>