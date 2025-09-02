<template>
    <div class="my-10">
        <SearchPanelCategory @filter="filter" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div v-for="(category, cIndex) in categoryFiltered" :key="cIndex" @click="getCategory(category)" :class="[
            'p-4 border rounded shadow-lg transition cursor-pointer',
            selectedCard === category._id
                ? 'bg-blue-500 text-white shadow-xl'
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
const topic = ref(null)

onMounted(() => {
    topic.value = getLocalStorage('selectTopic')
    if (topic.value) {
        handleCategory(topic.value._id)
    }
})

const handleCategory = async (topic) => {
    try {
        await getCategoryInTopic(topic)
        categoryFiltered.value = topicCategory.value
    } catch (err) {
    }
}

const categoryFiltered = ref([])
const filter = async (category) => {
    categoryFiltered.value = category
}

const selectedCard = ref(null)

const getCategory = (category) => {
    selectedCard.value = category._id
    emit('select', category)
}

</script>

<style scoped></style>
