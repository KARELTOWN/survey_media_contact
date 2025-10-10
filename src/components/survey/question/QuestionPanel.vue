<template>
    <!-- Texte de la question -->
    <input v-model="question.title" type="text" placeholder="Ecrivez ici la question"
        class="w-full border-b border-gray-200 focus:outline-none text-lg p-2 mb-3" />

    <!-- Choix du type -->
    <div class="my-3">
        <label for="" class="me-4 font-bold">Type de champ</label>
        <select @change="changeField" v-model="question.field_libelle"
            class="mt-2 md:mt-0 border border-gray-300 rounded-lg p-2">
            <option :value="questionType.libelle" :selected="questionType.libelle == 'Réponse courte'"
                v-for="questionType in questionsFieldType">{{ questionType.libelle }}</option>
        </select>
    </div>


    <!-- Aperçu -->

    <div class="my-5">
        <label for="" class="me-4 font-bold"
            v-if="question.type_field !== 'select' && question.type_field !== 'radio' && question.type_field !== 'checkbox'">Aperçu
            du champ</label>
        <div
            v-if="question.type_field === 'select' || question.type_field === 'radio' || question.type_field === 'checkbox'">
            <div class="grid grid-cols-6">
                <div class="col-span-5">
                    <div class="w-full">Liste des Options</div>
                </div>
            </div>
            <div v-for="(option, index) in field_params.options" class="my-2">
                <div class="grid grid-cols-6 gap-4">
                    <div class="col-span-1 flex flex-rows items-center gap-5">
                        <AddIcon class="tooltip scale-300 md:scale-150" @click="addOption()"><span
                                class="tooltiptext">Ajouter une
                                option</span></AddIcon>
                        <DeleteIcon class="tooltip scale-300 md:scale-150" @click="deleleOption(index)"><span
                                class="tooltiptext">Supprimer l'option</span></DeleteIcon>
                    </div>

                    <div class="col-span-3">
                        <input class="w-full border border-gray-200 focus:outline-none text-lg p-2 mb-3"
                            :value="option.value" type="text" :index="index" @change="setOption($event, index)" />
                    </div>

                    <div class="col-span-1 flex flex-rows items-center">
                        <div class="me-5">
                            <input type="file" :name="`file_${question.question_id}_${index}`" accept="image/*"
                                class="hidden" @change="handleImageOption($event, index)" />

                            <div class="tooltip">
                                <svg @click="openFileSelector(index)" v-if="question.type_field !== 'select'"
                                    width="35px" height="35px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" stroke="#2B7FFF">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z"
                                            stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round">
                                        </path>
                                        <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899"
                                            stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                        <path
                                            d="M14.35 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V9"
                                            stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round">
                                        </path>
                                        <path
                                            d="M22.3098 3.16996L17.2098 8.26005C16.7098 8.77005 15.2098 8.99996 14.8698 8.66996C14.5298 8.33996 14.7598 6.82999 15.2698 6.31999L20.3599 1.23002C20.6171 0.964804 20.9692 0.812673 21.3386 0.807047C21.7081 0.80142 22.0646 0.942731 22.3298 1.19999C22.5951 1.45725 22.7472 1.8093 22.7529 2.17875C22.7585 2.5482 22.6171 2.90475 22.3599 3.16996H22.3098Z"
                                            stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round">
                                        </path>
                                    </g>
                                </svg>
                                <span class="tooltiptext">Ajouter une image à l'option</span>

                            </div>
                        </div>


                        <input v-if="question.type_field == 'select' || question.type_field === 'radio'"
                            class=" scale-200 md:scale-100 border-b border-gray-200 focus:outline-none text-lg p-2 mb-3 w-10 h-10"
                            type="radio" :data-value="index" @change="setDefaultOption($event, index)"
                            :name="`default_option_${question.question_id}`">

                        <input v-if="question.type_field == 'checkbox'"
                            class="scale-200 md:scale-100 border-b border-gray-200 focus:outline-none text-lg p-2 mb-3 w-10 h-10"
                            type="checkbox" :data-value="index" @change="setDefaultOption($event, index)"
                            :name="`default_option_${question.question_id}`">

                    </div>



                </div>


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
        @condition="setCondition" :have_params="fieldHaveSetting" @required="requiredQuestion" :have_required="true"
        :required="question.required" />
    <SettingPanel @close="openSetting = false" :open="openSetting" @save="changeSetting" />
    <ConditionPanel @save="saveCondition" :open="openCondition" @close="openCondition = false" />
</template>

<script setup>

import { surveyStore } from "@/stores/survey/surveyStore";
import { convertToBase64 } from "@/utils/file";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
const store = surveyStore()
const { questionsFieldType, questionSelect } = storeToRefs(store)
import ActionPanel from "@/components/survey/ActionPanel.vue";
import SettingPanel from "./questionSettingPanel/SettingPanel.vue";
import { surveyGetFieldFromType, surveyGetFieldParams } from "@/utils/survey";
import ConditionPanel from "./condition/ConditionPanel.vue";
import _ from 'lodash'
import AddIcon from "@/icons/AddIcon.vue";
import DeleteIcon from "@/icons/DeleteIcon.vue";
import { infoNotify } from "@/utils/notification";
const props = defineProps({
    question: {
        type: Object,
        required: true
    }
})

let question = reactive({})
let field_params = reactive({})


onMounted(() => {
    if (props.question && props.question.question_id) {

        Object.entries(props.question).forEach(([key, value]) => {
            question[key] = value
        })

        if (props.question.field_params) {
            Object.entries(props.question.field_params).forEach(([key, value]) => {
                field_params[key] = value
            })
        }
    }
})


// watchEffect(() => {
//     if (props.question && props.question.question_id) {
//         Object.entries(props.question).forEach(([key, value]) => {
//             question[key] = value
//         })

//         // Copier toutes les clés de props.question.field_params dans field_params
//         if (props.question.field_params) {
//             Object.entries(props.question.field_params).forEach(([key, value]) => {
//                 field_params[key] = value
//             })
//         }

//     }
// })

const emit = defineEmits(["data", 'copy', 'delete', 'save'])

const changeField = () => {
    Object.keys(field_params).forEach(key => delete field_params[key])
    question.type_field = surveyGetFieldFromType(question.field_libelle)
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
        category: question.category,
        field_libelle: question.field_libelle,
        condition: question.condition,
        field_params,
        required: question.required,
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

const requiredQuestion = (value) => {
    question.required = value
}

watch(question,
    () => {
        saveQuestion()
    },
    { deep: true }
)

const saveQuestion = () => {
    let question = getQuestion()
    emit("save", question)
}

const openSetting = ref(false)

const editSetting = () => {
    openSetting.value = true
    questionSelect.value.type_field = question.type_field
    questionSelect.value.field_params = { ...field_params }
}

const openCondition = ref(false)

const setCondition = () => {
    openCondition.value = true
    questionSelect.value.category = question.category
    questionSelect.value.question_id = question.question_id
    questionSelect.value.type_field = question.type_field
    questionSelect.value.field_params = { ...field_params }
    questionSelect.value.condition = { ...question.condition }
}


const fieldHaveSetting = computed(() => {
    return !(['select', 'radio', 'checkbox', 'hour', 'date'].includes(question.type_field))
})

const changeSetting = () => {
    field_params = questionSelect.value.field_params
    question.field_params = { ...field_params }
    openSetting.value = false
}

const saveCondition = () => {
    let conditions = questionSelect.value.condition
    question.condition = { ...conditions }
    openCondition.value = false
}

const addOption = () => {
    field_params.options.push({ value: '', img: '', default: false })
}

const deleleOption = (index) => {
    if (field_params.options.length == 1) {
        infoNotify('Impossible de supprimer le dernier élément')
        return
    }
    field_params.options.splice(index, 1)

}

</script>
