<template>
    <admin-layout>
        <PageBreadcrumb pageTitle="Thématiques" />

        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <div class="w-2/3 flex justify-start gap-6">
                <div class="flex border-b">
                    <button @click="activeTab = 'topic'" :class="tabClass('topic')">Thématiques</button>
                </div>
                <div class="flex border-b">
                    <button @click="activeTab = 'category'" :class="tabClass('category')">Catégories</button>
                </div>
            </div>

            <div class="w-3/3 flex flex-col">

                <div class="flex-1 overflow-y-auto p-4">
                    <div v-if="activeTab === 'topic'" class="space-y-4">
                        <TopicList />
                    </div>
                    <div v-if="activeTab === 'category'" class="space-y-4">
                        <CategoryList />
                    </div>
                </div>
            </div>
        </div>
    </admin-layout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref } from 'vue'
import TopicList from '@/components/topics/TopicList.vue'
import CategoryList from '@/components/topics/CategoryList.vue'

const activeTab = ref("topic")
function tabClass(tab) {
    return activeTab.value === tab
        ? 'flex-1 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 py-2'
        : 'flex-1 text-sm text-gray-500 py-2 hover:text-blue-600'
}

</script>
