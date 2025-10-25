<template>
    <div class="my-10 grid grid-cols-1 md:flex md:justify-start ">
        <SearchPanelCategory class="me-4 mb-2 md:mb-0" />
        <Button @click="addCateg" variant="danger">Ajouter une catégorie</Button>
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
                <tr v-for="(categ, cIndex) in category" :key="cIndex"
                    class="border-t border-gray-100 dark:border-gray-800">
                    <td class="px-5 py-4 sm:px-6"> {{ categ.libelle }} </td>
                    <td class="px-5 py-4 sm:px-6"> {{ categ.topic_id?.libelle }} </td>
                    <td class="px-5 py-4 sm:px-6">
                        <div class="flex justify-end gap-5 sm:gap-4 md:gap-5 items-center action-panel">
                            <Button variant="danger" size="xs" :start-icon="TrashIcon"
                                @click="destroy(categ._id)"></Button>
                            <Button variant="primary" size="xs" :start-icon="PlugInIcon"
                                @click="editCateg(categ)"></Button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="grid grid-cols-2 my-10">
        <div>
            <Pagination :paginator="category" :current_page="pageCateg" :totalPages="totalPagesCateg" @page-change="fetchNext" />
        </div>
        <div>
            <strong>Total : </strong> {{ totalCateg }}
        </div>

    </div>
    <CreateCategory :open="openAddModal" @close="closeTopicModal" />

</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import SearchPanelCategory from '../topics/SearchPanelCategory.vue';
const openAddModal = ref(false)
const emit = defineEmits(["select"])
import Pagination from "@/components/pagination/Pagination.vue";
import TrashIcon from '../../icons/TrashIcon.vue'
import PlugInIcon from '../../icons/PlugInIcon.vue'
const store = topicStore()
const {
    category, totalCateg, totalPagesCateg, pageCateg, selectCategory } = storeToRefs(store)

const { getAllCategory, destroyCategory } = store

import CreateCategory from './Modals/CreateCategory.vue';
import Button from '../ui/Button.vue';
import Swal from 'sweetalert2';

onMounted(()=> {
    handleCategory()
})

const handleCategory = async () => {
    try {
        await getAllCategory()
    } catch (err) {
    }
}

const destroy = async (categ_id) => {
    Swal.fire({
        title: "Voulez-vous supprimer cette catégorie ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await destroyCategory(categ_id)
        }
    });
}


const addCateg = () => {
    openAddModal.value = true
    selectCategory.value = null
}

const editCateg = (categ) => {
    openAddModal.value = true
    selectCategory.value = categ
}

const closeTopicModal = () => {
    openAddModal.value = false
    selectCategory.value = null
}

</script>

<style scoped></style>
