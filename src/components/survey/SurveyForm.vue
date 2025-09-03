<template>
    <div class="max-w-3xl mx-auto p-6">
        <!-- Titre -->
        <input v-model="formSurvey.title" type="text" placeholder="Titre de l'enquête"
            class="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none p-2 mb-4" />

        <!-- Description -->
        <textarea v-model="formSurvey.description" placeholder="Description de l'enquête"
            class="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none"></textarea>

        <!-- Questions -->
        <div v-for="(question, index) in formSurvey.questions" :key="index"
            class="mb-6 p-4 border rounded-lg shadow-sm bg-white">
            <QuestionPanel @data="getData" @copy="copyQuestion" @delete="deleteQuestion" @save="saveQuestion"
                :question="question" />
        </div>

        <!-- Bouton ajouter une question -->
        <button @click="addQuestion" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
            Ajouter une question
        </button>
    </div>
</template>

<script setup>
import { getUUID } from "@/utils/uuid";
import { onMounted, reactive, ref, toRaw } from "vue";
import { surveyStore } from "@/stores/survey/surveyStore";
const store = surveyStore()
import QuestionPanel from "./QuestionPanel.vue";
import { storeToRefs } from "pinia";
import { defaultQuestion } from "@/utils/survey";
const { getSurveyParams, saveFormInstance } = store
const { formSurvey } = storeToRefs(store)

onMounted(async () => {
    await getSurveyParams()
})


const getData = (data) => {

}

const addQuestion = () => {
    formSurvey.value.questions.push({...defaultQuestion, question_id: getUUID()});
};

const copyQuestion = (question) => {
    const newQuestion = { ...question, question_id: getUUID() }
    formSurvey.value.questions.push(newQuestion);
    saveFormInstance()
}

const deleteQuestion = (question) => {
    formSurvey.value.questions = formSurvey.value.questions.filter((element) => element.question_id !== question.question_id)
}

const saveQuestion = (question) => {
    formSurvey.value.questions.forEach((element, index) => {
        if (element.question_id === question.question_id) {
            formSurvey.value.questions[index] = question
        }
    });
    console.log('formSurvey', formSurvey.value)
    saveFormInstance()
}

const openSetting = () => {
    console.log("Ouvrir les paramètres pour la question :", toRaw(question));
}


</script>
