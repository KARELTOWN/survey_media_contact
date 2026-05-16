<template>
    <div class="space-y-6">
        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div class="mb-5 flex flex-col gap-1">
                <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
                <p class="text-sm text-gray-500">{{ helper }}</p>
            </div>

            <FileInputSetting v-if="questionSelect.type_field == 'file'" />
            <TextareaInputSetting v-if="questionSelect.type_field == 'textarea'" />
            <TextInputSetting v-if="questionSelect.type_field == 'text'" />
            <ReviewInputSetting v-if="questionSelect.type_field == 'review'" />
            <RangeInputSetting v-if="questionSelect.type_field == 'range'" />
            <NumberInputSetting v-if="questionSelect.type_field == 'number'" />
            <DateInputSetting v-if="questionSelect.type_field == 'date'" />
        </div>

        <div class="flex justify-end border-t border-gray-100 pt-4">
            <button @click="$emit('save')"
                class="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
                Enregistrer
            </button>
        </div>
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import FileInputSetting from "../questionSettingInput/FileInputSetting.vue";
import { storeToRefs } from "pinia";
import TextareaInputSetting from "../questionSettingInput/TextareaInputSetting.vue";
import TextInputSetting from "../questionSettingInput/TextInputSetting.vue";
import ReviewInputSetting from "../questionSettingInput/ReviewInputSetting.vue";
import RangeInputSetting from "../questionSettingInput/RangeInputSetting.vue";
import NumberInputSetting from "../questionSettingInput/NumberInputSetting.vue";
import DateInputSetting from "../questionSettingInput/DateInputSetting.vue";
import { computed } from "vue";

defineEmits(["save"])
const store = surveyStore()
const { questionSelect } = storeToRefs(store)

const labels = {
    text: 'Reponse courte',
    textarea: 'Paragraphe',
    file: 'Fichier',
    review: 'Avis',
    range: 'Echelle de satisfaction',
    number: 'Nombre',
    date: 'Date',
}

const title = computed(() => `Parametres champ ${labels[questionSelect.value.type_field] || 'question'}`)
const helper = computed(() => {
    if (questionSelect.value.type_field === 'file') return 'Controlez le type, la taille et le nombre de fichiers acceptes.'
    if (questionSelect.value.type_field === 'range') return 'Definissez les bornes et les libelles de votre echelle.'
    return 'Configurez les contraintes et le texte d aide de ce champ.'
})
</script>
