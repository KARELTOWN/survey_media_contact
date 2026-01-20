<template>
    <section class="max-w-5xl mx-auto px-4 py-6">
        <h2 class="text-2xl font-bold mb-4">📋 Liste des enquêtes</h2>

        <div v-if="surveysList.length" class="space-y-4">
            <div v-for="survey in surveysList" :key="survey._id" @click="seeDetail(survey._id)"
                class="border cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                        {{ survey.title }}
                    </h3>
                    <div class="flex flex-col">
                        <span :class="survey.publish ? 'text-green-600' : 'text-yellow-500'"
                            class="text-sm font-medium">
                            {{ survey.publish ? 'Publié' : 'Brouillon' }}
                        </span>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            <span>Réponses : </span>
                            <span class="font-semibold">{{ survey.count_responses || 0 }}</span>
                        </div>
                    </div>

                </div>

                <p v-if="survey.description" class="text-gray-600 dark:text-gray-300 mt-1">
                    {{ survey.description }}
                </p>

                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>🕒 Créé le {{ formatTimestampToDate(survey.createdAt) }}</p>
                    <!-- <p>🔄 Modifié le {{ formatTimestampToDate(survey.updatedAt) }}</p> -->
                    <p v-if="survey.category_id">
                        🗂️ Catégorie : <strong>{{ survey.category_id.libelle }}</strong>
                    </p>
                    <p v-if="survey.topic_id">
                        <span>— Thématique : {{ survey.topic_id.libelle }}</span>
                    </p>
                </div>
            </div>
        </div>

        <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
            Aucune enquête disponible pour le moment.
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { surveyStore } from "@/stores/survey/surveyStore";
import { formatTimestampToDate } from '@/utils/format';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
const store = surveyStore()
const { getSurveys } = store
const { surveysList } = storeToRefs(store)

onMounted(async () => {
    await getSurveys()
})

const router = useRouter()

const seeDetail = (survey_id) => {
    router.push({ name: 'Survey-Detail', params: { id: survey_id } })
}
</script>
