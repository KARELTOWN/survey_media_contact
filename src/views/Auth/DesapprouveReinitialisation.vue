<template>
    <FullScreenLayout>
        <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
                <div class="flex flex-col flex-1 w-full lg:w-1/2">
                    <div class="w-full max-w-md pt-10 mx-auto">
                    </div>
                    <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div class="text-center align-middle justify-center flex">
                            <img class="dark:hidden lg:hidden" width="200" src="/images/logo/logo.png" alt="Logo" />
                            <img class="hidden dark:block scale-200 lg:hidden" width="80"
                                src="/images/logo/auth-logo.png" alt="Logo" />
                        </div>
                        <div>
                            <div class="mb-5 sm:mb-8">
                                <h1
                                    class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                    Désapprouver la réinitialisation du mot de passe
                                </h1>
                            </div>
                            <div>

                                <div v-if="resetSuccess === false" class="ms-5">
                                    <div class="loader-animation"></div>
                                </div>
                                <div>

                                </div>

                                <div class="mt-5" v-if="resetSuccess === true">
                                    <p
                                        class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                        Vous n'avez pas de compte ?
                                        <router-link to="/signup"
                                            class="text-brand-500 hover:text-brand-600 dark:text-brand-400">Créer un
                                            compte</router-link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-red-950 dark:bg-white/5 lg:grid">
                    <div class="flex items-center justify-center z-1">
                        <common-grid-shape />
                        <div class="flex flex-col items-center max-w-xs">
                            <router-link to="/" class="block mb-4">
                                <img width="231" height="48" src="/images/logo/auth-logo.png" alt="Logo" />
                            </router-link>
                            <p class="text-center text-gray-400 dark:text-white/60">
                                <strong>Enquêtez en toute simplicité</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </FullScreenLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { fetchPost } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { successNotify } from '@/utils/notification'
import { useRoute } from 'vue-router'
const route = useRoute()
const token = ref(null)
const hasToken = ref(false)
const resetSuccess = ref(false)

onMounted(async () => {
    if (route.query.urpi) {
        token.value = route.query.urpi
        hasToken.value = true
        await handleSubmit()
    }
    else {
        alert('Impossible de réinitialiser le mot de passe. Veuillez cliquer sur le lien envoyé par mail.')
    }
})

const handleSubmit = async () => {
    try {
        resetSuccess.value = false
        const result = await fetchPost(`auth/desapprouve-reinitialisation`, { token: token.value })
        const response = await handleAppError(result)
        if (response.status === true) {
            resetSuccess.value = true
            return
        }
        else {
            if (response?.data) {
                resetSuccess.value = true
                successNotify('Annulation effectuée')
            }
        }
    } catch (err) {
        console.error(err)
    }
}
</script>
