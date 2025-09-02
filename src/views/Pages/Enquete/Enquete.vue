<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Projets">
        <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-4">
          <button type="button" @click="open()"
            class="flex items-center justify-center w-64 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
            Créer une enquête
          </button>
        </div>
        <!-- <div>
          <SearchPanel />
        </div> -->
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
const currentPageTitle = ref("Projets");
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
const store = surveyStore()
import { surveyStore } from "@/stores/survey/surveyStore";
const { selectCategory, selectTopic } = storeToRefs(store)
// const { getProjects } = store

const fetchNext = async (nextpage) => {
  page.value = nextpage
  // await getProjects()
}

const router = useRouter()

const open = () => {
  router.push({ path: '/creation-enquete' })
}

// const close = () => {
//   selectProject.value = ''
//   openModal.value = false
// }

// const closeInviteModal = () => {
//   selectProject.value = ''
//   openModalInvitation.value = false
// }
</script>
