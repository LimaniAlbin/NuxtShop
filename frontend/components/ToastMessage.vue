<template>
  <Toast />
</template>

<script setup>
import { watch } from 'vue';
import Toast from 'primevue/toast';
import {useMessagesStore} from "~/store/messagesStore.ts";
import { useToast } from 'primevue';

const errorStore = useMessagesStore();
const toast = useToast();

// Watch for message changes
watch(
    () => errorStore.messageState,
    (messageState) => {
      if (messageState && messageState.message) {
        toast.add({
          severity: messageState.type,
          summary: messageState.type === 'success' ? 'Success' : 'Error',
          detail: messageState.message,
          life: 3000,
        });

        errorStore.clearMessage();
      }
    },
    { deep: true, immediate: true }
);
</script>
