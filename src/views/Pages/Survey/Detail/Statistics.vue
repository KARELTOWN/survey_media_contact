<template>
    <QuestionWithOptionsStatistics />
    <QuestionNombreReponses />

</template>

<script setup>
import QuestionNombreReponses from '@/components/graphic/QuestionNombreReponses.vue';
import QuestionWithOptionsStatistics from '@/components/graphic/QuestionWithOptionsStatistics.vue';
import Badge from '@/components/ui/Badge.vue';
import { surveyStore } from '@/stores/survey/surveyStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const store = surveyStore()
const { getSurveyStatistics } = store
const { statistics } = storeToRefs(store)
const loading = ref(false)

onMounted(async () => {
    if (route.params.id) {
        loading.value = true
        await getSurveyStatistics(route.params.id)
        loading.value = false

    }
    else {
        errorNotify('Impossible de charger les réponses')
        return
    }
})
</script>