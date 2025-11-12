<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard :title="`Enquête ${formSurvey.title}`">

                <div class="flex justify-end items-end pb-5">
                    <Button variant="danger" class="me-3" @click="modifySurvey">Modifier</Button>
                    <Button variant="primary" class="me-3" @click="copyLink">Copier le lien</Button>
                    <Button variant="success" class="me-3" @click="excel">Excel</Button>
                </div>

                <div class="w-3/3 flex flex-col">
                    <!-- Tabs -->
                    <div class="flex flex-col md:flex-row lg:flex-row border-b">
                        <button @click="activeTab = 'preview'" :class="tabClass('preview')">Prévisualisation</button>
                        <button @click="activeTab = 'responses'" :class="tabClass('responses')">Réponses </button>
                        <button @click="activeTab = 'statistics'" :class="tabClass('statistics')">Statistiques</button>
                        <button @click="activeTab = 'qrcode'" :class="tabClass('qrcode')">QR CODE</button>
                    </div>

                    <div class="flex-1 h-auto p-4">
                        <div v-if="activeTab === 'preview'" class="space-y-4">
                            <PreviewPanel :preview="true" />
                        </div>
                        <div v-if="activeTab === 'responses'" class="space-y-4">
                            <Responses />
                        </div>
                        <div v-if="activeTab === 'statistics'" class="space-y-4">
                            <Statistics />
                        </div>
                        <div v-if="activeTab === 'qrcode'" class="space-y-4">
                            <QrCode />
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>
    </AdminLayout>
</template>

<script setup>
import PreviewPanel from '@/components/survey/preview/PreviewPanel.vue';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
const activeTab = ref('preview')

function tabClass(tab) {
    return activeTab.value === tab
        ? 'flex-1 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 py-2'
        : 'flex-1 text-sm text-gray-500 py-2 hover:text-blue-600'
}


import { surveyStore } from '@/stores/survey/surveyStore';
import { errorNotify, infoNotify } from '@/utils/notification';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Responses from './Responses.vue';
import { copyInClipInBoard } from '@/utils/general';
import Button from '@/components/ui/Button.vue';
import Statistics from './Statistics.vue';
import QrCode from './QrCode.vue';
import FilterDate from '../../../../components/survey/detail/FilterDateResponses.vue';

const route = useRoute()
const store = surveyStore()
const { showSurvey, surveyFormLink, exportToExcel } = store
const { formSurvey } = storeToRefs(store)
onMounted(async () => {
    if (route.params.id) {
        await showSurvey(route.params.id)
    }
    else {
        errorNotify('Impossible de charger l\'enquête')
        return
    }
})

const copyLink = () => {
    const link = surveyFormLink(route.params.id)
    copyInClipInBoard(link)
    infoNotify('Lien copié')
}

const router = useRouter()
const modifySurvey = () => {
    router.push({ name: 'Update-Survey', params: { survey_id: route.params.id } })
}

const excel = async () => {
    if (route.params.id && formSurvey.value.title) {
        await exportToExcel(route.params.id, formSurvey.value.title)

    }
}
</script>