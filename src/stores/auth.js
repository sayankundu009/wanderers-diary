import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUser, getUser } from "@/utils/appwrite/services";

export const useAuthStore = defineStore('auth', () => {
    const user = ref({});

    function update(data) {
        user.value = data;
    }

    async function check() {
        const data = await getCurrentUser();

        if (data) {
            const dbUser = await getUser(data.$id);
            
            update({...data, id: dbUser.$id});
            
            return true
        }

        return false
    }

    return { user, update, check }
})