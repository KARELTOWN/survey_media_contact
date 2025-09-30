<template>
    <div v-if="responsesToSurvey.length > 0 && loading === false" class="space-y-4">
        <div class="text-2xl text-bold">Réponses <Badge color="primary"> {{ responsesToSurvey.length }}</Badge>
        </div>
        <div v-for="responseBuUser in responsesToSurvey" :key="responseBuUser._id"
            class="border cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
            <div class="flex justify-end">
                <span class="text-green-600 font-medium">
                    {{ formatTimestampToDate(responseBuUser.answers[0].createdAt) }}
                </span>
            </div>

            <div v-for="(response, Rindex) in responseBuUser.answers" :key="Rindex" class="mb-2">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                        {{ response.question_label }}
                    </h3>
                </div>
                <p v-if="response.question_type_field == 'checkbox'" class="text-gray-600 dark:text-gray-300 mt-1">
                    {{ response.response.join(', ') }}
                </p>

                <div v-else-if="response.question_type_field == 'file'" class="text-gray-600 dark:text-gray-300 mt-1">
                    <div v-if="Array.isArray(response.response) && response.response.length > 0"
                        class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        <div v-for="(file, fIndex) in response.response" :key="fIndex" class="mt-4 relative">
                            <a :href="base64ToTempUrl(file)" v-if="fileType(file) == 'image'"><img :src="file"
                                    alt="Prévisualisation" class="w-48 h-48 object-cover rounded" /></a>
                            <a :href="base64ToTempUrl(file)" target="_blank" v-else-if="fileType(file) !== null"> <img
                                    alt="Prévisualisation" :src="defaultFileImg"
                                    class="w-48 h-48 object-cover rounded" /></a>
                        </div>
                    </div>
                </div>

                <p v-else-if="response.question_type_field == 'select'" class="text-gray-600 dark:text-gray-300 mt-1">
                    {{ response.response }}
                </p>

                <p v-else-if="response.question_type_field == 'date'" class="text-gray-600 dark:text-gray-300 mt-1">
                    {{ formatTO_DMY(response.response) }}
                </p>

                <p v-else-if="response.question_type_field == 'review'" class="text-gray-600 dark:text-gray-300 mt-1">
                    {{ response.response }} / 5
                </p>

                <p v-else class="text-gray-600 dark:text-gray-300 mt-1">
                    {{ response.response }}
                </p>
            </div>

        </div>
    </div>

    <div v-else-if="responsesToSurvey.length == 0 && loading === false"
        class="text-center text-gray-500 dark:text-gray-400 mt-10">
        Aucune réponse disponible pour le moment.
    </div>
    <div v-else-if="loading === true" class="text-center m-auto text-gray-500 dark:text-gray-400 mt-10 ms-10">
        <div class="loader-animation"></div>
    </div>
</template>

<script setup>
import Badge from '@/components/ui/Badge.vue';
import { surveyStore } from '@/stores/survey/surveyStore';
import { base64ToTempUrl, getFileType } from '@/utils/file';
import { formatTimestampToDate, formatTO_DMY } from '@/utils/format';
import { defaultFileImg } from '@/utils/survey';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const store = surveyStore()
const { getSurveyResponses } = store
const { responsesToSurvey } = storeToRefs(store)
const loading = ref(false)

onMounted(async () => {
    if (route.params.id) {
        loading.value = true
        await getSurveyResponses(route.params.id)
        loading.value = false

    }
    else {
        errorNotify('Impossible de charger les réponses')
        return
    }
})

const fileType = (file) => {
    return getFileType(file)
}
</script>