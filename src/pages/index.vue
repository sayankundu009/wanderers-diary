<template>
  <div class="hero bg-base-200 h-full" style="height: calc(100% - 5rem)" v-if="!loading && trips.length === 0">
    <div class="hero-content text-center">
      <div class="max-w-lg mx-auto">
        <h1 class="text-3xl md:text-5xl font-bold">
          {{ isFirstVisit ? "Hello there" : "No trips yet" }}
        </h1>
        <p class="py-6 text-balance">
          {{ isFirstVisit ? "Welcome to Wanderer's Diary! Ready for your next adventure? Click the button below to create your first trip and start building your personalized itinerary." : "Looks like you don't have any trips planned. Why not create a new one?" }}
        </p>
        <button class="btn btn-neutral" @click="navigateToTripCreate">
          {{ isFirstVisit ? "Let the journey begin!" : "Create new trip" }}
        </button>
      </div>
    </div>
  </div>
  <div v-else-if="!loading && trips.length > 0" style="height: calc(100% - 5rem)">
    <section class="bg-base-200 overflow-x-hidden h-full">
      <div class="container mx-auto pt-10 px-4 md:px-10">
        <div class="w-full flex justify-between items-center mb-8">
          <h1 class="text-xl md:text-3xl font-bold">Your upcoming trips</h1>

          <button class="btn btn-neutral" @click="navigateToTripCreate">
            Plan trip
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#ffffff" d="m12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>
        </div>
        <div class="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style="width: 100%">
          <div v-for="trip in trips" :key="trip.$id" class="card glass bg-base-100 shadow-xl cursor-pointer" @click="navigateToTrip(trip.$id)">
            <figure class="relative overflow-hidden group">
              <img :src="trip.image" alt="trip" class="w-full h-48 object-cover transition-transform duration-300 transform group-hover:scale-105" />
              <div class="absolute top-0 left-0 w-full h-full p-3 bg-black/20 flex justify-between">
                <div class="badge badge-light text-orange-500 font-bold">
                  {{ humanizeDate(trip.start_date) }}
                </div>

                <div class="flex items-start gap-2">
                  <div class="dropdown dropdown-end" @click.stop="() => {}">
                    <div tabindex="0" role="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#ffffff" d="M16 12a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2" />
                      </svg>
                    </div>
                    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow">
                      <li>
                        <a @click="openDeleteConfirmation(trip.$id)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path class="fill-red-500" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                          </svg>
                          Delete
                        </a>
                      </li>
                      <li>
                        <a @click="openShareDialog(trip.$id)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                            <path d="M452.1 49L52.3 265.3c-6 3.3-5.6 12.1.6 14.9l68.2 25.7c4 1.5 7.2 4.5 9 8.4l53 109.1c1 4.8 9.9 6.1 10 1.2l-8.1-90.2c.5-6.7 3-13 7.3-18.2l207.3-203.1c1.2-1.2 2.9-1.6 4.5-1.3 3.4.8 4.8 4.9 2.6 7.6L228 338c-4 6-6 11-7 18l-10.7 77.9c.9 6.8 6.2 9.4 10.5 3.3l38.5-45.2c2.6-3.7 7.7-4.5 11.3-1.9l99.2 72.3c4.7 3.5 11.4.9 12.6-4.9L463.8 58c1.5-6.8-5.6-12.3-11.7-9z" class="fill-neutral-900" />
                          </svg>
                          Share
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="absolute bottom-0 right-0 p-3">
                <div class="avatar-group -space-x-4 rtl:space-x-reverse">
                  <template v-if="tripUsers[trip.$id]">
                    <div v-for="user in tripUsers[trip.$id].slice(0, 3)" :key="user.$id" class="avatar placeholder border-2 border-base-100">
                      <div class="bg-orange-600 text-white w-8 rounded-full">
                        <span class="text-white uppercase">
                          {{ user.name?.charAt(0) || "U" }}
                        </span>
                      </div>
                    </div>
                    <div v-if="tripUsers[trip.$id].length > 3" class="avatar placeholder border-2 border-base-100">
                      <div class="bg-orange-600 text-white w-8 rounded-full">
                        <span class="text-white"> +{{ tripUsers[trip.$id].length - 3 }} </span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </figure>
            <div class="card-body p-3">
              <h2 class="card-title text-sm">
                {{ trip.name }}
              </h2>
              <p>{{ formatDate(trip.start_date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else-if="loading" style="height: calc(100% - 5rem)">
    <section class="bg-base-200 overflow-x-hidden h-full">
      <div class="container mx-auto pt-10 px-4 md:px-10">
        <div class="w-full flex justify-between items-center mb-8">
          <div class="h-8 bg-base-300 rounded w-48"></div>
          <div class="h-8 bg-base-300 rounded w-24"></div>
        </div>
        <div class="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style="width: 100%">
          <div v-for="n in 4" :key="n" class="card glass bg-base-100 shadow-xl animate-pulse">
            <figure class="relative h-48 bg-base-300"></figure>
            <div class="card-body p-3">
              <div class="h-4 bg-base-300 rounded w-3/4"></div>
              <div class="h-3 bg-base-300 rounded w-1/2 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <dialog id="share_modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Share Trip</h3>

      <div class="space-y-4">
        <div>
          <label class="label">
            <span class="label-text font-medium">Invite (Collaborator)</span>
          </label>
          <div class="join w-full">
            <input type="text" :value="getInviteLink(selectedTripId)" class="input input-bordered join-item w-full" readonly />
            <button class="btn join-item" @click="copyToClipboard(getInviteLink(selectedTripId))">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m7 16H5V5h2v2h10V5h2z" />
              </svg>
            </button>
            <button v-if="isShareSupported" class="btn join-item" @click="shareLink(getInviteLink(selectedTripId), 'Collaborate on this trip')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="label">
            <span class="label-text font-medium">View Only</span>
          </label>
          <div class="join w-full">
            <input type="text" :value="getViewOnlyLink(selectedTripId)" class="input input-bordered join-item w-full" readonly />
            <button class="btn join-item" @click="copyToClipboard(getViewOnlyLink(selectedTripId))">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m7 16H5V5h2v2h10V5h2z" />
              </svg>
            </button>
            <button v-if="isShareSupported" class="btn join-item" @click="shareLink(getViewOnlyLink(selectedTripId), 'View this trip')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>

  <dialog id="delete_modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Delete Trip</h3>
      <p>Are you sure you want to delete this trip? This action cannot be undone.</p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button class="btn btn-error" @click="deleteTrip">Delete</button>
          <button class="btn">Cancel</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { getAllTripsOfUser, deleteTrip as deleteAppwriteTrip, getAllUsersOfTrip, getUser } from "@/utils/appwrite/services";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { humanizeDate, formatDate } from "@/utils";

const auth = useAuthStore();
const router = useRouter();

const trips = ref([]);
const loading = ref(false);
const selectedTripId = ref(null);

const isShareSupported = ref(!!navigator.share);

const tripToDelete = ref(null);

const isFirstVisit = ref(true);

const tripUsers = ref({});

async function shareLink(url, title) {
  try {
    await navigator.share({
      title: "Wanderer's Diary Trip",
      text: title,
      url: url,
    });
  } catch (err) {
    console.error("Error sharing:", err);
  }
}

function navigateToTripCreate() {
  router.push({ path: "/trip/create" });
}

function navigateToTrip(id) {
  router.push({ path: "/trip", hash: "#" + id });
}

async function fetchTripUsers(tripId) {
  try {
    const users = await getAllUsersOfTrip(tripId);

    tripUsers.value[tripId] = users
      .map((user) => user.user_id)
      .filter(Boolean)
      .filter((user) => user.$id !== auth.user.id);
  } catch (error) {
    console.error("Error fetching trip users:", error);
    tripUsers.value[tripId] = [];
  }
}

function fetchTrips() {
  loading.value = true;

  getAllTripsOfUser(auth.user.id)
    .then(async (response) => {
      trips.value = response.documents.map((trip) => trip.trip_id).filter(Boolean);

      await Promise.all(trips.value.map((trip) => fetchTripUsers(trip.$id)));
    })
    .finally(() => {
      loading.value = false;
    });
}

function getInviteLink(tripId) {
  return `${window.location.origin}/trip/invite#${tripId}`;
}

function getViewOnlyLink(tripId) {
  return `${window.location.origin}/trip/view#${tripId}`;
}

function openShareDialog(tripId) {
  selectedTripId.value = tripId;
  document.getElementById("share_modal").showModal();
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

function openDeleteConfirmation(tripId) {
  tripToDelete.value = tripId;
  document.getElementById("delete_modal").showModal();
}

async function deleteTrip() {
  if (!tripToDelete.value) return;

  try {
    await deleteAppwriteTrip(tripToDelete.value);
    trips.value = trips.value.filter((trip) => trip.$id !== tripToDelete.value);
    tripToDelete.value = null;
  } catch (error) {
    console.error("Error deleting trip:", error);
  }
}

onMounted(() => {
  const hasVisited = localStorage.getItem("hasVisitedBefore");

  if (hasVisited) {
    isFirstVisit.value = false;
  } else {
    localStorage.setItem("hasVisitedBefore", "true");
  }

  fetchTrips();
});
</script>

<style></style>
