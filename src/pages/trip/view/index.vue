<template>
  <div class="min-h-screen bg-base-200 pb-10">
    <div v-if="loading" class="container mx-auto px-4 md:px-10 pt-3">
      <div class="w-full h-40 sm:h-60 md:h-72 bg-base-300 animate-pulse mb-3"></div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="h-8 bg-base-300 w-1/4 mb-4 animate-pulse"></div>
              <div class="space-y-6">
                <div v-for="i in 3" :key="i" class="space-y-2">
                  <div class="h-6 bg-base-300 w-3/4 animate-pulse"></div>
                  <div class="h-4 bg-base-300 w-1/2 animate-pulse"></div>
                  <div class="h-4 bg-base-300 w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="h-8 bg-base-300 w-1/3 mb-4 animate-pulse"></div>
              <div class="space-y-4">
                <div v-for="i in 2" :key="i" class="space-y-2">
                  <div class="h-6 bg-base-300 w-2/3 animate-pulse"></div>
                  <div class="h-4 bg-base-300 w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="trip" class="container mx-auto px-4 md:px-10 pt-3">
      <div class="relative w-full">
        <div class="relative w-full h-40 sm:h-60 md:h-72 overflow-hidden bg-black-100 card">
          <img v-if="trip.image" :src="trip.image" alt="Trip cover" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <img src="https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg" alt="placeholder" class="w-full h-full object-cover opacity-80" />
          </div>
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>

          <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/60 to-transparent">
            <div class="container mx-auto px-4 sm:px-6 md:px-10">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end">
                <div>
                  <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{{ trip.name }}</h1>
                  <p class="text-white/90 text-sm sm:text-base">{{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title mb-4">Itinerary</h2>

              <div class="space-y-6">
                <div v-if="itineraries.length === 0" class="text-center py-8">
                  <p class="text-gray-500">No itinerary has been created yet.</p>
                </div>
                <div v-else>
                  <div v-for="(day, index) in itineraries" :key="day.$id" class="relative">
                    <div class="flex items-center mb-3">
                      <div class="badge bg-orange-500 text-white text-xs sm:text-sm">Day {{ index + 1 }}</div>
                      <h3 class="ml-3 font-semibold text-sm sm:text-base">
                        {{ formatDate(day.date) }}
                      </h3>
                    </div>

                    <div class="pl-4 border-l-2 border-base-300">
                      <div v-for="activity in day.activities" :key="activity.$id" class="mb-4">
                        <p class="font-medium text-sm sm:text-base">{{ activity.name }}</p>
                        <RichDescription :text="activity.description" class="text-xs sm:text-sm mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title text-lg sm:text-xl mb-4">Notes</h2>

              <div v-if="notes.length === 0" class="text-center py-4">
                <p class="text-gray-500">No notes have been added yet.</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="note in notes" :key="note.$id" class="card bg-base-200">
                  <div class="card-body p-4">
                    <h3 class="font-medium text-sm sm:text-base">{{ note.name }}</h3>
                    <RichDescription :text="note.description" class="text-xs sm:text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { formatDate } from "@/utils";
import { getTrip, getAllItineraryAndActivities, getAllTripNotesByTripId } from "@/utils/appwrite/services";
import RichDescription from "@/components/RichDescription/index.vue";

const route = useRoute();
const loading = ref(true);
const trip = ref(null);
const itineraries = ref([]);
const notes = ref([]);

async function fetchTripData() {
  loading.value = true;
  try {
    const tripId = route.hash.slice(1);
    const tripData = await getTrip(tripId);
    trip.value = tripData;

    document.title = `${tripData.name} - Wanderer's Diary`;

    const itineraryData = await getAllItineraryAndActivities(tripId);
    itineraries.value = itineraryData;

    const notesData = await getAllTripNotesByTripId(tripId);
    notes.value = notesData;
  } catch (error) {
    console.error("Error fetching trip data:", error);
    document.title = "Wanderer's Diary";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchTripData();
});
</script>
