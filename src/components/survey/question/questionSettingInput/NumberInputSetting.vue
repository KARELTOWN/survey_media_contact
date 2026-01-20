<template>
    <h3 class="text-xl md:text-xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg">Paramètres champ Nombre</h3>
    <div class="mb-3">
        <label for="max_size" class="form-label">Minimum</label>
        <input type="number" min="0" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="max_rating" v-model="questionSelect.field_params.min" />
    </div>
    <div class="mb-3">
        <label for="max_size" class="form-label">Maximum</label>
        <input type="number" :min="questionSelect.field_params.min" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="max_rating"
            v-model="questionSelect.field_params.max" />
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
const store = surveyStore()
const { questionSelect } = storeToRefs(store)
</script>