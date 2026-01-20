<template>
    <div class="grid grid-cols-6 gap-4">
        <div class="col-span-1">
            <VueDatePicker v-model="filterDateStatistics.start_date" placeholder="Date début"
                :formats="{ input: 'dd/MM/yyyy' }" auto-apply />
        </div>
        <div class="col-span-1">
            <VueDatePicker v-model="filterDateStatistics.end_date" :min-date="filterDateStatistics.start_date"
                :max-date="filterDateStatistics.end_date" :formats="{ input: 'dd/MM/yyyy' }" placeholder="Date fin"
                auto-apply />
        </div>
        <div class="col-span-1">
            <button @click="$emit('filter')" class=" bg-red-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400">
                Filter
            </button>
        </div>
    </div>
</template>

<script setup>
import { surveyStore } from '@/stores/survey/surveyStore';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
const store = surveyStore()
const { filterDateStatistics } = storeToRefs(store)
watch(() => filterDateStatistics.value.start_date, (newV, oldV) => {
    filterDateStatistics.value.end_date = ''
})
</script>