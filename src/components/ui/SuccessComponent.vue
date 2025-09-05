<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <!-- Carte principale -->
        <div class="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
            <!-- Icône succès -->
            <div class="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z" />
                </svg>
            </div>

            <!-- Titre -->
            <h1 class="text-2xl font-bold text-gray-800 mb-2">
                {{ props.title }} 🎉
            </h1>
            <p class="text-gray-600 mb-6">
                {{ props.message }}
            </p>

            <!-- Boutons de partage -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4" v-if="props.link">
                <!-- LinkedIn -->

                <button @click="copyLink" target="_blank"
                    class="flex items-center justify-center bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                    Copier
                </button>

                <a :href="linkedinShare" target="_blank"
                    class="flex items-center justify-center bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                    LinkedIn
                </a>

                <!-- WhatsApp -->
                <a :href="whatsappShare" target="_blank"
                    class="flex items-center justify-center bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition">
                    WhatsApp
                </a>

                <!-- Facebook -->
                <a :href="facebookShare" target="_blank"
                    class="flex items-center justify-center bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition">
                    Facebook
                </a>

                <!-- Instagram (pas d’API direct, on met un lien profil ou copy) -->
                <a href="https://www.instagram.com/" target="_blank"
                    class="flex items-center justify-center bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition">
                    Instagram
                </a>

                <!-- Email -->
                <a :href="mailShare"
                    class="flex items-center justify-center bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition">
                    Email
                </a>
            </div>

            <!-- Bouton retour -->
            <button @click="goBack" v-if="props.path"
                class="mt-8 w-full bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-900 transition">
                Retour à l’accueil
            </button>
        </div>
    </div>
</template>

<script setup>
import { copyInClipInBoard } from "@/utils/general"
import { infoNotify } from "@/utils/notification"
import { ref, watchEffect } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const props = defineProps({
    title: String,
    message: String,
    link: String,
    path: String
})
// URL à partager (tu peux passer la vraie URL de ton enquête)

const linkedinShare = ref('')
const whatsappShare = ref('')
const facebookShare = ref('')
const mailShare = ref('')

watchEffect(() => {
    if (props.link && props.link !== undefined) {
        const surveyUrl = encodeURIComponent(props.link)
        // Génération des liens de partage
        linkedinShare.value = `https://www.linkedin.com/sharing/share-offsite/?url=${surveyUrl}`
        whatsappShare.value = `https://api.whatsapp.com/send?text=Participez à mon enquête : ${surveyUrl}`
        facebookShare.value = `https://www.facebook.com/sharer/sharer.php?u=${surveyUrl}`
        mailShare.value = `mailto:?subject=Nouvelle enquête&body=Participez à mon enquête : ${surveyUrl}`
    }
})

const copyLink = () => {
    copyInClipInBoard(props.link)
    infoNotify('Lien copié')
}

// Retour à l’accueil
const goBack = () => {
    router.push({path: props.path})
}
</script>
