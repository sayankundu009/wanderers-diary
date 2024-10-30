import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/app'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

const appState = useAppStore();

router.beforeEach((to, from, next) => {
    appState.setLoading(true);

    next();
})

router.afterEach(() => {
    setTimeout(() => {
        appState.setLoading(false); 
    }, 500);
})