import './assets/main.css'
import 'vue-select/dist/vue-select.css';

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import 'rrweb-player/dist/style.css'
import { createPinia } from 'pinia'

import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import vSelect from 'vue-select'

import flatPickr from 'vue-flatpickr-component'

import indexDBTransaction from "@/utils/IndexDB.js";
const { initDB } = indexDBTransaction();


initDB(['survey_mc_forms']).then(() => {
  console.log("IndexedDB ready ✅");
}).catch(err => {
  console.error("IndexedDB init failed ❌", err);
});

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.component('apexchart', VueApexCharts)
app.component('flat-pickr', flatPickr)
app.component('v-select', vSelect)
app.component('VueDatePicker', VueDatePicker)
app.mount('#app')