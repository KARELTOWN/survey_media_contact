<template>
    <section class="max-w-5xl mx-auto px-4 py-6">
        <h2 class="text-2xl font-bold mb-4">📋 Liste des brouillons</h2>

        <div v-if="surveysDraft.length" class="space-y-4">
            <div v-for="survey in surveysDraft" :key="survey.key" @click="seeDetail(survey)"
                class="border cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                        {{ survey.value.title || "Sans titre" }}
                    </h3>
                </div>

                <p v-if="survey.value.description" class="text-gray-600 dark:text-gray-300 mt-1">
                    {{ survey.value.description }}
                </p>

                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>🕒 Créé le {{ formatTimestampToDate(survey.value.createdAt) }}</p>
                    <p>🕒 Dernière modification le {{ formatTimestampToDate(survey.value.lastEdit) }}</p>
                    <p v-if="survey.value.category">
                        🗂️ Catégorie : <strong>{{ survey.value.category.libelle }}</strong>
                    </p>
                    <p v-if="survey.value.topic">
                        <span>— Thématique : {{ survey.value.topic.libelle }}</span>
                    </p>
                </div>
            </div>
        </div>

        <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
            Aucune brouillon disponible.
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { formatTimestampToDate } from '@/utils/format';
import { useRouter } from 'vue-router';
import { getAllDataInDBStorage } from '@/utils/storage';
import { get_account_id } from '@/composables/request';

const surveysDraft = ref([])

onMounted(async () => {
    const allData = await getAllDataInDBStorage(get_account_id())
    surveysDraft.value = allData
})

const router = useRouter()

const seeDetail = (survey) => {
    if (survey.value.publish === true && survey.value._id) {
        router.push({ name: 'Update-Survey', params: { survey_id: survey.value._id } })
        return
    }
    else {
        router.push({ name: 'Create-Survey', params: { id: survey.value.form_id } })
    }
}
</script>
