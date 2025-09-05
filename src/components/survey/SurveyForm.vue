<template>
    <div class="max-w-3xl mx-auto p-6">
        <!-- Titre -->
        <input v-model="formSurvey.title" type="text" placeholder="Titre de l'enquête"
            class="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none p-2 mb-4" />

        <!-- Description -->
        <textarea v-model="formSurvey.description" placeholder="Description de l'enquête"
            class="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none"></textarea>


        <!-- Questions -->
        <draggable v-model="formSurvey.questions" @change="onDragChange"
            :group="{ name: 'survey_questions', pull: true, put: true }" class="min-h-[100px] py-2">
            <div v-for="(question, index) in formSurvey.questions" :key="question.question_id"
                class="mb-6 p-4 border rounded-lg shadow-sm bg-white cursor-grab relative">
                <QuestionPanel v-if="question.category === 'question'" @data="getData" @copy="copyQuestion"
                    @delete="deleteQuestion" @save="saveQuestion" :question="question" />
                <TitleDescriptionPanel v-if="question.category === 'title_description'" @data="getData"
                    @copy="copyQuestion" @delete="deleteQuestion" @save="saveQuestion" :question="question" />
                <ImagePanel v-if="question.category === 'image'" @data="getData" @copy="copyQuestion"
                    @delete="deleteQuestion" @save="saveQuestion" :question="question" />
            </div>
        </draggable>


        <!-- Bouton ajouter une question -->
        <button @click="open = !open" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
            Ajouter
        </button>

        <div class="relative">
            <div v-if="open"
                class="absolute mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div class="py-1">
                    <button @click="addQuestionZone(); open = false"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Ajouter une question
                    </button>
                    <button @click="addTitleAndDescriptionZone(); open = false"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Ajouter un title & description
                    </button>
                    <button @click="addImageZone(); open = false"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Ajouter une image
                    </button>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { getUUID } from "@/utils/uuid";
import { onMounted, reactive, ref, toRaw } from "vue";
import { surveyStore } from "@/stores/survey/surveyStore";
const store = surveyStore()
import QuestionPanel from "./question/QuestionPanel.vue";
import TitleDescriptionPanel from "./titleDescription/TitleDescriptionPanel.vue";
import ImagePanel from "./image/ImagePanel.vue";
import { storeToRefs } from "pinia";
import { defaultImage, defaultQuestion, defaultTitleAndDesription } from "@/utils/survey";
const { getSurveyParams, saveFormInstance } = store
const { formSurvey } = storeToRefs(store)
import { VueDraggableNext as draggable } from 'vue-draggable-next';
const open = ref(false)

onMounted(async () => {
    await getSurveyParams()
})


const getData = (data) => {
}

const addQuestionZone = () => {
    formSurvey.value.questions.push({ ...defaultQuestion, question_id: getUUID() });
};

const addTitleAndDescriptionZone = () => {
    formSurvey.value.questions.push({ ...defaultTitleAndDesription, question_id: getUUID() });
};

const addImageZone = () => {
    console.log('{ ...defaultImage, question_id: getUUID() }', { ...defaultImage, question_id: getUUID() })
    formSurvey.value.questions.push({ ...defaultImage, question_id: getUUID() });
};

const copyQuestion = (question) => {
    const newQuestion = { ...question, question_id: getUUID() }
    formSurvey.value.questions.push(newQuestion);
}

const deleteQuestion = (question) => {
    formSurvey.value.questions = formSurvey.value.questions.filter((element) => element.question_id !== question.question_id)
}

const saveQuestion = (question) => {
    const index = formSurvey.value.questions.findIndex(
        (q) => q.question_id === question.question_id
    );
    if (index !== -1) {
        // On met à jour la question avec les nouvelles données
        formSurvey.value.questions[index] = { ...question };
        console.log("formSurvey.value.questions[index]", formSurvey.value.questions[index])
    } else {
        // Si jamais elle n'existe pas (cas rare, mais sécurité)
        formSurvey.value.questions.push(question);
    }
}

setTimeout(() => {
    saveFormInstance()
}, 5000)

async function onDragChange(event) {
    if (event.moved) {
        // let movedQuestion = event.moved.element
        // const columnIndex = _.findIndex(feedbacks.value, (col) =>
        //     _.some(col.feedbacks, { _id: movedFeedback._id })
        // )
        // const targetColumn = feedbacks.value[columnIndex]
        // let newStatus = targetColumn.status._id
        // await updateFeedback(movedFeedback._id, { status: newStatus }, false)
    }
}

</script>
