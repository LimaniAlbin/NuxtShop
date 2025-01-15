<template>

  <div class="flex h-screen">
    <div class="w-64 bg-gray-800 text-white flex flex-col">
      <!-- Logo Section -->
      <div class="p-4 flex items-center justify-center border-b border-gray-700">
        <i class="pi pi-prime text-green-400 mr-3"></i>
        <div class="text-xl font-bold text-green-400">NuxtShop</div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <SidebarItem label="Shop" :items="dashboards"/>
        <SidebarItem label="Apps" :items="apps"/>
        <SidebarItem label="UI Kit" :items="uiKit"/>
      </nav>
    </div>
    <slot/>
  </div>

</template>

<script setup>
import SidebarItem from '~/components/admin/SidebarItem.vue';

const dashboards = [
  {label: 'Dashboard', icon: 'pi pi-chart-line', path: '/admin/dashboard'},
  {label: 'Products', icon: 'pi pi-shopping-cart', path: '/admin/products'},
];

const apps = [
  {label: 'Blog', icon: 'pi pi-pencil'},
  {label: 'Chat', icon: 'pi pi-comments'},
  {label: 'Files', icon: 'pi pi-folder'},
  {label: 'Mail', icon: 'pi pi-envelope'},
  {label: 'Task List', icon: 'pi pi-check-square'},
];

const uiKit = [
  {label: 'Form Layout', icon: 'pi pi-th-large'},
  {label: 'Input', icon: 'pi pi-keyboard'},
  {label: 'Button', icon: 'pi pi-ellipsis-h'},
  {label: 'Table', icon: 'pi pi-table'},
  {label: 'List', icon: 'pi pi-list'},
  {label: 'Tree', icon: 'pi pi-sitemap'},
  {label: 'Panel', icon: 'pi pi-window-minimize'},
  {label: 'Overlay', icon: 'pi pi-box'},
  {label: 'Media', icon: 'pi pi-camera'},
  {label: 'Menu', icon: 'pi pi-bars'},
];
</script>
