<template>
    <div class="my-10 grid grid-cols-1 md:flex md:justify-start ">
        <SearchPanelCategory @filter="filter" class="me-4 mb-2 md:mb-0" />

        <Button @click="openAddModal = true" variant="danger">Ajouter une catégorie</Button>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(category, cIndex) in categoryFiltered" :key="cIndex" @click="getCategory(category)" :class="[
            'p-4 border rounded shadow-lg transition cursor-pointer',
            selectedCard === category._id
                ? 'bg-brand-500 text-white shadow-xl'
                : 'bg-white hover:shadow-xl'
        ]">
            <h3 class="text-lg font-semibold mb-2">{{ category.libelle }}</h3>
        </div>
    </div>
    <CreateCategory :open="openAddModal" @close="openAddModal = false" />

</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import SearchPanelCategory from '../topics/SearchPanelCategory.vue';
import { getLocalStorage } from '@/utils/storage';
const openAddModal = ref(false)
const emit = defineEmits(["select"])

const store = topicStore()
const {
    topicCategory, selectTopic, selectCategory } = storeToRefs(store)

const { getCategoryInTopic } = store

import { surveyStore } from '@/stores/survey/surveyStore';
import CreateCategory from './Modals/CreateCategory.vue';
import Button from '../ui/Button.vue';
const { formSurvey } = storeToRefs(surveyStore())

const selectedCard = ref(null)


const getCategory = (category) => {
    selectedCard.value = category._id
    emit('select', category)
}


const handleCategory = async (topic) => {
    try {
        await getCategoryInTopic(topic)
        categoryFiltered.value = topicCategory.value

        if (formSurvey.value.category) {
            let find = topicCategory.value.find((e) => (e.topic_id == selectTopic.value._id && e._id == formSurvey.value.category._id))
            if (find && find !== undefined) {
                selectCategory.value = null
                getCategory(formSurvey.value.category)
            }
        }
    } catch (err) {
    }
}

watchEffect(() => {
    if (selectTopic.value) {
        handleCategory(selectTopic.value._id)
    }
})



const categoryFiltered = ref([])
const filter = async (category) => {
    categoryFiltered.value = category
}


</script>

<style scoped></style>
