<template>
    <div class="my-10">
        <SearchPanelCategory @filter="filter" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(category, cIndex) in categoryFiltered" :key="cIndex" @click="getCategory(category)" :class="[
            'p-4 border rounded shadow-lg transition cursor-pointer',
            selectedCard === category._id
                ? 'bg-red-500 text-white shadow-xl'
                : 'bg-white hover:shadow-xl'
        ]">
            <h3 class="text-lg font-semibold mb-2">{{ category.libelle }}</h3>
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import SearchPanelCategory from '../topics/SearchPanelCategory.vue';
import { getLocalStorage } from '@/utils/storage';

const emit = defineEmits(["select"])

const store = topicStore()
const {
    topicCategory, selectTopic } = storeToRefs(store)

const { getCategoryInTopic } = store

import { surveyStore } from '@/stores/survey/surveyStore';
const { formSurvey } = storeToRefs(surveyStore())

const selectedCard = ref(null)


const getCategory = (category) => {
    selectedCard.value = category._id
                console.log('selectTopic', selectedCard.value)

    emit('select', category)
}


const handleCategory = async (topic) => {
    try {
        await getCategoryInTopic(topic)
        categoryFiltered.value = topicCategory.value

        if (formSurvey.value.category) {
            getCategory(formSurvey.value.category)
        }
    } catch (err) {
    }
}

watchEffect(()=> {
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
