<template>
  <div>
    <!-- Titles -->
    <div class="flex items-start justify-between p-2 rounded text-green-400 font-extrabold text-xs uppercase">
      <div class="flex items-center space-x-3">
        <span>{{ label }}</span>
      </div>
    </div>

    <!-- Sub Items -->
    <div v-if="items && items.length" class="space-y-1 my-2">
      <NuxtLink
          v-for="(item, index) in items"
          :key="index"
          :to="item.path"
          :class="[
            'flex items-start p-2 text-sm rounded cursor-pointer hover:bg-gray-700',
            isActive(item.path) ? ' text-green-300' : ''
          ]"
      >
        <i :class="item.icon" class="text-sm text-green-300 pt-1"></i>
        <span class="ml-3">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {useRoute} from "#vue-router";

defineProps({
  label: String,
  items: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();

const isActive = (path) => {
  return route.path === path;
}
</script>