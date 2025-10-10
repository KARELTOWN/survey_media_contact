<template>
    <AdminLayout>
        <PageBreadcrumb pageTitle="Invitation" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <div class="flex justify-center" v-if="load === true && error === false">
                    <div class="loader-animation"></div>
                </div>
                <div class="flex justify-center text-green-600 font-bold " v-if="load === false && error === false">
                    Invitation acceptée
                </div>
                <div class="flex justify-center text-lg font-bold text-red-600" v-if="load === false && error === true">
                    {{ errors.token }}
                </div>
            </ComponentCard>
        </div>
    </AdminLayout>
</template>

<script setup>
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { onMounted, ref } from 'vue'
import { userStore } from "@/stores/user/userStore";
import { storeToRefs } from "pinia";
import { useRoute } from 'vue-router';
import { errorNotify } from '@/utils/notification';
import SuccessIcon from '@/icons/SuccessIcon.vue';

const store = userStore()
const { userSuccess, errors } = storeToRefs(store)

const { acceptInvitation } = store

const load = ref(false)
const error = ref(false)
const route = useRoute()

onMounted(async () => {
    load.value = true
    if (!route.query.jc) {
        errorNotify('Invitation invalide')
        return
    }
    await acceptInvitation({ token: route.query.jc }).then(() => {
        if (userSuccess.value === true) {
            load.value = false
            error.value = false
            return
        }
        load.value = false
        error.value = true
    }).catch((err) => {
        load.value = false
        error.value = true
    })
})
</script>
