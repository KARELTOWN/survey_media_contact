<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-6">Gestion des Permissions - {{ role?.libelle }}</h1>

        <div class="grid gap-6 md:grid-cols-2">
            <div v-for="(features, moduleName) in permissions" :key="moduleName"
                class="bg-white shadow rounded-2xl p-4">
                <h2 class="text-lg font-semibold border-b pb-2 mb-4">
                    {{ moduleName }}
                </h2>

                <ul class="space-y-3">
                    <li v-for="(item, index) in features" :key="item.feature" class="flex items-center justify-between">
                        <span class="text-gray-700">{{ item.feature }}</span>

                        <!-- Switch Tailwind -->
                        <button @click="togglePermission(moduleName, index, item.permission_id)" :class="[
                            item.is_active ? 'bg-red-500' : 'bg-gray-300',
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none'
                        ]">
                            <span :class="[
                                item.is_active ? 'translate-x-6' : 'translate-x-1',
                                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
                            ]" />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>

import { roleStore } from "@/stores/user/roleStore";
import { errorNotify } from "@/utils/notification";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
const store = roleStore()
const { getPermissions, updatePermission } = store
const { permissions, selectRole, role } = storeToRefs(store)
const route = useRoute()

onMounted(() => {
    if (!route.params.id) {
        errorNotify("Role non défini")
        return
    }
    getPermissions(route.params.id)
})


const togglePermission = async (moduleName, featureIndex, permission_id) => {
    permissions.value[moduleName][featureIndex].is_active =
        !permissions.value[moduleName][featureIndex].is_active;
    // TODO: Appeler ton API pour sauvegarder la modification
    try {
        await updatePermission({ permission_id })
    }
    catch (err) {
        console.error(err)
    }
};

</script>