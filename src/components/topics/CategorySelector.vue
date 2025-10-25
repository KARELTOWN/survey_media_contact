<template>
    <v-select label="libelle" :options="topicCategory" taggable v-model="selectCategory"
        placeholder="Choisir la Catégorie" :disabled="!selectTopic?._id"></v-select>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
const emit = defineEmits(["select"])

const store = topicStore()
const {
    topicCategory, selectTopic, newCategory, selectCategory } = storeToRefs(store)

const { getCategoryInTopic, createCategory } = store

import { surveyStore } from '@/stores/survey/surveyStore';
const { formSurvey } = storeToRefs(surveyStore())

const getCategory = () => {
            console.log('formSurvey.value.category', formSurvey.value)

    if (formSurvey.value.category) {
        let find = topicCategory.value.find((e) => (e.topic_id == selectTopic.value?._id && e._id == formSurvey.value?.category?._id))
        if (find && find !== undefined) {
            selectCategory.value = formSurvey.value.category
        }
        else {
            selectCategory.value = null
        }
    }
}

const handleCategory = async (topic) => {
    try {
        await getCategoryInTopic(topic)
        getCategory()
    } catch (err) {
    }
}

watch(() => selectCategory.value, async (newValue) => {
    if ((!newValue?._id && newValue?.libelle !== undefined) || (!newValue?._id && newValue !== null && newValue !== undefined)) {
        await createCategory({ libelle: newValue.libelle || newValue, topic_id: selectTopic.value._id })
        selectCategory.value = newCategory.value
    }
    emit('select', selectCategory.value)
})


watchEffect(() => {
    if (selectTopic.value?._id) {
        handleCategory(selectTopic.value?._id)
    }
    else {
        selectCategory.value = null
    }
})
</script>

<style scoped></style>
