<template>
    <header class="w-full bg-black text-white px-5" v-if="displayHeader">
        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 pb-3 gap-4">
            <div class="col-span-1 flex justify-center items-center" v-if="form.logo">
                <img :src="form.logo" alt="Media Contact" class="h-20 md:h-20 object-contain" />
            </div>
            <div class="col-span-1 flex justify-center items-center space-x-2" v-if="form.adress">
                <svg class="h-4 w-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z"
                        stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="12" cy="9" r="2.2" fill="currentColor" />
                </svg>
                <span class="truncate">{{ form.adress }}</span>
            </div>
            <!-- Horaires -->
            <div class="col-span-1 flex justify-center items-center space-x-2" v-if="form.open_hours">
                <svg class="h-4 w-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2" />
                </svg>
                <span>{{ form.open_hours }}</span>
            </div>

            <!-- Téléphone -->
            <div class="col-span-1 flex justify-center items-center space-x-2" v-if="form.phone">
                <svg class="h-4 w-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                        d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.09 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .76c.12.66.35 1.3.68 1.9a1 1 0 0 1-.24 1.09L8.33 7.91a16 16 0 0 0 6 6l1.16-1.2a1 1 0 0 1 1.09-.24c.6.33 1.24.56 1.9.68a1 1 0 0 1 .76 1V21z"
                        stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <a href="tel:+22995170016" class="hover:underline">{{ form.phone }}</a>
            </div>
        </div>

    </header>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { configStore } from '@/stores/config/config';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
const store = configStore()
const { config, configSuccess } = storeToRefs(store)
const { getSurveyConfig } = store

const displayHeader = computed(()=> (form.logo))

const form = reactive({
    adress: '',
    phone: '',
    logo: '',
    open_hours: ''
})

const route = useRoute()

onMounted(async () => {
    await getSurveyConfig(route.params.id).then(() => {
        if (configSuccess.value === true) {
            const header = config.value
            console.log('header', header)
            if (header) {
                form.phone = header.phone
                form.logo = header.logo
                form.adress = header.adress
                form.open_hours = header.open_hours
            }
        }
    })
})

</script>