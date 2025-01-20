<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container ml-5">
      <NuxtLink to="/admin/dashboard" class="layout-topbar-logo">
        <i class="pi pi-amazon text-green-400 text-xl"></i>
        <span>NUXTSHOP</span>
      </NuxtLink>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button>
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-inbox"></i>
            <span>Messages</span>
          </button>
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>