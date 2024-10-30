<template>
  <div class="flex items-center justify-center bg-base-200 px-4 sm:px-6 lg:px-8" style="height: calc(100vh - 5rem)">
    <div class="card bg-base-100 shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <div class="card-body">
        <h2 class="card-title text-3xl font-bold mb-4 text-center">Trip Invitation</h2>

        <div v-if="loading" class="flex justify-center">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="error" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <div v-else class="text-center">
          <p class="text-lg mb-4">You have been successfully added to the trip!</p>
          <button @click="goToTrip" class="btn btn-neutral">View Trip</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { createTripUser, getTrip } from "@/utils/appwrite/services";

const router = useRouter();
const auth = useAuthStore();
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const tripId = window.location.hash.slice(1);

  if (!tripId) {
    error.value = "Invalid invitation link";
    loading.value = false;
    return;
  }

  try {
    const isAuthenticated = await auth.check();

    if (!isAuthenticated) {
      localStorage.setItem("pendingInviteTripId", tripId);

      router.push("/login");

      return;
    }

    const trip = await getTrip(tripId);

    if (!trip) {
      error.value = "Trip not found";
      loading.value = false;
      return;
    }

    await createTripUser(tripId, auth.user.id);

    loading.value = false;
  } catch (err) {
    console.error("Error processing invitation:", err);
    error.value = "Failed to process invitation";
    loading.value = false;
  }
});

const goToTrip = () => {
  router.push("/");
};
</script>
