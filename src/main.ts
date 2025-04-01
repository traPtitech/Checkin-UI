import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { initMock } from '@/lib/msw/msw'

import App from './App.vue'
import router from './router'

initMock()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
