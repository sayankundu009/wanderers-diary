import { useAuthStore } from '@/stores/auth'

export async function auth(_to, _from, next) {
    const state = useAuthStore();

    const data = await state.check();
    
    if (data) {
        return next()
    } else {
        return next('/login')
    }
}