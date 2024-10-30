<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <router-link to="/" class="btn btn-ghost text-xl flex items-center">
        <img src="@/assets/travel.png" class="h-8 w-8 mb-1" alt="Logo" />
        <span>Wanderer'<span>s</span> <span class="text-orange-500">Diary</span></span>
      </router-link>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li class="font-bold">
          <a @click.prevent="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#000" d="M13 2v10h-2V2zm3.78 1.728l.809.589a9.5 9.5 0 1 1-11.178 0l.808-.59l1.178 1.617l-.808.59a7.5 7.5 0 1 0 8.822 0l-.808-.59z" />
            </svg>
            Logout
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { account } from "@/utils/appwrite";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

function logout() {
  account.deleteSession("current");

  useAuthStore().update(null);

  router.push({ path: "/login" });
}
</script>

<style></style>
