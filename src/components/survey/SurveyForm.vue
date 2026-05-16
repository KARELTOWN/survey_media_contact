<template>
    <div class="mx-auto max-w-4xl">
        <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <label class="mb-2 block text-sm font-medium text-gray-700">Titre de l'enquete</label>
            <input v-model="formSurvey.title" type="text" placeholder="Ex: Satisfaction - Session Mars 2026"
                class="mb-4 w-full border-b border-gray-300 bg-transparent p-2 text-2xl font-bold focus:outline-none" />

            <label class="mb-2 block text-sm font-medium text-gray-700">Texte d'introduction</label>
            <textarea v-model="formSurvey.description" placeholder="Texte affiche avant les questions"
                class="min-h-[110px] w-full rounded-xl border border-gray-300 p-3 focus:outline-none"></textarea>
        </div>

        <draggable v-model="formSurvey.questions" handle=".drag-handle" @change="onDragChange"
            :group="{ name: 'survey_questions', pull: true, put: true }"
            class="min-h-[100px] space-y-4 py-2">
            <div v-for="question in formSurvey.questions" :key="question.question_id"
                class="relative overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div class="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <button type="button"
                        class="drag-handle flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition hover:bg-gray-100"
                        title="Reorganiser">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
                        </svg>
                    </button>

                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {{ getItemLabel(question) }}
                            </span>
                            <span class="truncate text-sm font-semibold text-gray-800">{{ getItemTitle(question) }}</span>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">{{ getItemSubtitle(question) }}</p>
                    </div>

                    <button type="button" @click="toggleCollapse(question.question_id)"
                        class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
                        :title="isCollapsed(question.question_id) ? 'Ouvrir' : 'Fermer'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform"
                            :class="{ '-rotate-90': isCollapsed(question.question_id) }" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                        </svg>
                    </button>

                    <button type="button" @click="deleteQuestion(question)"
                        class="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50"
                        title="Supprimer ce bloc">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6 7h12M10 11v6M14 11v6M9 7l1-2h4l1 2M8 7l1 12h6l1-12" />
                        </svg>
                    </button>
                </div>

                <div v-show="!isCollapsed(question.question_id)" class="p-4">
                    <QuestionPanel v-if="question.category === 'question'" @data="getData" @copy="copyQuestion"
                        @delete="deleteQuestion" @save="saveQuestion" :question="question" />
                    <TitleDescriptionPanel v-if="question.category === 'title_description'" @data="getData"
                        @copy="copyQuestion" @delete="deleteQuestion" @save="saveQuestion" :question="question" />
                    <ImagePanel v-if="question.category === 'image'" @data="getData" @copy="copyQuestion"
                        @delete="deleteQuestion" @save="saveQuestion" :question="question" />
                </div>
            </div>
        </draggable>

        <div class="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-3">
            <div class="grid gap-3 md:grid-cols-3">
                <button type="button" @click="addQuestionZone"
                    class="rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50">
                    Ajouter une question
                </button>
                <button type="button" @click="addTitleAndDescriptionZone"
                    class="rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50">
                    Ajouter un titre
                </button>
                <button type="button" @click="addImageZone"
                    class="rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50">
                    Ajouter une image
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getUUID } from "@/utils/uuid";
import { onMounted, ref } from "vue";
import { surveyStore } from "@/stores/survey/surveyStore";
import QuestionPanel from "./question/QuestionPanel.vue";
import TitleDescriptionPanel from "./titleDescription/TitleDescriptionPanel.vue";
import ImagePanel from "./image/ImagePanel.vue";
import { storeToRefs } from "pinia";
import { defaultImage, defaultQuestion, defaultTitleAndDesription } from "@/utils/survey";
import { VueDraggableNext as draggable } from 'vue-draggable-next';

const store = surveyStore()
const { getSurveyParams, saveFormInstance } = store
const { formSurvey } = storeToRefs(store)
const collapsedItems = ref({})

onMounted(async () => {
    await getSurveyParams()
})

const getData = () => {
}

const collapseItem = (questionId, value = true) => {
    collapsedItems.value = {
        ...collapsedItems.value,
        [questionId]: value,
    }
}

const isCollapsed = (questionId) => collapsedItems.value[questionId] === true

const toggleCollapse = (questionId) => {
    collapseItem(questionId, !isCollapsed(questionId))
}

const cloneElement = (element, questionId) => {
    return {
        ...element,
        question_id: questionId,
        field_params: element.field_params ? { ...element.field_params } : undefined,
        condition: element.condition ? { ...element.condition } : undefined,
    }
}

const addQuestionZone = () => {
    const questionId = getUUID()
    formSurvey.value.questions.push(cloneElement(defaultQuestion, questionId))
    collapseItem(questionId, false)
}

const addTitleAndDescriptionZone = () => {
    const questionId = getUUID()
    formSurvey.value.questions.push(cloneElement(defaultTitleAndDesription, questionId))
    collapseItem(questionId, false)
}

const addImageZone = () => {
    const questionId = getUUID()
    formSurvey.value.questions.push(cloneElement(defaultImage, questionId))
    collapseItem(questionId, false)
}

const copyQuestion = (question) => {
    const newQuestionId = getUUID()
    formSurvey.value.questions.push(cloneElement(question, newQuestionId))
    collapseItem(newQuestionId, false)
}

const deleteQuestion = (question) => {
    formSurvey.value.questions = formSurvey.value.questions.filter((element) => element.question_id !== question.question_id)
    const updatedCollapsed = { ...collapsedItems.value }
    delete updatedCollapsed[question.question_id]
    collapsedItems.value = updatedCollapsed
}

const saveQuestion = (question) => {
    const index = formSurvey.value.questions.findIndex(
        (q) => q.question_id === question.question_id
    );
    if (index !== -1) {
        formSurvey.value.questions[index] = { ...question };
    } else {
        formSurvey.value.questions.push(question);
    }
}

const getItemLabel = (item) => {
    if (item.category === 'title_description') {
        return 'Titre'
    }
    if (item.category === 'image') {
        return 'Image'
    }
    return item.field_libelle || 'Question'
}

const getItemTitle = (item) => {
    if (item.category === 'image') {
        return item.img ? 'Illustration ajoutee' : 'Bloc image'
    }
    return item.title || 'Element sans titre'
}

const getItemSubtitle = (item) => {
    if (item.category === 'title_description') {
        return item.description || 'Ajoutez un titre et un texte d introduction.'
    }
    if (item.category === 'image') {
        return item.img ? 'Image configuree.' : 'Ajoutez une image pour enrichir le formulaire.'
    }
    return item.required ? 'Reponse obligatoire.' : 'Reponse facultative.'
}

setTimeout(() => {
    saveFormInstance().then(() => {
        console.log('Sauvegarde locale effectuee')
    }).catch((err) => {
        console.error("Erreur de sauvegarde en local", err)
    })
}, 10000)

async function onDragChange() {
}
</script>
