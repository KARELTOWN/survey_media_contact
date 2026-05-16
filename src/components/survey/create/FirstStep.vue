<template>
    <div class="mx-auto max-w-5xl">
        <div class="mb-8 text-center">
            <h2 class="text-2xl font-semibold text-gray-900">Comment voulez-vous commencer ?</h2>
            <p class="mt-2 text-sm text-gray-500">Choisissez le point de départ le plus simple pour votre nouvelle enquete.</p>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <button v-for="template in starterTemplate" :key="template.id" @click="chooseTemplate(template.id)" type="button"
                :class="[
                    'rounded-2xl border p-6 text-left transition',
                    selectedCard === template.id
                        ? 'border-red-400 bg-red-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-md'
                ]">
                <div class="mb-3 flex items-center justify-between">
                    <span class="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        {{ template.badge }}
                    </span>
                    <span v-if="selectedCard === template.id" class="text-sm font-semibold text-red-600">Selectionne</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">{{ template.libelle }}</h3>
                <p class="mt-2 text-sm text-gray-500">{{ template.description }}</p>
            </button>
        </div>

        <div v-if="displayModels === true" class="mt-10">
            <div class="mb-4 flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Modeles disponibles</h3>
                    <p class="text-sm text-gray-500">Repartez d'un modele existant puis adaptez-le.</p>
                </div>
                <span class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">{{ surveyModels.length }} modele(s)</span>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <button v-for="model in surveyModels" :key="model._id" @click="chooseModel(model)" type="button" :class="[
                    'rounded-2xl border p-5 text-left transition',
                    selectedModel?._id === model?._id
                        ? 'border-red-400 bg-red-50 shadow-md'
                        : 'border-gray-200 bg-white hover:shadow-md'
                ]">
                    <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Modele</div>
                    <h4 class="text-base font-semibold text-gray-900">{{ model.title }}</h4>
                    <div class="mt-2 line-clamp-3 text-sm text-gray-500">{{ model.description || 'Sans description' }}</div>
                </button>
            </div>
        </div>

        <div v-if="(selectedCard === 2 && selectedModel) || selectedCard === 1" class="mt-10 flex justify-center">
            <button @click="createForm" class="rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600">
                Continuer
            </button>
        </div>
    </div>
</template>

<script setup>
import { surveyStore } from '@/stores/survey/surveyStore.js'
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const survey_store = surveyStore()
const { getSurveysModels } = survey_store
const { surveyModels } = storeToRefs(survey_store)

const selectedCard = ref(0)
const selectedModel = ref(null)
const emit = defineEmits(['select'])

const starterTemplate = [
    {
        id: 1,
        badge: 'Rapide',
        libelle: 'Créer à partir de zéro',
        description: 'Parfait pour construire une enquête sur mesure, question par question.',
    },
    {
        id: 2,
        badge: 'Guidé',
        libelle: "Créer à partir d'un modèle existant",
        description: "Idéal pour gagner du temps avec une base déjà structurée.",
    }
]

onMounted(async () => {
    await getSurveysModels()
})

const displayModels = ref(false)

const chooseTemplate = (index) => {
    selectedCard.value = index
    if (selectedCard.value == 2) {
        displayModels.value = true
    }
    else if (selectedCard.value == 1) {
        displayModels.value = false
        selectedModel.value = null
    }
}

const createForm = () => {
    if (selectedModel.value) {
        delete selectedModel.value._id
    }
    emit('select', { template: selectedCard.value, model: selectedModel.value })
}

const chooseModel = (model) => {
    selectedModel.value = model
}
</script>
