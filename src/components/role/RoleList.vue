<template>
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
                <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Libelle</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6 text-center">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action
                            </p>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(role, index) in roles" :key="index"
                        class="border-t border-gray-100 dark:border-gray-800">
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ role.libelle }}</p>
                        </td>
                        <td>
                            <div class="px-3 flex space-x-2 my-2">
                                <Button size="sm" variant="outline" :startIcon="SettingsIcon" class="pe-3"
                                    title="Basculer" @click="setPermission(role)">
                                </Button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="text-center text-lg font-bold my-3" v-if="roles.length === 0">Aucune donnée</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Button from '../ui/Button.vue';
import SettingsIcon from '@/icons/SettingsIcon.vue'
import { roleStore } from "@/stores/user/roleStore";
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';

const store = roleStore()
const { roles } = storeToRefs(store)
const { getRoles } = store
const router = useRouter()
onMounted(async () => {
    getRoles()
})

const setPermission = (role) => {
    router.push({ name: 'Permissions', params: { id: role._id } })
}

</script>