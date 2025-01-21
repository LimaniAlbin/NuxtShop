<template>
  <Dialog v-model:visible="isVisible" modal :header="title" :style="{ width: '25rem' }" @update:visible="close" dismissable-mask close-on-escape maximizable>
    <template #default>
      <slot />
    </template>
    <template #footer>
      <Button label="Cancel" variant="text" icon="pi pi-times" @click="close"/>
      <Button label="Save" icon="pi pi-check" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {Dialog, Form} from "primevue";

// props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

// emit
const emit = defineEmits(['close'])

// data
const isVisible = ref(props.visible);

// functions
const close = () => {
  isVisible.value = false;
  emit('close')
}

</script>