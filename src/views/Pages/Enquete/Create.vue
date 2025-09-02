<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard title="Nouvelle enquête">
                <div class="p-6">
                    <!-- Navigation -->
                    <div class="flex justify-between mb-4">
                        <button @click="prevPage" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            :disabled="currentPage === 0">
                            Précédent
                        </button>
                        <h1 class="text-4xl md:text-4xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg">
                            {{ pageTitle[currentPage] }}
                        </h1>
                        <button @click="nextPage" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            :disabled="disabledNext">
                            Suivant
                        </button>
                    </div>

                    <!-- Pages -->
                    <div v-if="currentPage === 0">
                        <TopicList @select="getTopicSelect" />
                    </div>

                    <div v-if="currentPage === 1">
                        <CategoryList @select="getCategorySelect" />
                    </div>

                    <div v-if="currentPage === 2">
                        <SurveyForm />
                    </div>
                </div>
            </ComponentCard>
        </div>
    </AdminLayout>
</template>


<script setup>
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import TopicList from "@/components/topics/TopicList.vue";
import CategoryList from "@/components/topics/CategoryList.vue";
import { computed, onMounted, ref } from "vue";
const currentPageTitle = ref("Nouvelle enquête")
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
import SurveyForm from "@/components/survey/SurveyForm.vue";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";
const store = surveyStore()
const { selectCategory, selectTopic } = storeToRefs(store)

// Etat de la page courante
const currentPage = ref(0);
const pages = ref(3)

const pageTitle = [
    "Thématique",
    "Catégorie",
    "Questions"
]

onMounted(() => {
    const topicExist = getLocalStorage('selectTopic')
    if (topicExist) {
        selectTopic.value = { ...topicExist }
    }
})

const getTopicSelect = (select) => {
    selectTopic.value = { ...select }
    setLocalStorage('selectTopic', selectTopic.value)
}



const getCategorySelect = (select) => {
    selectCategory.value = select
    setLocalStorage('selectCategory', selectCategory.value)
}

const nextPage = () => {
    if (currentPage.value < pages.value - 1) currentPage.value++;
};
const prevPage = () => {
    if (currentPage.value > 0) currentPage.value--;
};

const disabledNext = computed(() => {
    return (currentPage.value === pages.value - 1 || (currentPage.value === 0 && !selectTopic.value) || (currentPage.value === 1 && !selectCategory.value))
})
</script>

<style>
/* Optionnel : fond général */
body {
    background-color: #f3f4f6;
    /* gris clair */
}

button:disabled {
    background-color: #9ca3af !important;
    cursor: not-allowed;
}
</style>
