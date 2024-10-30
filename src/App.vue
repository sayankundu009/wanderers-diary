<script setup>
import Loading from "@/components/Loading/index.vue";
import { useAppStore } from "@/stores/app";

const appState = useAppStore();
</script>

<template>
  <Loading :show="appState.loading" />

  <RouterView />
</template>

<style scoped>
</style>
