<template>
    <admin-layout>
        <PageBreadcrumb pageTitle="Catégories" />

        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <div class="mb-4">
                <h2 class="text-lg font-semibold text-gray-800">Organisation des catégories</h2>
                <p class="mt-1 text-sm text-gray-500">Les enquêtes utilisent désormais uniquement les catégories pour leur classement fonctionnel.</p>
            </div>

            <div class="w-3/3 flex flex-col">
                <div class="flex-1 overflow-y-auto p-4">
                    <CategoryList />
                </div>
            </div>
        </div>
    </admin-layout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import CategoryList from '@/components/topics/CategoryList.vue'
</script>
