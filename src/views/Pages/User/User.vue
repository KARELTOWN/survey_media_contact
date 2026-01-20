<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="flex justify-end">
          <button type="button" @click="open()"
            class="flex items-center justify-center w-64 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600">
            Inviter un collaborateur

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
        <InviteUser :open="openModal" @close="close" />
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
const currentPageTitle = ref("Collaborateurs");
import InviteUser from '@/components/user/InviteUser.vue'
import Pagination from "@/components/pagination/Pagination.vue";

import { userStore } from "@/stores/user/userStore.js";
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
