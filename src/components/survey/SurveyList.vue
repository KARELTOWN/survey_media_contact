<template>
    <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6" @click="closeActions">
        <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Liste des enquetes</h2>
                <p class="text-sm text-gray-500">Publiez, dupliquez, archivez et partagez vos formulaires.</p>
            </div>
        </div>

        <div class="mb-5 inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button type="button" :class="tabClass('active')" @click="activeTab = 'active'">
                Actives <span class="text-xs opacity-70">({{ activeSurveys.length }})</span>
            </button>
            <button type="button" :class="tabClass('archived')" @click="activeTab = 'archived'">
                Archivees <span class="text-xs opacity-70">({{ archivedSurveys.length }})</span>
            </button>
        </div>

        <div v-if="displayedSurveys.length" class="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            <article v-for="survey in displayedSurveys" :key="survey._id"
                class="flex min-h-[210px] flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900">
                <div class="flex h-full flex-col gap-5">
                    <button type="button" @click="seeDetail(survey._id)" class="min-w-0 flex-1 text-left">
                        <div class="flex flex-wrap items-start gap-2">
                            <h3 class="min-w-0 flex-1 text-lg font-semibold leading-snug text-gray-800 dark:text-white">
                                {{ survey.title }}
                            </h3>
                            <span :class="survey.publish ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'"
                                class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold">
                                {{ survey.publish ? 'Publie' : 'Brouillon' }}
                            </span>
                            <span v-if="isExpired(survey)" class="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                Expire
                            </span>
                            <span v-if="survey.archived" class="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                Archivee
                            </span>
                        </div>
                        <p v-if="survey.description" class="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                            {{ survey.description }}
                        </p>
                        <div class="mt-4 grid gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <span>Creee le {{ formatTimestampToDate(survey.createdAt) }}</span>
                            <span>Reponses : <strong>{{ survey.count_responses || 0 }}</strong></span>
                            <span v-if="survey.category_id" class="truncate">Categorie : <strong>{{ survey.category_id.libelle }}</strong></span>
                        </div>
                    </button>

                    <div class="relative mt-auto flex justify-end border-t border-gray-100 pt-4" @click.stop>
                        <button type="button" class="action-btn action-trigger" @click="toggleActions(survey._id)">
                            Actions
                            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
                            </svg>
                        </button>

                        <div v-if="activeActionId === survey._id"
                            class="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                            <button v-if="!survey.archived" type="button" class="dropdown-action"
                                @click="runAction(() => togglePublishSurvey(survey._id, !survey.publish))">
                                {{ survey.publish ? 'Depublier' : 'Publier' }}
                            </button>
                            <button type="button" class="dropdown-action" @click="runAction(() => duplicateSurvey(survey._id))">
                                Dupliquer
                            </button>
                            <button type="button" class="dropdown-action" @click="runAction(() => openQr(survey))">
                                QR code
                            </button>
                            <button type="button" class="dropdown-action" @click="runAction(() => printSurvey(survey._id))">
                                PDF imprimable
                            </button>
                            <button v-if="!survey.archived" type="button" class="dropdown-action danger"
                                @click="runAction(() => archiveSurvey(survey._id))">
                                Archiver
                            </button>
                            <button type="button" class="dropdown-action danger"
                                @click="runAction(() => confirmDeleteSurvey(survey))">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>

        <div v-else class="mt-10 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 dark:text-gray-400">
            {{ activeTab === 'archived' ? 'Aucune enquete archivee pour le moment.' : 'Aucune enquete active pour le moment.' }}
        </div>

        <div v-if="qrSurvey" class="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/50 px-4">
            <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div class="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">QR code</h3>
                        <p class="text-sm text-gray-500">{{ qrSurvey.title }}</p>
                    </div>
                    <button type="button" @click="qrSurvey = null" class="text-2xl leading-none text-gray-400">x</button>
                </div>
                <div class="flex justify-center rounded-xl bg-gray-50 p-4">
                    <QrcodeVue ref="qrRef" :value="surveyFormLink(qrSurvey._id)" :size="220" level="M" render-as="canvas" />
                </div>
                <div class="mt-4 break-all rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                    {{ surveyFormLink(qrSurvey._id) }}
                </div>
                <button type="button" @click="downloadQr"
                    class="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
                    Telecharger le QR code
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { surveyStore } from "@/stores/survey/surveyStore";
import { formatTimestampToDate } from '@/utils/format';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import moment from 'moment';

const store = surveyStore()
const { getSurveys, duplicateSurvey, togglePublishSurvey, archiveSurvey, deleteSurvey, surveyFormLink } = store
const { surveysList } = storeToRefs(store)
const qrSurvey = ref(null)
const qrRef = ref(null)
const activeTab = ref('active')
const activeActionId = ref(null)

const activeSurveys = computed(() => (surveysList.value || []).filter((survey) => survey.archived !== true))
const archivedSurveys = computed(() => (surveysList.value || []).filter((survey) => survey.archived === true))
const displayedSurveys = computed(() => activeTab.value === 'archived' ? archivedSurveys.value : activeSurveys.value)

const tabClass = (tab) => [
    'rounded-lg px-4 py-2 text-sm font-semibold transition',
    activeTab.value === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
]

const closeActions = () => {
    activeActionId.value = null
}

const toggleActions = (surveyId) => {
    activeActionId.value = activeActionId.value === surveyId ? null : surveyId
}

const runAction = async (callback) => {
    closeActions()
    await callback()
}

onMounted(async () => {
    await getSurveys()
})

const router = useRouter()

const seeDetail = (survey_id) => {
    router.push({ name: 'Survey-Detail', params: { id: survey_id } })
}

const isExpired = (survey) => {
    return survey.end_date && moment().isAfter(moment(survey.end_date))
}

const openQr = async (survey) => {
    qrSurvey.value = survey
    await nextTick()
}

const downloadQr = () => {
    const canvas = qrRef.value?.$el?.querySelector?.('canvas') || document.querySelector('canvas')
    if (!canvas || !qrSurvey.value) return
    const link = document.createElement('a')
    link.download = `qr-${qrSurvey.value.title || 'enquete'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
}

const printSurvey = (surveyId) => {
    window.open(`/forms/${surveyId}?print=1`, '_blank')
}

const confirmDeleteSurvey = async (survey) => {
    const title = survey?.title || 'cette enquete'
    const confirmed = window.confirm(`Supprimer definitivement "${title}" ? Cette action supprimera aussi les reponses associees.`)
    if (!confirmed) return
    await deleteSurvey(survey._id)
}
</script>

<style scoped>
.action-btn {
    border-radius: 0.75rem;
    border: 1px solid #d1d5db;
    background: #ffffff;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
}

.action-btn:hover {
    background: #f9fafb;
}

.action-btn.danger {
    border-color: #fecaca;
    color: #dc2626;
}

.action-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.dropdown-action {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 600;
    color: #25324b;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.dropdown-action:hover {
    background: #f3f7ff;
    color: #1d4ed8;
}

.dropdown-action.danger {
    color: #dc2626;
}

.dropdown-action.danger:hover {
    background: #fff1f2;
    color: #b91c1c;
}
</style>
