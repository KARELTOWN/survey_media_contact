<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard title="Nouvelle enquête">
                <div class="p-6" v-if="surveySuccess === false">
                    <!-- Navigation -->
                    <div class="flex justify-between mb-4">
                        <button @click="prevPage" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            :disabled="currentPage === 0">
                            Précédent
                        </button>
                        <h1 class="text-4xl md:text-4xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg">
                            <div class="flex items-center gap-3">
                                {{ pageTitle[currentPage] }}
                                <svg @click="saveForm" viewBox="0 0 24 24" v-if="currentPage === 2"
                                    title="Enregistrer en local" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    stroke="#2B7FFF">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                                            fill="#2B7FFF"></path>
                                    </g>
                                </svg>
                            </div>
                        </h1>
                        <button v-if="currentPage < pages - 1" @click="nextPage"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" :disabled="disabledNext">
                            Suivant
                        </button>
                        <button v-if="currentPage === pages - 1" @click="save"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Enregistrer
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

                    <div v-if="currentPage === 3">
                        <PreviewPanel :preview="true"/>
                    </div>
                </div>
                <div class="p-6" v-else>
                    <SuccessComponent title="Formulaire d'enquête créé avec succès"
                        message="Si dessous partagez le lien du formulaire sur vos réseaux sociaux préférés"
                        :link="link" path="/enquetes" />
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
import SuccessComponent from '@/components/ui/SuccessComponent.vue'
import { getIndexDBStorage, getLocalStorage, setLocalStorage } from "@/utils/storage";
import { errorNotify, successNotify } from "@/utils/notification";
import validator from 'validator'
const store = surveyStore()
const { selectCategory, selectTopic, formSurvey, surveySuccess, surveyID } = storeToRefs(store)
const { saveFormInstance } = store
// Etat de la page courante
const currentPage = ref(0);
const pages = ref(4)
import PreviewPanel from "@/components/survey/preview/PreviewPanel.vue";
import { useRoute, useRouter } from "vue-router";

const pageTitle = [
    "Thématique",
    "Catégorie",
    "Questions",
    "Prévisualisation",
]

const route = useRoute()
const router = useRouter()

const getSurveyDataStore = async () => {
    const storeData = await getIndexDBStorage(`survey_form_${formSurvey.value.form_id}`)
    return storeData
}
onMounted(async () => {
    surveySuccess.value = false
    if (validator.isUUID(route.params.id)) {
        formSurvey.value.form_id = route.params.id
        let storeData = await getSurveyDataStore()
        if (storeData) {
            formSurvey.value = { ...storeData }
        }
    }
    else {
        errorNotify("Impossible de créer l'enquête. Paramètre invalide")
        setTimeout(() => {
            router.push({ path: '/enquetes' })
        }, 1000)
        return
    }
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

const questionHaveNotTitle = computed(() => {
    let result = formSurvey.value.questions.findIndex((question) => (question.category !== 'image' && !question.title))
    return result
})

const disabledNext = computed(() => {
    return (currentPage.value === pages.value - 1 || (currentPage.value === 0 && !selectTopic.value) || (currentPage.value === 1 && !selectCategory.value) || (currentPage.value === 2 && (!formSurvey.value.title)) || (currentPage.value === 2 && questionHaveNotTitle.value !== -1) || (formSurvey.value.questions.length == 0))
})

const saveForm = async () => {
    saveFormInstance().then(() => {
        successNotify('Sauvegardé en local')
    }).catch((error) => {
        console.error('Erreur lors de la sauvegarde :', error);
    })
}

const link = ref('')
const save = async () => {
    await store.createSurvey()
    if (surveySuccess.value === true) {
        link.value = `${import.meta.env.VITE_FRONT_URL}/forms/${surveyID.value}`
    }
}

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
