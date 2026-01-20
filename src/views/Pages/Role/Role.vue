<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="flex justify-end">
          <button type="button" @click="open()"
            class="flex items-center justify-center w-64 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600">
            Ajouter un role
          </button>
        </div>
        <RoleList />
        <CreateRole :open="openModal" @close="close" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
const currentPageTitle = ref("Roles");

import { roleStore } from "@/stores/user/roleStore";
import { storeToRefs } from "pinia";
import CreateRole from "@/components/role/CreateRole.vue";
import RoleList from "@/components/role/RoleList.vue";
const store = roleStore()
const { errors } = storeToRefs(store)

const openModal = ref(false)

const open = () => {
  errors.value = {}
  openModal.value = true
}

const close = () => {
  openModal.value = false
}

</script>
