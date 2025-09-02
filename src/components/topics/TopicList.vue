<template>
    <div class="my-10">
        <SearchPanel />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(topic, cIndex) in topics" :key="cIndex" @click="getTopic(topic)" :class="[
            'p-4 border rounded shadow-lg transition cursor-pointer',
            selectedCard === topic._id
                ? 'bg-blue-500 text-white shadow-xl'
                : 'bg-white hover:shadow-xl'
        ]">
            <h3 class="text-lg font-semibold mb-2">{{ topic.libelle }}</h3>
        </div>
    </div>

    <div class="grid grid-cols-2 my-10">
        <div>
            <Pagination :paginator="topics" :current_page="page" :totalPages="totalPages" @page-change="fetchNext" />
        </div>
        <div>
            <strong>Total : </strong> {{ total }}
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import Pagination from "@/components/pagination/Pagination.vue";
import SearchPanel from '../topics/SearchPanel.vue';
import { getLocalStorage } from '@/utils/storage';

const emit = defineEmits(["select"])

const store = topicStore()
const {
    topics, total, totalPages, page } = storeToRefs(store)

const { getTopics, filterTopics } = store

const selectedCard = ref(null)

onMounted(async () => {
    await handleTopics()
    let topicExist = getLocalStorage('selectTopic')
    if (topicExist) {
        selectedCard.value = topicExist._id
    }
})


const handleTopics = async () => {
    try {
        await getTopics()
    } catch (err) {
    }
}

const getTopic = (topic) => {
    selectedCard.value = topic._id
    emit('select', topic)
};

const fetchNext = async (nextpage) => {
    page.value = nextpage
    await getTopics()
}


</script>

<style scoped></style>
