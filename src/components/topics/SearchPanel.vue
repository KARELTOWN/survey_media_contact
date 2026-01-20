<template>
    <div>
        <div class="col-span-4">
            <input type="text" v-model="search_form.search" @change="filter" placeholder="Rechercher une thématique"
                class="dark:bg-dark-900 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
            <p v-if="search_errors.search" style="color: red">{{ search_errors.search }}</p>
        </div>
    </div>

</template>


<script setup>

import { topicStore } from '@/stores/topic/topicStore';
import { storeToRefs } from 'pinia';
const store = topicStore()
const {
    search_errors, search_form } = storeToRefs(store)
const { filterTopics } = store


const filter = async () => {
    await filterTopics({
        search: search_form.value.search,
    })
}
</script>
