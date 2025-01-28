<template>
  <Dialog v-model:visible="isVisible" modal :header="title" :style="{ width: '450px' }" @update:visible="close" dismissable-mask close-on-escape maximizable>
    <template #default>
      <slot />
    </template>
    <template #footer>
      <Button label="Cancel" variant="text" icon="pi pi-times" @click="close"/>
      <Button v-if="!isLoading" label="Save" icon="pi pi-check" @click="submit"/>
      <Button v-else label="Save" icon="pi pi-spin pi-spinner" @click="submit"/>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {Dialog} from "primevue";

// props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean
  }
})

// emit
const emit = defineEmits(['close', 'submit'])

// data
const isVisible = ref(props.visible);

// functions
const submit = () => {
  console.log(props.isLoading);
  emit('submit');
}

const close = () => {
  isVisible.value = false;
  emit('close')
}

</script>