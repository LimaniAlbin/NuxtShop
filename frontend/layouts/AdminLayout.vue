<template>
  <div class="layout-wrapper layout-static">
    <topbar></topbar>
    <sidebar></sidebar>
    <div class="layout-main-container">
      <div class="layout-main">
        <slot/>
      </div>
    </div>
  </div>
</template>
<script setup>
import topbar from "~/layouts/Topbar.vue";
import sidebar from "~/layouts/Sidebar.vue";
</script>