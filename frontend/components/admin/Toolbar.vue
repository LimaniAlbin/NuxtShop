<template>
  <Toolbar>
    <template #start>
      <Button icon="pi pi-plus" class="mr-2" severity="secondary" label="Add"/>
    </template>
    <template #end>
      <Button icon="pi pi-upload" severity="secondary" label="Export" />
    </template>
  </Toolbar>
</template>

<script setup>
import Toolbar from 'primevue/toolbar';

</script>