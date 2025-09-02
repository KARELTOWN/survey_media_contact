<template>
    <div class="max-w-3xl mx-auto p-6">
        <!-- Titre -->
        <input v-model="form.title" type="text" placeholder="Titre de l'enquête"
            class="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none p-2 mb-4" />

        <!-- Description -->
        <textarea v-model="form.description" placeholder="Description de l'enquête"
            class="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none"></textarea>

        <!-- Questions -->
        <div v-for="(question, index) in form.questions" :key="index"
            class="mb-6 p-4 border rounded-lg shadow-sm bg-white">
            <QuestionPanel @data="getData" />
        </div>

        <!-- Bouton ajouter une question -->
        <button @click="addQuestion" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
            ➕ Ajouter une question
        </button>
    </div>
</template>

<script setup>
import { getUUID } from "@/utils/uuid";
import { onMounted, reactive, ref } from "vue";
import { surveyStore } from "@/stores/survey/surveyStore";
const store = surveyStore()
import QuestionPanel from "./elements/QuestionPanel.vue";
const { getSurveyParams } = store

onMounted(async () => {
    await getSurveyParams()
})

const form = ref({
    title: "",
    description: "",
    questions: [
        {}
    ],
});

const getData = (data) => {

}

const addQuestion = () => {
    form.value.questions.push({
        label: "",
        type: "text",
    });
};
</script>
