<template>
  <Navbar />

  <router-view/>
</template>
  
<script setup>
import Navbar from "@/components/Navbar/index.vue";
import { RouterView } from "vue-router";
</script>
  
<style>
</style>