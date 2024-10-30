<template>
  <div class="flex items-center justify-center bg-base-200 px-2 sm:px-6 lg:px-8" style="min-height: calc(100vh - 5rem)">
    <div class="card bg-base-100 shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl my-4">
      <div class="card-body p-4 sm:p-8">
        <h2 class="card-title text-2xl sm:text-3xl font-bold mb-4 text-center">Plan a new trip</h2>

        <div class="w-full mb-5">
          <div class="label">
            <span class="label-text text-lg font-bold">Cover Image</span>
          </div>
          <div class="relative w-full h-32 sm:h-40 bg-base-200 rounded-lg overflow-hidden cursor-pointer" @click="imageBrowserRef?.showDialog()">
            <img v-if="selectedImage" :src="selectedImage.url" :alt="selectedImage.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="mx-auto mb-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
                <p class="text-sm">Click to select cover image</p>
              </div>
            </div>
          </div>
        </div>

        <label class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text text-lg font-bold">Where to?</span>
          </div>
          <input type="text" placeholder="Type here" class="input input-bordered w-full" v-model="name" :class="{ 'input-error': errors.name }" @blur="validateName" autofocus />
          <div v-if="errors.name" class="text-error text-sm mt-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {{ errors.name }}
          </div>
        </label>

        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
          <label class="form-control w-full sm:w-1/2">
            <div class="label">
              <span class="label-text text-lg font-bold">Start Date</span>
            </div>
            <VueDatePicker v-model="startDate" class="rounded w-full" :class="{ 'input-error': errors.startDate }" @blur="validateStartDate" />
            <div v-if="errors.startDate" class="text-error text-sm mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {{ errors.startDate }}
            </div>
          </label>

          <label class="form-control w-full sm:w-1/2">
            <div class="label">
              <span class="label-text text-lg font-bold">End Date</span>
            </div>
            <VueDatePicker v-model="endDate" class="rounded w-full" :class="{ 'input-error': errors.endDate }" @blur="validateEndDate" />
            <div v-if="errors.endDate" class="text-error text-sm mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {{ errors.endDate }}
            </div>
          </label>
        </div>

        <div class="card-actions justify-center mt-5 sm:mt-7">
          <button class="btn btn-neutral w-full" @click="handleCreateTrip" :disabled="isLoading">
            <span v-if="isLoading" class="loading loading-spinner"></span>
            Start Planning
          </button>
        </div>
      </div>
    </div>

    <ImageBrowser ref="imageBrowserRef" @select="handleImageSelection" />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { createTrip, createTripUser } from "@/utils/appwrite/services";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ImageBrowser from "@/components/ImageBrowser/index.vue";

const router = useRouter();
const name = ref("");
const startDate = ref(null);
const endDate = ref(null);
const errors = ref({
  name: null,
  startDate: null,
  endDate: null,
});

const auth = useAuthStore();
const isLoading = ref(false);

const imageBrowserRef = ref(null);
const selectedImage = ref(null);

function handleImageSelection(image) {
  selectedImage.value = image;
}

const validateName = () => {
  errors.value.name = name.value.trim() === "" ? "Trip name is required" : null;
};

const validateStartDate = () => {
  errors.value.startDate = !startDate.value ? "Start date is required" : null;
};

const validateEndDate = () => {
  errors.value.endDate = !endDate.value ? "End date is required" : null;
  if (startDate.value && endDate.value && endDate.value < startDate.value) {
    errors.value.endDate = "End date must be after start date";
  }
};

async function handleCreateTrip() {
  validateName();
  validateStartDate();
  validateEndDate();

  if (!errors.value.name && !errors.value.startDate && !errors.value.endDate) {
    isLoading.value = true;
    try {
      const trip = await createTrip({
        name: name.value,
        startDate: startDate.value,
        endDate: endDate.value,
        image: selectedImage.value?.url,
      });

      const userId = auth.user.id;
      await createTripUser(trip.$id, userId);

      router.push({ path: `/trip`, hash: "#" + trip.$id });
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      isLoading.value = false;
    }
  }
}
</script>

<style>
.input-error {
  border-color: #f87171;
}

.dp__input_reg {
  border-radius: 2rem;
  padding: 0.5rem;
  padding-left: 2rem;
  width: 100%;
}

.hero {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
}
</style>
