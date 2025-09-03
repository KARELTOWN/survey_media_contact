<template>
    <input v-model="question.title" type="text" placeholder="Ecrivez votre titre ici..."
        class="w-full border-b border-gray-200 focus:outline-none text-lg p-2 mb-3" />
    <textarea name="" id="" class="w-full border-b border-gray-200 focus:outline-none text-lg p-2 mb-3" v-model="question.description" rows="4"
        placeholder="Ecrivez votre description ici..."></textarea>
    {{ question }}
    <ActionPanel @copy="copyQuestion" @delete="deleteQuestion" @save="saveQuestion" :have_params="fieldHaveSetting" :required="false"  @condition="setCondition"/>
        <ConditionPanel @save="saveCondition" :open="openCondition" @close="openCondition = false" />

</template>

<script setup lang="ts">

import { surveyStore } from "@/stores/survey/surveyStore";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
const store = surveyStore()
import ActionPanel from "@/components/survey/ActionPanel.vue";
const { questionSelect } = storeToRefs(store)

import _ from 'lodash'
import ConditionPanel from "../question/condition/ConditionPanel.vue";
import { storeToRefs } from "pinia";
const props = defineProps({
    question: {
        type: Object,
        required: true
    }
})

let question = reactive({})


onMounted(() => {
  if (props.question && props.question.question_id) {
    Object.entries(props.question).forEach(([key, value]) => {
      question[key] = value
    })
  }
})

const emit = defineEmits(["data", 'copy', 'delete', 'save'])

const getQuestion = () => {
    return {
        question_id: question.question_id,
        title: question.title,
        category: question.category,
        description: question.description
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


const fieldHaveSetting = ref(false)

const openCondition = ref(false)

const setCondition = () => {
    openCondition.value = true
    questionSelect.value.category = question.category
    questionSelect.value.question_id = question.question_id
}

const saveCondition = () => {
    question.condition = questionSelect.value.condition
    openCondition.value = false
}

</script>
