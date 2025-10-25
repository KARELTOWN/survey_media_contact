<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <div class="flex justify-end">
                    <button type="button" v-if="isActiveEnterpriseAccount()" @click="switchAccount('personal')"
                        class="flex me-3 items-center justify-center w-64 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-red-600">
                        Basculer sur le compte personnel
                    </button>
                    <button type="button" @click="open()" v-if="!isActiveEnterpriseAccount()"
                        class="flex items-center justify-center w-64 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600">
                        Ajouter une centre de formation
                    </button>
                </div>
                <CompanyList />
                <CreateCompany :open="openModal" @close="close" />
            </ComponentCard>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
const currentPageTitle = ref("Centres de Formations");
import { companyStore } from "@/stores/company/companyStore";
import { storeToRefs } from "pinia";
import CreateCompany from "@/components/company/CreateCompany.vue";
import CompanyList from "@/components/company/CompanyList.vue";
import { isActiveEnterpriseAccount } from "@/utils/account";
const store = companyStore()
const { errors,
    selectCompany, openModal } = storeToRefs(store)

const { switchAccount } = store

const open = () => {
    errors.value = {}
    selectCompany.value = ''
    openModal.value = true
}

const close = () => {
    selectCompany.value = ''
    openModal.value = false
}


</script>
