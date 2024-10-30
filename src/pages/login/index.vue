<template>
  <div class="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8 !pt-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto w-20" src="@/assets/travel.png" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {{ isRegistering ? "Create an account" : "Sign in to your account" }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST" @submit.prevent="isRegistering ? register() : login(email, password)">
        <div v-if="isRegistering">
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
          <div class="mt-2">
            <input id="name" name="name" type="text" required v-model="name" class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" :class="{ 'ring-red-500': errors.name }" />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" required v-model="email" class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" :class="{ 'ring-red-500': errors.email }" />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="text-sm" v-if="!isRegistering">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password" class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" :class="{ 'ring-red-500': errors.password }" />
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center btn btn-neutral" :disabled="isLoading">
            <span v-if="isLoading" class="loading loading-spinner"></span>
            {{ isRegistering ? "Register" : "Sign in" }}
          </button>
        </div>
      </form>
      <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
        {{ errorMessage }}
      </div>
      <div class="mt-4 text-center">
        <a href="#" @click.prevent="toggleRegistration" class="text-indigo-600 hover:text-indigo-500 font-semibold">
          {{ isRegistering ? "Already have an account? Sign in" : "Need an account? Register" }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { account, ID } from "@/utils/appwrite";
import { getCurrentUser, createTripUser, createUser } from "@/utils/appwrite/services";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const name = ref("");
const isRegistering = ref(false);
const errorMessage = ref("");
const errors = ref({
  name: "",
  email: "",
  password: "",
});
const isLoading = ref(false);

onMounted(async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      router.push({ path: "/" });
    }
  } catch (error) {
    console.error("Error checking authentication status:", error);
  }
});

const handlePendingInvite = async (userId) => {
  const pendingInviteTripId = localStorage.getItem("pendingInviteTripId");

  if (pendingInviteTripId) {
    localStorage.removeItem("pendingInviteTripId");
    router.push({ path: `/trip/invite`, hash: `#${pendingInviteTripId}` });
  } else {
    router.push({ path: "/" });
  }
};

const validateForm = () => {
  errors.value = {
    name: "",
    email: "",
    password: "",
  };

  let isValid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errors.value.email = "Please enter a valid email address";
    isValid = false;
  }

  if (password.value.length < 6) {
    errors.value.password = "Password must be at least 6 characters long";
    isValid = false;
  }

  if (isRegistering.value && name.value.trim().length < 2) {
    errors.value.name = "Name must be at least 2 characters long";
    isValid = false;
  }

  return isValid;
};

const login = async (email, password) => {
  if (!validateForm()) return;
  isLoading.value = true;
  try {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    useAuthStore().update(user);
    await handlePendingInvite(user.$id);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const register = async () => {
  if (!validateForm()) return;
  isLoading.value = true;
  try {
    const response = await account.create(ID.unique(), email.value, password.value, name.value);
    await createUser({ name: name.value, email: email.value, accountId: response.$id });
    await login(email.value, password.value);
  } catch (error) {
    errorMessage.value = error.message;
    isLoading.value = false;
  }
};

const toggleRegistration = () => {
  isRegistering.value = !isRegistering.value;
  errorMessage.value = "";
};
</script>
