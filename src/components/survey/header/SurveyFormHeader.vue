<template>
    <header class="w-full text-white px-5 py-2 shadow" :style="{
        backgroundColor: themeProperties?.header_bg_color,
        color: themeProperties?.header_text_color
    }" v-if="displayHeader">
        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 pb-3 gap-4">
            <div class="col-span-1 flex justify-center items-center" v-if="displayLogo">
                <img :src="displayLogo" alt="Logo" class="h-[50px] md:h-[60px] object-contain" />
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { configStore } from '@/stores/config/config.js';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
const store = configStore()
const { config, configSuccess, themeProperties } = storeToRefs(store)
const { getSurveyConfig, getConfig } = store

const displayLogo = computed(() => themeProperties.value?.logo_url || form.logo)
const displayHeader = computed(() => Boolean(displayLogo.value))

const props = defineProps({
    previewMode: {
        type: Boolean,
        required: true
    }
})


const form = reactive({
    logo: '',
})

const route = useRoute()



watchEffect(async () => {
    if (props.previewMode !== undefined) {

        if (props.previewMode === false) {

            await getSurveyConfig(route.params.id).then(() => {
                if (configSuccess.value === true) {
                    const header = config.value
                    if (header) {
                        form.logo = header.logo
                    }
                }
            })
        }
        else if (props.previewMode === true) {

            await getConfig().then(() => {
                if (configSuccess.value === true) {
                    const header = config.value
                    if (header) {
                        form.logo = header.logo
                    }
                }
            })
        }

    }
})

</script>
