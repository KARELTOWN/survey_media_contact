<template>
    <v-select label="libelle" :options="category" taggable :clearable="true" v-model="selectCategory"
        placeholder="Choisir la categorie">
        <template v-slot:no-options="{ search, searching, loading }">
            <template v-if="loading">
                Chargement en cours...
            </template>
            <template v-else-if="searching">
                Aucun resultat pour : <em>{{ search }}</em>
            </template>
            <template v-else>
                Aucune categorie trouvee
            </template>
        </template>
    </v-select>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import { surveyStore } from '@/stores/survey/surveyStore';

const emit = defineEmits(["select"])
const store = topicStore()
const { category, newCategory, selectCategory } = storeToRefs(store)
const { getAllCategory, createCategory } = store
const { formSurvey } = storeToRefs(surveyStore())

const getCategoryId = (value) => value?._id || value?.id || value || ''

watch(() => selectCategory.value, async (newValue) => {
    if (newValue === null || newValue === undefined || newValue === '') {
        emit('select', null)
        return
    }
    if ((!newValue?._id && newValue?.libelle !== undefined) || (!newValue?._id && newValue !== null && newValue !== undefined)) {
        await createCategory({ libelle: newValue.libelle || newValue })
        selectCategory.value = newCategory.value
    }
    if (selectCategory.value) {
        emit('select', selectCategory.value)
    }
})

onMounted(async () => {
    await getAllCategory()
    const categoryId = getCategoryId(formSurvey.value.category) || getCategoryId(formSurvey.value.category_id)
    if (categoryId || formSurvey.value.category) {
        const found = category.value.find((item) => item._id === categoryId)
        selectCategory.value = found || formSurvey.value.category || formSurvey.value.category_id
    }
})

watch(() => formSurvey.value.category, (newValue) => {
    if (newValue) {
        const categoryId = getCategoryId(newValue)
        selectCategory.value = category.value.find((item) => item._id === categoryId) || newValue
    }
})
</script>
