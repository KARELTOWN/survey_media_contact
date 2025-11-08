<template>
    <v-select label="libelle" :options="topics" taggable v-model="selectTopic" placeholder="Choisir la Thématique">
        <template v-slot:no-options="{ search, searching, loading }">
            <template v-if="loading">
                Chargement en cours...
            </template>
            <template v-if="searching">
                Aucun résultat pour : <em>{{ search }}</em>
            </template>
            <template v-else>
                Aucun élément trouvé
            </template>
        </template>
    </v-select>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";

const emit = defineEmits(["select"])

const store = topicStore()
const {
    topics, newTopic, selectTopic, selectCategory } = storeToRefs(store)
const { createTopic } = store

const { getTopics } = store
import { surveyStore } from '@/stores/survey/surveyStore';
const { formSurvey } = storeToRefs(surveyStore())


onMounted(async () => {
    await handleTopics()
    if (formSurvey.value.topic) {
        selectTopic.value = formSurvey.value.topic
    }
})

watch(() => formSurvey.value.topic, (newValue) => {
    selectTopic.value = newValue
})

watch(() => selectTopic.value, async (newValue) => {
    // selectCategory.value = null
    if ((!newValue?._id && newValue?.libelle !== undefined) || (!newValue?._id && newValue !== null && newValue !== undefined)) {
        await createTopic({ libelle: newValue.libelle || newValue })
        selectTopic.value = newTopic.value
    }
    emit('select', selectTopic.value)
})

const handleTopics = async () => {
    try {
        await getTopics()
    } catch (err) {
    }
}
</script>

<style scoped></style>
