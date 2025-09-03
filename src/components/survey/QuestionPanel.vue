<template>
    <!-- Texte de la question -->
    <input v-model="question.title" type="text" placeholder="Titre de la question"
        class="w-full border-b border-gray-200 focus:outline-none text-lg p-2 mb-3" />

    <!-- Choix du type -->
    <select @change="changeField" v-model="question.field_libelle" class="border border-gray-300 rounded-lg p-2">
        <option :value="questionType.libelle" :selected="questionType.libelle == 'Réponse courte'"
            v-for="questionType in questionsFieldType">{{ questionType.libelle }}</option>
    </select>

    {{ field_params }}
    <!-- {{ question.type_field }} -->
    <!-- Aperçu -->
    <div class="mt-3">
        <div
            v-if="question.type_field === 'select' || question.type_field === 'radio' || question.type_field === 'checkbox'">
            <div class="grid grid-cols-1">
                <div class="flex items-center space-x-2">
                    <div class="w-full">Valeurs</div>
                    <span class="text-gray-400">Par défaut</span>
                </div>
            </div>
            <div v-for="(option, index) in field_params.options" class="my-2">
                <div class="grid grid-cols-1">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                        <input class="w-full border border-gray-200 focus:outline-none text-lg p-2 mb-3"
                            :value="option.value" type="text" :index="index" @change="setOption($event, index)" />

                        <input type="file" :name="`file_${question.question_id}_${index}`" accept="image/*" class="hidden"
                            @change="handleImageOption($event, index)" />

                        <svg @click="openFileSelector(index)" width="35px" height="35px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" stroke="#2B7FFF">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z"
                                    stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                </path>
                                <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="#2B7FFF"
                                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path
                                    d="M14.35 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V9"
                                    stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                </path>
                                <path
                                    d="M22.3098 3.16996L17.2098 8.26005C16.7098 8.77005 15.2098 8.99996 14.8698 8.66996C14.5298 8.33996 14.7598 6.82999 15.2698 6.31999L20.3599 1.23002C20.6171 0.964804 20.9692 0.812673 21.3386 0.807047C21.7081 0.80142 22.0646 0.942731 22.3298 1.19999C22.5951 1.45725 22.7472 1.8093 22.7529 2.17875C22.7585 2.5482 22.6171 2.90475 22.3599 3.16996H22.3098Z"
                                    stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                </path>
                            </g>
                        </svg>

                        <input v-if="question.type_field == 'select' || question.type_field === 'radio'"
                            class="w-25 border-b border-gray-200 focus:outline-none text-lg p-2 mb-3 w-6 h-6"
                            type="radio" :data-value="index" @change="setDefaultOption($event, index)"
                            :name="`default_option_${question.question_id}`">

                        <input v-if="question.type_field == 'checkbox'"
                            class="w-25 border-b border-gray-200 focus:outline-none text-lg p-2 mb-3 w-6 h-6"
                            type="checkbox" :data-value="index" @change="setDefaultOption($event, index)"
                            :name="`default_option_${question.question_id}`">
                    </div>
                </div>
                     {{ option }}

                <div v-if="option.img" class="mt-4 w-50 h-50 relative">
                    <img :src="option.img" alt="Prévisualisation" class="w-48 h-48 object-cover rounded" />
                    <button @click="deleteImg(index)"
                        class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="w-5 h-5 text-red-500">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>


        <div v-if="question.type_field === 'text'">
            <input type="text" :placeholder="field_params.placeholder"
                class="w-full border-b border-gray-200 focus:outline-none text-lg p-2 mb-3"
                :disabled="field_params.disabled" />
        </div>

        <div v-if="question.type_field === 'textarea'">
            <textarea :rows="field_params.rows" :cols="field_params.cols" :maxlength="field_params.maxlength"
                :placeholder="field_params.placeholder"
                class="w-full border-b border-gray-200 focus:outline-none text-lg p-2 mb-3"
                :disabled="field_params.disabled"></textarea>
        </div>


        <div v-if="question.type_field === 'file'">
            <input disabled type="file" class="w-full border border-gray-200 text-lg p-2 mb-3" />
        </div>

        <div v-if="question.type_field === 'date'">
            <input disabled type="date" class="w-full border border-gray-200 focus:outline-none text-lg p-2 mb-3" />
        </div>

        <div v-if="question.type_field === 'number'">
            <input disabled type="number" class="w-full border border-gray-200 focus:outline-none text-lg p-2 mb-3" />
        </div>


        <div v-if="question.type_field === 'hour'">
            <input disabled type="time" class="w-full border border-gray-200 focus:outline-none text-lg p-2 mb-3" />
        </div>

        <div v-if="question.type_field === 'review'">
            <div class="flex items-center space-x-1">
                <span v-for="n in field_params.rating" :key="n"
                    class="text-2xl cursor-pointer transition-colors text-gray-300">
                    ★
                </span>
            </div>
        </div>

    </div>
    <ActionPanel @copy="copyQuestion" @delete="deleteQuestion" @save="saveQuestion" @setting="editSetting"
        :have_params="fieldHaveSetting" />
    <SettingPanel @close="openSetting = false" :open="openSetting" @save="changeSetting" />
</template>

<script setup lang="ts">

import { surveyStore } from "@/stores/survey/surveyStore";
import { convertToBase64 } from "@/utils/file";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch, watchEffect } from "vue";
const store = surveyStore()
const { logicOpetator, questionsFieldType, questionSelect } = storeToRefs(store)
import ActionPanel from "./ActionPanel.vue";
import SettingPanel from "./elements/SettingPanel.vue";
import { surveyGetFieldFromType, surveyGetFieldParams } from "@/utils/survey";

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
})

let question = reactive({})
let field_params = reactive({})

watchEffect(() => {
    if (props.question && props.question.question_id) {
        Object.entries(props.question).forEach(([key, value]) => {
            question[key] = value
        })

        // Copier toutes les clés de props.question.field_params dans field_params
        if (props.question.field_params) {
            Object.entries(props.question.field_params).forEach(([key, value]) => {
                field_params[key] = value
            })
        }

    }
})

const emit = defineEmits(["data", 'copy', 'delete', 'save'])

const changeField = () => {
    Object.keys(field_params).forEach(key => delete field_params[key])

    question.type_field = surveyGetFieldFromType[question.field_libelle]

    getFieldParams(question.type_field)
}

const getFieldParams = (type_field) => {
    let params = surveyGetFieldParams(type_field)

    // On injecte les nouvelles clés dans l'objet réactif
    Object.entries(params).forEach(([key, value]) => {
        field_params[key] = value
    })
}

const setOption = (event, index) => {
    field_params.options[index].value = event.target.value
    console.log('setDefaultOption', field_params.options)

}

const setDefaultOption = (event, index) => {
    field_params.options[index].default = !field_params.options[index].default
    if (question.type_field == 'select' || question.type_field === 'radio') {
        field_params.options.map((option, i) => {
            if (i != index) {
                option.default = false
            }
        })
    }
    console.log('setDefaultOption', field_params.options)

}

const fileInput = ref(null)
const imageUrl = ref('')

// Ouvre le sélecteur de fichiers
const openFileSelector = (index) => {
    document.querySelector(`input[name='file_${question.question_id}_${index}']`).click()
}

const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']


const handleImageOption = async (event, index) => {
    if (acceptedImageTypes.includes(event.target.files[0].type)) {
        const file = event.target.files[0]
        imageUrl.value = await convertToBase64(file)
        field_params.options[index] = {
            ...field_params.options[index],
            img: imageUrl.value
        }
        console.log(field_params.options)

    } else {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (jpg, jpeg, png, gif).')
    }
}

const deleteImg = (index) => {
    field_params.options[index].img = ''
}

const getQuestion = () => {
    return {
        question_id: question.question_id,
        title: question.title,
        type_field: question.type_field,
        field_libelle: question.field_libelle,
        field_params
    }
}

const copyQuestion = () => {
    let question = getQuestion()
    emit('copy', question)
}

const deleteQuestion = () => {
    let question = getQuestion()
    emit("delete", question)
}

const saveQuestion = () => {
    let question = getQuestion()
    emit("save", question)
}

const openSetting = ref(false)

const editSetting = () => {
    openSetting.value = true
    questionSelect.value.type_field = question.type_field
    console.log('field_params', field_params)
    questionSelect.value.field_params = { ...field_params }
    console.log('field_params', questionSelect.value)

}

const fieldHaveSetting = computed(() => {
    return !(['select', 'radio', 'checkbox', 'hour'].includes(question.type_field))
})

const changeSetting = () => {
    field_params = questionSelect.value.field_params
    openSetting.value = false
}

</script>
