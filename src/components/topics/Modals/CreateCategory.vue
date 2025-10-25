<template>
    <Modal v-if="isOpen">
        <template #body>
            <div
                class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <h5 class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                    {{ selectCategory !== null ? "Modiifer la catégorie" : "Ajouter une catégorie"}} 
                </h5>
                <form class="flex flex-col custom-scrollbar max-h-[458px] overflow-y-auto p-2"
                    @submit.prevent="handleSubmit">
                    <div class="mt-8">
                        <div class="mb-3">
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Thématique
                            </label>
                            <v-select label="libelle" :reduce="topics => topics._id" :options="topics" taggable
                                v-model="form.topic_id" placeholder="Choisir la thématique"></v-select>
                            <p v-if="errors.topic_id" style="color: red">{{ errors.topic_id }}</p>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Libelle de la catégorie
                            </label>
                            <input v-model="form.libelle" type="text"
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                            <p v-if="errors.libelle" style="color: red">{{ errors.libelle }}</p>

                        </div>
                    </div>

                    <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <button @click="closeModal"
                            class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                            Fermer
                        </button>

                        <button type="submit" :disabled="disableBtn"
                            class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto">
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </template>
    </Modal>
</template>

<script setup>

import { ref, onMounted, watchEffect, watch } from 'vue'
import Modal from '@/components/profile/Modal.vue'

import { topicStore } from "@/stores/topic/topicStore";
import { storeToRefs } from "pinia";
import { reactive } from 'vue';
const store = topicStore()
const { errors,
    topicSuccess, topics, selectCategory } = storeToRefs(store)
const { createCategory, updateCategory } = store
const isOpen = ref(false)
const libelle = ref('')
const props = defineProps({
    open: {
        type: Boolean,
        required: true
    }
})

const form = reactive({
    libelle: '',
    topic_id: ''
})

const emits = defineEmits(['close'])

onMounted(() => {
    errors.value = {}
})

watch(() => selectCategory.value, (newValue) => {
    form.libelle = newValue?.libelle
    form.topic_id = newValue?.topic_id?._id

})

watchEffect(() => {
    if (props.open && props.open !== undefined) {
        isOpen.value = props.open
    }
})

const closeModal = () => {
    isOpen.value = false
    emits('close')
    resetModalFields()
}

const resetModalFields = () => {
    form.libelle = ''
    form.topic_id = ''
}

const disableBtn = ref(false)

const handleSubmit = async () => {
    try {
        disableBtn.value = true
        if (selectCategory.value == null) {
            await createCategory({ ...form })
        }
        else if (selectCategory.value !== null && selectCategory.value?._id) {
            await updateCategory({ ...form, category_id: selectCategory.value?._id })
        }
        disableBtn.value = false

        if (topicSuccess.value === true) {
            closeModal()
        }

    } catch (err) {
        disableBtn.value = false
    }
}
</script>
