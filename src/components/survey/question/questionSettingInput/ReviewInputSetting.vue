<template>
    <h3 class="text-xl md:text-xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg">Paramètres champ Avis</h3>
    <div class="mb-3">
        <label for="max_size" class="form-label">Nombre d'étoile Maximum</label>
        <input type="number" min="2" max="5" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="max_rating"
            v-model="questionSelect.field_params.rating" />
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
const store = surveyStore()
const { questionSelect } = storeToRefs(store)
</script>