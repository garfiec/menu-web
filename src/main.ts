import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Router
import router from '@/routes/routes'

// Pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

// Vuetify
import 'vuetify/styles';
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
app.use(router);
app.use(pinia)
app.use(createVuetify({
    components,
    directives
}))

app.mount('#app')
