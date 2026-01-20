<template>
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
                <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Dénomination</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Logo</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Téléphone</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Adresse</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Heures d'ouvertures
                            </p>
                        </th>

                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action
                            </p>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(company, index) in companies" :key="index"
                        class="border-t border-gray-100 dark:border-gray-800">
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ company.denomination }}</p>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                                <img :src="company.logo" class="w-16 h-16 object-contain">
                            </p>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ company.email }}</p>
                        </td>

                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                                {{ company.phone }}
                            </p>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ company.adress }}</p>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ company.open_hours }}</p>
                        </td>
                        <td>
                            <div class="px-3 flex space-x-2">
                                <Button @click="editCompany(company)" size="sm" variant="outline"
                                    :startIcon="SettingsIcon">
                                </Button>
                                <Button size="sm" v-if="!isActiveCompany(company._id)" variant="outline"
                                    :startIcon="SwitchIcon" class="pe-3" title="Basculer"
                                    @click="switchAccount('enterprise', company)">
                                </Button>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
            <div class="text-center text-lg font-bold my-3" v-if="companies.length === 0">Aucune donnée</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Button from '../ui/Button.vue';
import SettingsIcon from '@/icons/SettingsIcon.vue'
import { companyStore } from "@/stores/company/companyStore";
import { storeToRefs } from "pinia";
import SwitchIcon from '@/icons/SwitchIcon.vue';
import Swal from 'sweetalert2';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';

const store = companyStore()
const {
    companies, selectCompany, openModal } = storeToRefs(store)

const { switchAccount } = store

onMounted(async () => {
})

const editCompany = (company) => {
    openModal.value = true
    selectCompany.value = company._id
}


const isActiveCompany = (company_id) => {
    const account_id = getLocalStorage('survey_mc_account_id')
    return account_id === company_id
}

</script>

<style scoped></style>
