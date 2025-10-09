<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <div v-if="surveySuccess === false">

                    <div class="flex justify-end mb-4 space-x-2">
                        <Button variant="outline" @click="openSurveySetting = true" v-if="currentPage > 0" size="sm"
                            title="Paramétrer">
                            <SettingsIcon /> Paramètres
                        </Button>
                        <Button variant="outline" @click="saveForm" v-if="currentPage > 0" size="sm"
                            title="Sauvegarder en brouillon">
                            <DraftIcon /> Sauvegarder en brouillon
                        </Button>
                    </div>


                    <div
                        class="flex flex-rows md:flex-row md:items-center justify-between gap-4 mb-4 survey-display-next-prev-btn">
                        <button @click="prevPage" class="px-4 py-2 shadow border text-dark rounded"
                            :disabled="currentPage === 0">
                            Précédent
                        </button>
                        <button v-if="currentPage < pages - 1" @click="nextPage"
                            class="px-4 py-2 border text-dark shadow rounded" :disabled="disabledNext">
                            Suivant
                        </button>
                        <button v-if="currentPage === pages - 1" @click="save"
                            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" :disabled="disabledBtn">
                            Enregistrer
                        </button>
                    </div>

                    <h2 class="text-lg font-bold text-center mb-5">
                        <div v-if="currentPage == 0">Sélectionnez la thématique d'enquête</div>
                        <div v-if="currentPage == 1">Sélectionnez la catégorie d'enquête</div>
                        <div v-if="currentPage == 2">Contruisez votre enquête</div>
                        <div v-if="currentPage == 3">Prévisualisation</div>

                    </h2>
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
                        <PreviewPanel :preview="true" />
                    </div>
                    <!-- Navigation -->
                    <!-- <div class="flex flex-rows md:flex-row md:items-center justify-between gap-4 mt-4 prev-next-btn-mobile">
                        <button @click="prevPage" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            :disabled="currentPage === 0">
                            Précédent
                        </button>
                        <button v-if="currentPage < pages - 1" @click="nextPage"
                            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" :disabled="disabledNext">
                            Suivant
                        </button>
                        <button v-if="currentPage === pages - 1" @click="save"
                            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" :disabled="disabledBtn">
                            Enregistrer
                        </button>
                    </div> -->
                </div>
                <div class="p-6" v-else>
                    <SuccessComponent title="Formulaire d'enquête créé avec succès"
                        message="Si dessous partagez le lien du formulaire sur vos réseaux sociaux préférés"
                        :link="link" path="/enquetes" />
                </div>
                <SettingForm :open="openSurveySetting" @close="openSurveySetting = false" />
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
import { computed, onMounted, ref, watch, watchEffect } from "vue";
const currentPageTitle = ref("Nouvelle enquête")
import { surveyStore } from "@/stores/survey/surveyStore";
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import SurveyForm from "@/components/survey/SurveyForm.vue";
import SuccessComponent from '@/components/ui/SuccessComponent.vue'
import { getIndexDBStorage, getLocalStorage, setLocalStorage } from "@/utils/storage";
import { errorNotify, infoNotify, successNotify, warningNotify } from "@/utils/notification";
import validator from 'validator'
const storeTopic = topicStore()
const { selectTopic, selectCategory } = storeToRefs(storeTopic)
const store = surveyStore()
const { formSurvey, surveySuccess, surveyID } = storeToRefs(store)
const { saveFormInstance, getInitialFormSurvey, surveyFormLink } = store
// Etat de la page courante
const currentPage = ref(0);
const pages = ref(4)
import PreviewPanel from "@/components/survey/preview/PreviewPanel.vue";
import { useRoute, useRouter } from "vue-router";
import SaveIcon from "@/icons/SaveIcon.vue";
import Button from "@/components/ui/Button.vue";
import { get_account_id } from "@/composables/request";
import DraftIcon from "@/icons/DraftIcon.vue";
import SettingsIcon from "@/icons/SettingsIcon.vue";
import SettingForm from "@/components/survey/setting/settingForm.vue";

const pageTitle = [
    "Thématique",
    "Catégorie",
    "Questions",
    "Prévisualisation",
]

const route = useRoute()
const router = useRouter()

const openSurveySetting = ref(false)

const getSurveyDataStore = async () => {
    const storeData = await getIndexDBStorage(`survey_form_${formSurvey.value.form_id}@${get_account_id()}`)
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
        else {
            let initialFormSurvey = getInitialFormSurvey()
            formSurvey.value = { ...initialFormSurvey, form_id: route.params.id }
        }
    }
    else {
        errorNotify("Impossible de créer l'enquête. Paramètre invalide")
        setTimeout(() => {
            router.push({ path: '/enquetes' })
        }, 1000)
        return
    }

})

const getTopicSelect = (select) => {
    selectTopic.value = { ...select }
    formSurvey.value.topic = select
}

const getCategorySelect = (select) => {
    selectCategory.value = select
    formSurvey.value.category = select
}

const nextPage = () => {
    if ((currentPage.value === 2 && (!formSurvey.value.title))) {
        warningNotify('Donnez un titre à l`\'enquête')
        return
    }
    if ((currentPage.value === 2 && questionHaveNotTitle.value !== -1)) {
        warningNotify('Donnez un titre à chaque question')
        return
    }
    if ((formSurvey.value.questions.length == 0)) {
        warningNotify("L'enquête doit avoir au moins une question")
        return
    }
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
    return (currentPage.value === pages.value - 1 || (currentPage.value === 0 && !selectTopic.value?._id) || (currentPage.value === 1 && !selectCategory.value?._id))
})

const saveForm = async () => {
    saveFormInstance().then(() => {
        successNotify('Sauvegarde effectuée')
    }).catch((error) => {
        console.error('Erreur lors de la sauvegarde :', error);
    })
}

const disabledBtn = ref(false)
const link = ref('')
const save = async () => {
    disabledBtn.value = true
    infoNotify('Enregistrement en cours')
    await store.createSurvey()
    if (surveySuccess.value === true) {
        link.value = surveyFormLink(surveyID.value)
        disabledBtn.value = false
    }
    else {
        disabledBtn.value = false
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
