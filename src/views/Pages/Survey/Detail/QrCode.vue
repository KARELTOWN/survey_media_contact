<template>
    <qrcode-vue :value="link" :level="level" :size="size" />
</template>
<script setup lang="ts">

import { ref, watchEffect } from 'vue';
import { surveyStore } from '@/stores/survey/surveyStore';
import { storeToRefs } from 'pinia';
const store = surveyStore()
const { formSurvey } = storeToRefs(store)
const {surveyFormLink} = store

import QrcodeVue from 'qrcode.vue'
import type { Level, RenderAs, GradientType, ImageSettings } from 'qrcode.vue'

const level = ref < Level > ('M')
const size = ref(150)
const link = ref('')
watchEffect(()=> {
        link.value = surveyFormLink(formSurvey.value._id)
})
</script>
