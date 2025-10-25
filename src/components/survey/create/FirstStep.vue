<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(template) in starterTemplate" :key="cIndex" @click="chooseTemplate(template.id)" :class="[
            'p-4 border rounded shadow-lg transition cursor-pointer',
            selectedCard === template.id
                ? 'border-red-500 border-3 text-dark shadow-xl'
                : 'bg-white hover:shadow-xl'
        ]">
            <h3 class="text-lg font-semibold mb-2">{{ template.libelle }}</h3>
        </div>
    </div>
    <div v-if="displayModels === true" class="p-4 mt-6 ">
        <div class="py-2 font-extrabold text-center">Choisissez un modèle de Template</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(model, index) in surveyModels" :key="index" @click="chooseModel(model)" :class="[
                'p-4 border rounded shadow-lg transition cursor-pointer',
                selectedModel?._id === model?._id
                    ? 'border-red-500 border-3 text-dark shadow-xl'
                    : 'bg-white hover:shadow-xl'
            ]">
                <h3 class="text-lg font-semibold mb-2">{{ model.title }}</h3>
                <div class="text-gray-500 py-2">{{ model.description }}</div>
            </div>
        </div>
    </div>

    <div v-if="(selectedCard === 2 && selectedModel) || selectedCard === 1" class="text-center mt-8">
        <button @click="createForm" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Commencer
        </button>
    </div>

</template>

<script setup>
import { surveyStore } from '@/stores/survey/surveyStore.js'
import { storeToRefs } from 'pinia';
const survey_store = surveyStore()
const { getSurveysModels } = survey_store
const { surveyModels } = storeToRefs(survey_store)
import { onMounted, ref } from 'vue';
const selectedCard = ref(0)
const selectedModel = ref(null)
const emit = defineEmits(['select'])
const starterTemplate = [{ id: 1, libelle: "Créer à partir de zéro" }, { id: 2, libelle: "Créer à partir d'un modèle existant" }]
onMounted(async () => {
    await getSurveysModels()
    console.log('surveymodels', surveyModels.value)
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