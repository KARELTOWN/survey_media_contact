<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-4">
          <button type="button" @click="open()"
            class="flex items-center justify-center w-64 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600">
            Créer une enquête
          </button>
        </div>
        <div>
          <SurveyList />
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
const currentPageTitle = ref("Enquêtes");
import { useRouter } from "vue-router";
import { getUUID } from "@/utils/uuid";
import SurveyList from "@/components/survey/SurveyList.vue";

const router = useRouter()

const open = () => {
  router.push({ name: 'Create-Survey', params: { id: getUUID() } })
}
</script>
