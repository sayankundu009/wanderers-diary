<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-4xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Select Cover Image</h3>
        <button @click="closeDialog" class="btn btn-sm btn-circle btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2">
        <div v-for="image in images" :key="image.id" class="relative aspect-video cursor-pointer group" @click="selectImage(image)">
          <img :src="image.url" :alt="image.name" class="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105" />
          <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <button class="btn btn-sm btn-ghost text-white">Select</button>
          </div>
          <div v-if="selectedImage?.id === image.id" class="absolute inset-0 bg-orange-500 bg-opacity-20 rounded-lg border-4 border-orange-500 ring-2 ring-white/50 transition-transform duration-200 group-hover:scale-105"></div>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="closeDialog">Cancel</button>
        <button class="btn btn-neutral" :disabled="!selectedImage" @click="confirmSelection">Confirm</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeDialog">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  initialSelected: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["close", "select"]);

const dialogRef = ref(null);
const selectedImage = ref(null);

const images = ref([
  {
    id: "1",
    name: "Mountain Landscape",
    url: window.location.origin + "/images/green-mountains.jpg",
  },
  {
    id: "2",
    name: "Beach",
    url: window.location.origin + "/images/beach.jpg",
  },
  {
    id: "3",
    name: "City Skyline",
    url: window.location.origin + "/images/city.jpg",
  },
  {
    id: "4",
    name: "Desert Landscape",
    url: window.location.origin + "/images/desert.jpg",
  },
  {
    id: "5",
    name: "Forest",
    url: window.location.origin + "/images/forest.jpg",
  },
  {
    id: "6",
    name: "Snowy Mountains",
    url: window.location.origin + "/images/snowy-mountains.jpg",
  },
]);

function selectImage(image) {
  selectedImage.value = image;
}

function confirmSelection() {
  if (selectedImage.value) {
    emit("select", selectedImage.value);
    closeDialog();
  }
}

function closeDialog() {
  dialogRef.value?.close();
  emit("close");
}

function showDialog() {
  dialogRef.value?.showModal();
}

defineExpose({
  showDialog,
});
</script>
