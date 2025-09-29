<template>
    <admin-layout>
        <PageBreadcrumb pageTitle="Configurer" />

        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <div class="w-1/3 flex flex-col">
                <div class="flex border-b">
                    <button @click="activeTab = 'en-tete'" :class="tabClass('en-tete')">En tête</button>
                </div>
            </div>

            <div class="w-3/3 flex flex-col">

                <div class="flex-1 overflow-y-auto p-4">
                    <div v-if="activeTab === 'en-tete'" class="space-y-4">
                        <Form />
                    </div>
                </div>
            </div>
        </div>
    </admin-layout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Form from '@/components/Config/Header/Form.vue'
import { ref } from 'vue'
const activeTab = ref("en-tete")
function tabClass(tab) {
    return activeTab.value === tab
        ? 'flex-1 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 py-2'
        : 'flex-1 text-sm text-gray-500 py-2 hover:text-blue-600'
}

</script>
