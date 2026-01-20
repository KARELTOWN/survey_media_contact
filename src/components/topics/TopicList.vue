<template>

    <div class="my-10 grid grid-cols-1 md:flex md:justify-start ">
        <SearchPanel class="me-4 mb-2 md:mb-0" />
        <Button @click="addTopic" variant="danger">Ajouter une thématique</Button>
    </div>
    <div>
        <table class="min-w-full">
            <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                        <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Libelle</p>
                    </th>
                    <th class="px-5 py-3 text-right w-3/11 sm:px-6">
                        <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</p>
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(topic, cIndex) in topics" :key="cIndex"
                    class="border-t border-gray-100 dark:border-gray-800">
                    <td class="px-5 py-4 sm:px-6"> {{ topic.libelle }} </td>
                    <td class="px-5 py-4 sm:px-6">
                        <div class="flex justify-end gap-5 sm:gap-4 md:gap-5 items-center action-panel">
                            <Button variant="danger" size="xs" :start-icon="TrashIcon"
                                @click="destroy(topic._id)"></Button>
                            <Button variant="primary" size="xs" :start-icon="PlugInIcon"
                                @click="editTopic(topic)"></Button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


    <div class="grid grid-cols-2 my-10">
        <div>
            <Pagination :paginator="topics" :current_page="page" :totalPages="totalPages" @page-change="fetchNext" />
        </div>
        <div>
            <strong>Total : </strong> {{ total }}
        </div>

    </div>
    <CreateTopic :open="openAddModal" @close="closeTopicModal" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import Pagination from "@/components/pagination/Pagination.vue";
import SearchPanel from '../topics/SearchPanel.vue';

const openAddModal = ref(false)

const emit = defineEmits(["select"])

const store = topicStore()
const { destroyTopic } = store
const {
    topics, total, totalPages, page, selectTopic } = storeToRefs(store)

const { getTopics } = store
import { surveyStore } from '@/stores/survey/surveyStore';
import CreateTopic from './Modals/CreateTopic.vue';
import Button from '../ui/Button.vue';
import TrashIcon from '../../icons/TrashIcon.vue'
import PlugInIcon from '../../icons/PlugInIcon.vue'
import Swal from 'sweetalert2';
const { formSurvey } = storeToRefs(surveyStore())

onMounted(async () => {
    await handleTopics()
})


const handleTopics = async () => {
    try {
        await getTopics()
    } catch (err) {
    }
}

const fetchNext = async (nextpage) => {
    page.value = nextpage
    await getTopics()
}

const destroy = async (topic_id) => {
    Swal.fire({
        title: "Voulez-vous supprimer cette thématique ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await destroyTopic(topic_id)
        }
    });
}

const addTopic = () => {
    openAddModal.value = true
    selectTopic.value = null
}

const editTopic = (topic) => {
    openAddModal.value = true
    selectTopic.value = topic
}

const closeTopicModal = () => {
    openAddModal.value = false
    selectTopic.value = null
}
</script>

<style scoped></style>
