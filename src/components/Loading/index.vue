<template>
  <Transition>
    <div v-if="show" class="bg-base-200" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; position: fixed; top: 0; left: 0; z-index: 999999">
      <img class="mb-16" src="@/assets/loading.gif" alt="Loading..." style="width: 12rem; height: 12rem; display: flex" />
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
