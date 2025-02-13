<template>
  <div>
    <NuxtRouteAnnouncer/>
    <ToastMessage />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import ToastMessage from './components/ToastMessage.vue'
</script>
