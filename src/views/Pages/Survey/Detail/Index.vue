<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard :title="`Enquête ${formSurvey.title}`">
                <div class="w-3/3 flex flex-col">
                    <!-- Tabs -->
                    <div class="flex border-b">
                        <button @click="activeTab = 'preview'" :class="tabClass('preview')">Prévisualisation</button>
                        <button @click="activeTab = 'responses'" :class="tabClass('responses')">Réponses</button>
                        <button @click="activeTab = 'statistics'" :class="tabClass('statistics')">Statistiques</button>

                    </div>

                    <div class="flex-1 overflow-y-auto p-4">
                        <div v-if="activeTab === 'preview'" class="space-y-4">
                            <PreviewPanel :preview="true" />
                        </div>
                        <div v-if="activeTab === 'responses'" class="space-y-4">
                            <Responses />
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
import { errorNotify } from '@/utils/notification';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Responses from './Responses.vue';

const route = useRoute()
const store = surveyStore()
const { showSurvey } = store
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
</script>