<template>
    <div>
        <div class="col-span-4">
            <input type="text" v-model="search_form.search" @change="filter" placeholder="Rechercher une catégorie"
                class="dark:bg-dark-900 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
        </div>
    </div>

</template>


<script setup>

import { topicStore } from '@/stores/topic/topicStore';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
const store = topicStore()
const { topicCategory } = storeToRefs(store)
const search_form = reactive({
    search: ''
})

const emit = defineEmits(["filter"])

const filter = async () => {
    if (topicCategory.value.length > 0) {

        let filtered = topicCategory.value.filter((e) => {
            return e.libelle.toLowerCase().includes(search_form.search.toLowerCase())
        })
        emit('filter', filtered)
    }
}
</script>
