<template>

    <div class="my-10 grid grid-cols-1 md:flex md:justify-start ">
        <SearchPanel class="me-4 mb-2 md:mb-0" />

        <Button @click="openAddModal = true" variant="danger">Ajouter une thématique</Button>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(topic, cIndex) in topics" :key="cIndex" @click="getTopic(topic)" :class="[
            'p-4 border rounded shadow-lg transition cursor-pointer',
            selectedCard === topic._id
                ? 'border-red-500 border-3 text-dark shadow-xl'
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
    <CreateTopic :open="openAddModal" @close="openAddModal = false" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import Pagination from "@/components/pagination/Pagination.vue";
import SearchPanel from '../topics/SearchPanel.vue';
import { getLocalStorage } from '@/utils/storage';

const openAddModal = ref(false)

const emit = defineEmits(["select"])

const store = topicStore()
const {
    topics, total, totalPages, page } = storeToRefs(store)

const { getTopics, filterTopics } = store
import { surveyStore } from '@/stores/survey/surveyStore';
import Button from '../ui/Button.vue';
import CreateTopic from './Modals/CreateTopic.vue';
const { formSurvey } = storeToRefs(surveyStore())

const selectedCard = ref(null)

onMounted(async () => {
    await handleTopics()
    if (formSurvey.value.topic) {
        getTopic(formSurvey.value.topic)
    }
})

watch(() => formSurvey.value.topic, (newV) => {
    
        getTopic(newV)
    
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
