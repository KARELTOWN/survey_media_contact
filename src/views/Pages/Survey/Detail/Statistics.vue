<template>
    <FilterDateStatistics @filter="getData" />
    <QuestionWithOptionsStatistics />
    <QuestionNombreReponses />
</template>

<script setup>
import QuestionNombreReponses from '@/components/graphic/QuestionNombreReponses.vue';
import QuestionWithOptionsStatistics from '@/components/graphic/QuestionWithOptionsStatistics.vue';
import { surveyStore } from '@/stores/survey/surveyStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import FilterDateStatistics from '@/components/survey/detail/FilterDateStatistics.vue';
const route = useRoute()
const store = surveyStore()
const { getSurveyStatistics } = store
const loading = ref(false)

const getData = async () => {
    loading.value = true
    await getSurveyStatistics(route.params.id)
    loading.value = false
}
onMounted(async () => {
    if (route.params.id) {
        await getData()
    }
    else {
        errorNotify('Impossible de charger les réponses')
        return
    }
})
</script>