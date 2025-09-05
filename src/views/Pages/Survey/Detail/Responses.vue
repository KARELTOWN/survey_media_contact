<template>
    <!-- <div v-if="responsesToSurvey.length" class="space-y-4">
        <div v-for="response in responsesToSurvey" :key="response._id"
            class="border cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ response.question }}
                </h3>
                <span class="text-green-600 text-sm font-medium">
                    {{ formatTimestampToDate(survey.createdAt) }}
                </span>
            </div>

            <p v-if="response.response" class="text-gray-600 dark:text-gray-300 mt-1">
                {{ response.response }}
            </p>
        </div>
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
        Aucune réponse disponible pour le moment.
    </div> -->
    <pre>{{ responsesToSurvey }}</pre>
</template>

<script setup>
import { surveyStore } from '@/stores/survey/surveyStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const store = surveyStore()
const { getSurveyResponses } = store
const { responsesToSurvey } = storeToRefs(store)
onMounted(async () => {
    if (route.params.id) {
        await getSurveyResponses(route.params.id)
    }
    else {
        errorNotify('Impossible de charger les réponses')
        return
    }
})
</script>