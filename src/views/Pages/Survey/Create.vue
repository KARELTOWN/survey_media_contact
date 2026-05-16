<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <div v-if="surveySuccess === false">
                    <div class="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <button v-for="step in steps" :key="step.id" type="button" @click="goToStep(step.id)"
                                :disabled="!canGoToStep(step.id)" :class="[
                                'rounded-lg border px-3 py-2 text-left transition',
                                currentPage === step.id ? 'border-red-400 bg-white shadow-sm' : currentPage > step.id ? 'border-gray-200 bg-white hover:border-red-200' : 'border-gray-200 bg-transparent',
                                canGoToStep(step.id) ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                            ]">
                                <div class="text-xs font-semibold uppercase tracking-wide"
                                    :class="currentPage >= step.id ? 'text-red-600' : 'text-gray-400'">
                                    Etape {{ step.id + 1 }}
                                </div>
                                <div class="text-sm font-semibold text-gray-800">{{ step.label }}</div>
                            </button>
                        </div>
                    </div>

                    <div class="mb-3 flex justify-end space-x-2">
                        <Button variant="outline" @click="openSurveySetting = true" v-if="currentPage > 0" size="sm" title="Paramétrer">
                            <SettingsIcon />
                        </Button>
                        <Button variant="outline" @click="saveForm" v-if="currentPage > 0" size="sm" title="Sauvegarder en brouillon">
                            <SaveIcon />
                        </Button>
                        <Button variant="outline" @click="save(true)" v-if="currentPage === 2" size="sm" title="Enregistrer comme modèle">
                            <PageIcon /> Enregistrer comme Modèle
                        </Button>
                    </div>

                    <div class="survey-display-next-prev-btn mb-4 flex flex-rows justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <button v-if="currentPage > 0" @click="prevPage" class="rounded border px-4 py-2 text-dark shadow">
                                Précédent
                            </button>
                        </div>

                        <div v-if="currentPage > 0 && currentPage < pages - 1">
                            <button @click="nextPage" class="rounded border px-4 py-2 text-dark shadow" :disabled="disabledNext">
                                Suivant
                            </button>
                        </div>

                        <div v-if="currentPage === pages - 1">
                            <button @click="save(false)" class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600" :disabled="disabledBtn">
                                Enregistrer
                            </button>
                        </div>
                    </div>

                    <div v-if="currentPage === 0">
                        <FirstStep @select="getTemplate" />
                    </div>

                    <div v-if="currentPage === 1">
                        <div class="mx-auto mb-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-4">
                            <div class="mb-4">
                                <h3 class="text-sm font-semibold text-gray-800">Classification</h3>
                                <p class="text-sm text-gray-500">Choisissez la catégorie de l'enquête.</p>
                            </div>
                            <div class="grid grid-cols-1 gap-4">
                                <CategorySelector @select="getCategorySelect" />
                            </div>
                        </div>
                        <div class="mx-auto mb-6 max-w-3xl">
                            <AnalyticsContextPanel />
                        </div>
                        <SurveyForm />
                    </div>

                    <div v-if="currentPage === 2">
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
import FirstStep from "@/components/survey/create/FirstStep.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
const currentPageTitle = ref("Nouvelle enquête")
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
import SurveyForm from "@/components/survey/SurveyForm.vue";
import SuccessComponent from '@/components/ui/SuccessComponent.vue'
import { getIndexDBStorage } from "@/utils/storage";
import { errorNotify, infoNotify, successNotify, warningNotify } from "@/utils/notification";
import validator from 'validator'

const store = surveyStore()
const { formSurvey, surveySuccess, surveyID } = storeToRefs(store)
const { saveFormInstance, getInitialFormSurvey, surveyFormLink } = store
const currentPage = ref(null);
const pages = ref(3)
const steps = [
    { id: 0, label: 'Point de départ' },
    { id: 1, label: 'Construction du formulaire' },
    { id: 2, label: 'Prévisualisation' },
]
import PreviewPanel from "@/components/survey/preview/PreviewPanel.vue";
import { useRoute, useRouter } from "vue-router";
import SaveIcon from "@/icons/SaveIcon.vue";
import PageIcon from "@/icons/PageIcon.vue";
import Button from "@/components/ui/Button.vue";
import { get_account_id } from "@/composables/request";
import SettingsIcon from "@/icons/SettingsIcon.vue";
import SettingForm from "@/components/survey/setting/settingForm.vue";
import { configStore } from '@/stores/config/config.js'
import CategorySelector from "../../../components/topics/CategorySelector.vue";
import AnalyticsContextPanel from "@/components/survey/AnalyticsContextPanel.vue";
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
    if (validator.isUUID(route.params.id)) {
        formSurvey.value.form_id = route.params.id
        let storeData = await getSurveyDataStore()
        if (storeData) {
            currentPage.value = 1
            formSurvey.value = { ...storeData }
            if (formSurvey.value?.theme) {
                themeProperties.value = formSurvey.value?.theme
            }
        }
        else {
            currentPage.value = 0
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

const getTemplate = (data) => {
    if (data.template == 1) {
        currentPage.value = 1
        if (!hasStartedSurvey.value) {
            let initialFormSurvey = getInitialFormSurvey()
            formSurvey.value = { ...initialFormSurvey, form_id: route.params.id }
        }
    }
    else if (data.template == 2) {
        currentPage.value = 1
        formSurvey.value = {
            ...data.model,
            form_id: route.params.id,
            category: data.model?.category_id,
            formation: data.model?.formation_id || null,
            module: data.model?.module_id || null,
            chapter: data.model?.chapter_id || null,
            trainer: data.model?.trainer_id || null,
            session: data.model?.session_id || null,
        }
    }
}

const getCategorySelect = (select) => {
    formSurvey.value.category = select
}

const nextPage = () => {
    if ((currentPage.value === 1 && (!formSurvey.value.title))) {
        warningNotify("Donnez un titre à l'enquête")
        return
    }
    if ((currentPage.value === 1 && questionHaveNotTitle.value !== -1)) {
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

const canGoToStep = (step) => {
    return step <= currentPage.value
}

const goToStep = (step) => {
    if (canGoToStep(step)) {
        currentPage.value = step
    }
}

const questionHaveNotTitle = computed(() => {
    let result = formSurvey.value.questions.findIndex((question) => (question.category !== 'image' && !question.title))
    return result
})

const hasStartedSurvey = computed(() => {
    return Boolean(
        formSurvey.value.title ||
        formSurvey.value.description ||
        formSurvey.value.category ||
        formSurvey.value.formation ||
        formSurvey.value.module ||
        formSurvey.value.chapter ||
        formSurvey.value.trainer ||
        formSurvey.value.session ||
        formSurvey.value.questions?.length
    )
})

const disabledNext = computed(() => {
    const categoryId = formSurvey.value.category?._id || formSurvey.value.category_id?._id || formSurvey.value.category_id
    return currentPage.value === 1 && !categoryId
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
    await store.createSurvey(model)
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
    formSurvey.value.category = null
})
</script>

<style>
body {
    background-color: #f3f4f6;
}

button:disabled {
    background-color: #9ca3af !important;
    cursor: not-allowed;
}
</style>
