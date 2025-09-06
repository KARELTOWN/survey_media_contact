<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Utilisateurs">
        <div>
          <button type="button" @click="open()"
            class="flex items-center justify-center w-64 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
            Ajouter un utilisateur 

          </button>
        </div>
        <UserList />
        <div class="grid grid-cols-2">
          <div>
           
            <Pagination :paginator="users" :current_page="page" :totalPages="totalPages" @page-change="fetchNext" />
          </div>
          <div>
            <strong>Total : </strong> {{ total }}
          </div>

        </div>
        <CreateUser :open="openModal" @close="close" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import UserList from "@/components/user/UserList.vue";
const currentPageTitle = ref("Utilisateurs");
import CreateUser from '@/components/user/CreateUser.vue'
import Pagination from "@/components/pagination/Pagination.vue";

import { userStore } from "@/stores/user/userStore.ts";
import { storeToRefs } from "pinia";
const store = userStore()
const { errors,
  users,
  total,
  page,
  limit,
  totalPages, selectUser, openModal } = storeToRefs(store)
const { getUsers } = store

const fetchNext = async (nextpage) => {
  page.value = nextpage
  await getUsers()
}

const open = () => {
  errors.value = {}
  selectUser.value = ''
  openModal.value = true
}

const close = () => {
  selectUser.value = ''
  openModal.value = false
}

</script>
