<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle + ` : ${formSurvey.title}`" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <div v-if="surveySuccess === false">

                    <div class="flex justify-end mb-4 space-x-2">
                        <Button variant="outline" @click="openSurveySetting = true" size="sm"
                            title="Paramétrer">
                            <SettingsIcon />
                        </Button>
                        <Button variant="outline" @click="saveForm" size="sm"
                            title="Sauvegarder en brouillon">
                            <SaveIcon />
                        </Button>

                        <Button variant="outline" @click="save(true)" v-if="currentPage === 1" size="sm"
                            title="Enregistrer comme modèle">
                            <PageIcon /> Enregistrer comme Modèle
                        </Button>
                    </div>


                    <div
                        class="flex flex-rows md:flex-row md:items-center justify-between gap-4 mb-4 survey-display-next-prev-btn">
                        <div>
                            <button @click="prevPage" class="px-4 py-2 shadow border text-dark rounded"
                                v-if="currentPage == 1">
                                Précédent
                            </button>
                        </div>

                        <div>
                            <button v-if="currentPage < pages - 1" @click="nextPage"
                                class="px-4 py-2 border text-dark shadow rounded" :disabled="disabledNext">
                                Suivant
                            </button>
                        </div>

                        <div v-if="currentPage === pages - 1">
                            <button @click="save(false)"
                                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                :disabled="disabledBtn">
                                Enregistrer
                            </button>
                        </div>
                    </div>

                    <h2 class="text-lg font-bold text-center mb-5">
                        <div v-if="currentPage == 0"></div>
                        <div v-if="currentPage == 1">Prévisualisation</div>
                    </h2>

                    <div v-if="currentPage === 0">
                        <div class="grid grid-cols-6 px-2 md:px-10 py-10 gap-3">
                            <div class="col-span-6 md:col-span-2">
                                <TopicSelector @select="getTopicSelect" />
                            </div>
                            <div class="col-span-6 md:col-span-2 mt-2 md:mt-0">
                                <CategorySelector @select="getCategorySelect" />
                            </div>
                        </div>
                        <SurveyForm />
                    </div>

                    <div v-if="currentPage === 1">
                        <PreviewPanel :preview="true" />
                    </div>
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
const currentPageTitle = ref("Modifier enquête")
import { surveyStore } from "@/stores/survey/surveyStore";
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import SurveyForm from "@/components/survey/SurveyForm.vue";
import SuccessComponent from '@/components/ui/SuccessComponent.vue'
import { getIndexDBStorage } from "@/utils/storage";
import { errorNotify, infoNotify, successNotify, warningNotify } from "@/utils/notification";
const storeTopic = topicStore()
const { selectTopic, selectCategory } = storeToRefs(storeTopic)
const store = surveyStore()
const { formSurvey, surveySuccess, surveyID } = storeToRefs(store)
const { saveFormInstance, getInitialFormSurvey, surveyFormLink, showSurvey } = store
const currentPage = ref(0);
const pages = ref(2)
import PreviewPanel from "@/components/survey/preview/PreviewPanel.vue";
import { useRoute, useRouter } from "vue-router";
import Button from "@/components/ui/Button.vue";
import { get_account_id } from "@/composables/request";
import SettingForm from "@/components/survey/setting/settingForm.vue";
import SaveIcon from "@/icons/SaveIcon.vue";
import SettingsIcon from "@/icons/SettingsIcon.vue";
import { configStore } from '@/stores/config/config.js'
import TopicSelector from "../../../components/topics/TopicSelector.vue";
import CategorySelector from "../../../components/topics/CategorySelector.vue";
const config_store = configStore()
const { themeProperties } = storeToRefs(config_store)

const route = useRoute()
const router = useRouter()

const openSurveySetting = ref(false)

const getSurveyDataStore = async () => {
    const storeData = await getIndexDBStorage(`survey_form_${formSurvey.value.form_id}@${get_account_id()}`)
    return storeData
}

onMounted(async () => {
    surveySuccess.value = false
    if (route.params.survey_id) {
        await showSurvey(route.params.survey_id)
        let storeData = await getSurveyDataStore()
        if (storeData) {
            formSurvey.value = { ...storeData }
        }
        else {
            formSurvey.value.topic = formSurvey.value.topic_id
            formSurvey.value.category = formSurvey.value.category_id
        }
        if (formSurvey.value?.theme) {
            themeProperties.value = formSurvey.value?.theme
        }
    }
    else {
        errorNotify("Impossible de modifier l'enquête. Paramètre invalide")
        setTimeout(() => {
            router.push({ path: '/enquetes' })
        }, 1000)
        return
    }

})

const getTopicSelect = (select) => {
    formSurvey.value.topic = select
}

const getCategorySelect = (select) => {
    formSurvey.value.category = select
}

const nextPage = () => {
    if ((currentPage.value === 0 && (!formSurvey.value.title))) {
        warningNotify('Donnez un titre à l`\'enquête')
        return
    }
    if ((currentPage.value === 0 && questionHaveNotTitle.value !== -1)) {
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
    return ((currentPage.value === 0 && !selectTopic.value?._id) || (currentPage.value === 0 && !selectCategory.value?._id))
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
const save = async (model = false) => {
    if (model === false) {
        disabledBtn.value = true
        infoNotify('Enregistrement en cours')
    }
    await store.updateSurvey(model)
    if (model === false) {
        if (surveySuccess.value === true) {
            link.value = surveyFormLink(surveyID.value)
            disabledBtn.value = false
        }
        else {
            disabledBtn.value = false
        }
    }
}

onBeforeUnmount(() => {
    selectCategory.value = null
    selectTopic.value = null
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
