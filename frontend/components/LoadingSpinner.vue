<template>
  <div class="card flex justify-center">
    <ProgressSpinner style="width: 50px; height: 50px"
                     strokeWidth="8" f
                     ill="transparent"
                     animationDuration=".5s"
                     aria-label="Custom Progress Spinner"
    />
  </div>
</template>

<script setup lang="ts">
import {ProgressSpinner} from "primevue";
</script>

<style>
.p-progressspinner-circle {
  stroke: #30b987 !important;
}
</style>
