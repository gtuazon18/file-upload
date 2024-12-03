import primeVue from 'primevue/config'
import Aura from '@primevue/themes/aura';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(primeVue, {
    theme: {
        preset: Aura
    }
});
app.mount('#app')
