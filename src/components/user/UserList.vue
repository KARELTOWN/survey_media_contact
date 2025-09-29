<template>
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
                <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nom & Prénoms</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Téléphone</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Role</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action</p>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(user_company, index) in users" :key="index"
                        class="border-t border-gray-100 dark:border-gray-800">
                        <td class="px-5 py-4 sm:px-6">
                            <span :class="[
                                'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                                {
                                    'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                                        user_company.is_active === true,
                                    'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                                        user_company.is_active === false,
                                },
                            ]">
                                {{ user_company.is_active === true ? "Actif" : 'Inactif' }}
                            </span>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user_company.user_id.firstname
                                + ' ' +
                                user_company.user_id.lastname }}</p>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400"><a
                                    :href="`mailto:${user_company.user_id.email}`">{{ user_company.user_id.email }}</a>
                            </p>
                        </td>

                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                                {{ user_company.user_id.code || '' }} {{ user_company.user_id.phone || '...' }}
                            </p>

                        </td>

                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user_company.role_id ?
                                user_company.role_id.libelle : '---' }}</p>
                        </td>
                        <td>
                            <div class="flex flex justify-center space-x-2">
                                <Button @click="changeAccountStatus(user_company, index)" size="sm" variant="outline"
                                    :startIcon="SettingsIcon">
                                </Button>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Button from '../ui/Button.vue';
import SettingsIcon from '@/icons/SettingsIcon.vue'
import { userStore } from "@/stores/user/userStore";
import { storeToRefs } from "pinia";
import Swal from 'sweetalert2'

const store = userStore()
const {
    users, selectUser, openModal, errors, userSuccess } = storeToRefs(store)

const { getUsers, changeStatus } = store

onMounted(async () => {
    await handleUsers()
})

const handleUsers = async () => {
    try {
        await getUsers()
    } catch (err) {
    }
}

const changeAccountStatus = async (user_company, index) => {
    console.log('user_company', user_company)
    let text = user_company.is_active === true ? "Le collaborateur ne pourra plus accéder à l'espace d'administration de votre société" : "Le collaborateur pourra accéder à l'espace d'administration de votre société et faire des actions que lui accordent son role"
    Swal.fire({
        title: "Etes vous sûr de vouloir changer le status du compte ?",
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, changer !",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await changeStatus({ user_company: user_company._id })
            if (userSuccess.value === true) {
                console.log('users.value[index]', users.value[index].is_active)

                users.value[index].is_active = !users.value[index].is_active
                console.log('users.value[index] apres', users.value[index].is_active)
            }
        }
    });
}

</script>

<style scoped></style>
