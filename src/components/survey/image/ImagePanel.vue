<template>
    <input type="file" :name="`file_${question.question_id}`" accept="image/*" class="hidden"
        @change="handleImageOption($event)" />

    <svg @click="openFileSelector()" width="60px" height="60px" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg" stroke="#2B7FFF">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path
                d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z"
                stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            </path>
            <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="#2B7FFF" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"></path>
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

    <div v-if="question.img" class="mt-4 w-50 h-50 relative">
        <img :src="question.img" alt="Prévisualisation" class="w-48 h-48 object-cover rounded" />
        <button @click="deleteImg()"
            class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-red-500">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>

    <ActionPanel @copy="copyQuestion" @delete="deleteQuestion" @save="saveQuestion" @setting="editSetting"
        :have_params="fieldHaveSetting" :required="false" @condition="setCondition" />
    <ConditionPanel @save="saveCondition" :open="openCondition" @close="openCondition = false" />
</template>

<script setup lang="ts">

import { surveyStore } from "@/stores/survey/surveyStore";
import { convertToBase64, convertToTempURL } from "@/utils/file";
import { onMounted, reactive, ref, watch, watchEffect } from "vue";
const store = surveyStore()

const { questionSelect } = storeToRefs(store)


import ActionPanel from "@/components/survey/ActionPanel.vue";
import { storeToRefs } from "pinia";
import ConditionPanel from "../question/condition/ConditionPanel.vue";
const props = defineProps({
    question: {
        type: Object,
        required: true
    }
})


let question = reactive({})

onMounted(() => {
    if (props.question && props.question.question_id) {
        console.log('props.question image', props.question)
        Object.entries(props.question).forEach(([key, value]) => {
            question[key] = value
        })
    }
})

const emit = defineEmits(["data", 'copy', 'delete', 'save'])

const fileInput = ref(null)
const imageUrl = ref('')

// Ouvre le sélecteur de fichiers
const openFileSelector = () => {
    document.querySelector(`input[name='file_${question.question_id}']`).click()
}

const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']


const handleImageOption = async (event) => {
    if (acceptedImageTypes.includes(event.target.files[0].type)) {
        const file = event.target.files[0]
        imageUrl.value = await convertToBase64(file)
        question.img = imageUrl.value
    } else {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (jpg, jpeg, png, gif).')
    }
}

const deleteImg = () => {
    question.img = ''
}

const getQuestion = () => {
    return {
        question_id: question.question_id,
        category: question.category,
        img: question.img,
        condition: question.condition
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


watch(question,
    () => saveQuestion(),
    { deep: true }
)

const saveQuestion = () => {
    let question = getQuestion()
    emit("save", question)
}

const openCondition = ref(false)

const setCondition = () => {
    openCondition.value = true
    questionSelect.value.category = question.category
    questionSelect.value.question_id = question.question_id
    questionSelect.value.condition = question.condition
}

const saveCondition = () => {
    question.condition = questionSelect.value.condition
    openCondition.value = false
}

const fieldHaveSetting = ref(false
)

</script>
