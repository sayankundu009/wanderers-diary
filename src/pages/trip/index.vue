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
        <div class="relative w-full h-40 sm:h-60 md:h-72 overflow-hidden bg-black-100 card group">
          <img v-if="trip.image" :src="trip.image" alt="Trip cover" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <img src="https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg" alt="placeholder" class="w-full h-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>

          <button class="btn btn-sm btn-ghost text-white absolute top-2 right-2 z-10" @click="() => toggleCoverEdit()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="mr-1"><path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" /></svg>
          </button>

          <div v-if="editingCover" class="absolute inset-0 flex items-center justify-center">
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
            <div class="text-center space-y-2 sm:space-y-4">
              <button class="btn btn-neutral" @click="triggerFileInput">
                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                  <line x1="16" y1="5" x2="22" y2="5" />
                  <line x1="19" y1="2" x2="19" y2="8" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                Upload Cover Image
              </button>
              <p class="text-white text-xs sm:text-sm">Recommended size: 1200x400 pixels</p>
            </div>
          </div>

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
              <div class="flex justify-between items-center mb-4">
                <h2 class="card-title">Itinerary</h2>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-circle btn-ghost" @click="addNewDay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="space-y-6">
                <div v-if="itineraries.length === 0 && !loadingNewDay" class="text-center py-8">
                  <p class="text-gray-500">Click the + button to add a day.</p>
                </div>
                <transition-group name="list" v-else>
                  <div v-for="(day, index) in itineraries" :key="day.$id" class="relative">
                    <div class="flex items-center justify-between mb-3 cursor-pointer" @click="toggleDay(day.$id)">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :class="{ 'rotate-180': expandedDays[day.$id] }" class="transition-transform duration-300 mr-2">
                          <path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" />
                        </svg>
                        <div class="badge bg-orange-500 text-white text-xs sm:text-sm">Day {{ index + 1 }}</div>
                        <h3 class="ml-3 font-semibold text-sm sm:text-base">
                          {{ formatDate(day.date) }}
                        </h3>
                      </div>
                      <div class="flex items-center gap-2">
                        <button class="btn btn-sm btn-error btn-outline sm:inline-flex hidden text-xs sm:text-sm" @click.stop="removeDay(day.$id)">Remove Day</button>
                        <button class="btn btn-sm btn-circle btn-error btn-outline sm:hidden" @click.stop="removeDay(day.$id)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="pl-4 border-l-2 border-base-300" :class="{ hidden: !expandedDays[day.$id] }">
                      <transition-group name="list">
                        <div v-for="activity in day.activities" :key="activity.$id" class="mb-4 relative">
                          <div class="flex justify-between items-start">
                            <div class="flex-1">
                              <div v-if="activity.editing">
                                <input v-model="activity.name" type="text" class="input input-bordered w-full mb-2 text-sm sm:text-base" placeholder="Activity title" />
                                <textarea v-model="activity.description" class="textarea textarea-bordered w-full text-sm sm:text-base" placeholder="Activity description"></textarea>
                                <button class="btn btn-sm btn-primary mt-2 text-xs sm:text-sm" @click="saveActivity(activity)">Save</button>
                              </div>
                              <div v-else>
                                <p class="font-medium text-sm sm:text-base">{{ activity.name }}</p>
                                <RichDescription :text="activity.description" class="text-xs sm:text-sm mt-1" />
                              </div>
                            </div>
                            <div class="flex gap-2">
                              <button class="btn btn-sm btn-circle btn-ghost" v-if="!activity.editing" @click="toggleActivityEdit(activity)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" /></svg>
                              </button>
                              <button class="btn btn-sm btn-circle btn-ghost" @click="removeActivity(day.$id, activity.$id)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="M19 13H5v-2h14z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </transition-group>

                      <div v-if="loadingNewActivity && loadingNewActivity.itineraryId === day.$id" class="mt-4 animate-pulse">
                        <div class="h-4 bg-base-300 w-1/3 mb-2"></div>
                        <div class="h-3 bg-base-300 w-2/3"></div>
                      </div>

                      <button class="btn btn-sm btn-ghost mt-2 text-xs sm:text-sm" @click="addActivity(day.$id)">+ Add Activity</button>
                    </div>
                  </div>
                </transition-group>
              </div>

              <div v-if="loadingNewDay" class="mt-6 animate-pulse">
                <div class="h-6 bg-base-300 w-1/4 mb-3"></div>
                <div class="h-4 bg-base-300 w-3/4 mb-2"></div>
                <div class="h-4 bg-base-300 w-1/2"></div>
              </div>

              <dialog ref="removeDialog" class="modal">
                <div class="modal-box">
                  <h3 class="font-bold text-lg">Remove Day {{ selectedDayIndex + 1 }}?</h3>
                  <p class="py-4">Are you sure you want to remove this day? This will delete all activities scheduled for this day. This action cannot be undone.</p>
                  <div class="modal-action">
                    <button class="btn btn-error" @click="confirmRemoveDay">Remove</button>
                    <button class="btn" @click="cancelRemoveDay">Cancel</button>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="flex justify-between items-center mb-4">
                <h2 class="card-title text-lg sm:text-xl">Notes</h2>
                <button class="btn btn-sm btn-circle btn-ghost" @click="addNote">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
                  </svg>
                </button>
              </div>

              <div v-if="notes.length === 0 && !loadingNewNote" class="text-center py-4">
                <p class="text-gray-500">Click the + button to add a note.</p>
              </div>

              <div v-else class="space-y-4">
                <transition-group name="list">
                  <div v-for="note in notes" :key="note.$id" class="relative card bg-base-200">
                    <div class="card-body p-4">
                      <div v-if="note.editing">
                        <input v-model="note.name" type="text" class="input input-bordered w-full mb-2 text-sm sm:text-base" placeholder="Note title" />
                        <textarea v-model="note.description" class="textarea textarea-bordered w-full text-sm sm:text-base" placeholder="Note content"></textarea>
                        <div class="flex justify-end mt-2">
                          <button class="btn btn-sm btn-neutral text-xs sm:text-sm" @click="saveNote(note)">Save</button>
                        </div>
                      </div>
                      <div v-else>
                        <h3 class="font-medium text-sm sm:text-base">{{ note.name }}</h3>
                        <RichDescription :text="note.description" class="text-xs sm:text-sm" />
                        <div class="flex justify-end mt-2">
                          <button class="btn btn-sm btn-ghost text-xs sm:text-sm" @click="editNote(note)">Edit</button>
                          <button class="btn btn-sm btn-ghost ml-2 text-xs sm:text-sm" @click="removeNote(note.$id)">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </div>

              <div v-if="loadingNewNote" class="mt-4 animate-pulse">
                <div class="h-6 bg-base-300 w-1/2 mb-2"></div>
                <div class="h-4 bg-base-300 w-full mb-1"></div>
                <div class="h-4 bg-base-300 w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageBrowser ref="imageBrowserRef" :initial-selected="trip.image" @select="handleImageSelection" @close="editingCover = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate } from "@/utils";
import { getTrip, updateTrip, getAllItineraryAndActivities, createItinerary, deleteItinerary, createItineraryActivity, updateItineraryActivity, deleteItineraryActivity, getAllTripNotesByTripId, createTripNote, updateTripNote, deleteTripNote } from "@/utils/appwrite/services";
import ImageBrowser from "@/components/ImageBrowser/index.vue";
import RichDescription from "@/components/RichDescription/index.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const trip = ref(null);
const itineraries = ref([]);
const notes = ref([]);
const removeDialog = ref(null);
const selectedDayIndex = ref(-1);
const editingCover = ref(false);
const fileInput = ref(null);
const loadingNewDay = ref(false);
const loadingNewActivity = ref(false);
const loadingNewNote = ref(false);
const imageBrowserRef = ref(null);
const expandedDays = ref({});
const selectedDayToRemove = ref(null);

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

    // Initialize using itinerary IDs instead of indices
    itineraryData.forEach((itinerary) => {
      expandedDays.value[itinerary.$id] = true;
    });
  } catch (error) {
    console.error("Error fetching trip data:", error);
    document.title = "Wanderer's Diary";
  } finally {
    loading.value = false;
  }
}

async function addNewDay() {
  loadingNewDay.value = true;
  try {
    const newDate = new Date(trip.value.start_date);
    newDate.setDate(newDate.getDate() + itineraries.value.length);
    const newItinerary = await createItinerary({
      tripId: trip.value.$id,
      date: newDate.toISOString(),
    });
    itineraries.value.push({ ...newItinerary, activities: [] });
    expandedDays.value[newItinerary.$id] = true;
  } catch (error) {
    console.error("Error adding new day:", error);
  } finally {
    loadingNewDay.value = false;
  }
}

function removeDay(itineraryId) {
  const index = itineraries.value.findIndex((day) => day.$id === itineraryId);
  selectedDayIndex.value = index;
  selectedDayToRemove.value = itineraryId;
  removeDialog.value.showModal();
}

async function confirmRemoveDay() {
  if (selectedDayToRemove.value) {
    const index = itineraries.value.findIndex((day) => day.$id === selectedDayToRemove.value);
    if (index !== -1) {
      const removedDay = itineraries.value.splice(index, 1)[0];
      try {
        removeDialog.value.close();

        await deleteItinerary(selectedDayToRemove.value);
      } catch (error) {
        console.error("Error removing day:", error);
        itineraries.value.splice(index, 0, removedDay);
      }
    }
  }

  removeDialog.value.close();
}

function cancelRemoveDay() {
  selectedDayToRemove.value = null;
  selectedDayIndex.value = -1;
  removeDialog.value.close();
}

async function addActivity(itineraryId) {
  loadingNewActivity.value = { itineraryId: itineraryId, loading: true };
  try {
    const newActivity = await createItineraryActivity({
      itineraryId,
      name: "New Activity",
      description: "Description",
    });
    const dayIndex = itineraries.value.findIndex((day) => day.$id === itineraryId);
    if (dayIndex !== -1) {
      itineraries.value[dayIndex].activities.push(newActivity);
    }
  } catch (error) {
    console.error("Error adding activity:", error);
  } finally {
    loadingNewActivity.value = null;
  }
}

async function removeActivity(itineraryId, activityId) {
  const dayIndex = itineraries.value.findIndex((day) => day.$id === itineraryId);
  if (dayIndex !== -1) {
    const activityIndex = itineraries.value[dayIndex].activities.findIndex((activity) => activity.$id === activityId);
    if (activityIndex !== -1) {
      const removedActivity = itineraries.value[dayIndex].activities.splice(activityIndex, 1)[0];
      try {
        await deleteItineraryActivity(activityId);
      } catch (error) {
        console.error("Error removing activity:", error);
        itineraries.value[dayIndex].activities.splice(activityIndex, 0, removedActivity);
      }
    }
  }
}

function toggleActivityEdit(activity) {
  activity.editing = !activity.editing;
}

async function saveActivity(activity) {
  try {
    const updatedActivity = await updateItineraryActivity(activity.$id, {
      name: activity.name,
      description: activity.description,
    });
    Object.assign(activity, updatedActivity);
    activity.editing = false;
  } catch (error) {
    console.error("Error saving activity:", error);
  }
}

async function addNote() {
  loadingNewNote.value = true;
  try {
    const newNote = await createTripNote({
      tripId: trip.value.$id,
      name: "New Note",
      description: "Add your note here...",
    });
    notes.value.push({ ...newNote, editing: true });
  } catch (error) {
    console.error("Error adding note:", error);
  } finally {
    loadingNewNote.value = false;
  }
}

async function removeNote(noteId) {
  const index = notes.value.findIndex((note) => note.$id === noteId);

  if (index !== -1) {
    const removedNote = notes.value.splice(index, 1)[0];

    try {
      await deleteTripNote(noteId);
    } catch (error) {
      console.error("Error removing note:", error);

      notes.value.splice(index, 0, removedNote);
    }
  }
}

function editNote(note) {
  note.editing = true;
}

async function saveNote(note) {
  try {
    const updatedNote = await updateTripNote(note.$id, {
      name: note.name,
      description: note.description,
    });
    Object.assign(note, updatedNote);
    note.editing = false;
  } catch (error) {
    console.error("Error saving note:", error);
  }
}

function toggleCoverEdit() {
  editingCover.value = !editingCover.value;
  if (editingCover.value) {
    imageBrowserRef.value?.showDialog();
  }
}

function triggerFileInput() {
  fileInput.value.click();
}

async function handleImageSelection(data) {
  try {
    await updateTrip(trip.value.$id, { image: data.url });

    trip.value.image = data.url;

    editingCover.value = false;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

function toggleDay(itineraryId) {
  expandedDays.value[itineraryId] = !expandedDays.value[itineraryId];
}

onMounted(() => {
  fetchTripData();
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
