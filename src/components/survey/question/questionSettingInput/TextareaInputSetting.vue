<template>
    <h3 class="text-xl md:text-xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg">Paramètres champ Paragraphe</h3>
    <div class="mb-3">
        <label for="max_size" class="form-label">Taille maximale de caractère</label>
        <input type="number" min="1" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="max_caracter"
            v-model="questionSelect.field_params.maxlength" />
    </div>

    <div class="mb-3">
        <label for="max_size" class="form-label">Nombre de ligne</label>
        <input type="number" min="1" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="max_caracter"
            v-model="questionSelect.field_params.rows" />
    </div>

    <!-- <div class="mb-3">
        <label for="max_size" class="form-label">Nombre de colonne</label>
        <input type="number" min="1" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="max_caracter"
            v-model="questionSelect.field_params.cols" />
    </div> -->


    <div class="mb-3">
        <label for="max_size" class="form-label">Texte d'aide</label>
        <input type="text" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="placeholder_text"
            v-model="questionSelect.field_params.placeholder" />
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { survey_allowed_upload_types } from "@/utils/survey";
import { storeToRefs } from "pinia";
const store = surveyStore()
const { questionSelect } = storeToRefs(store)
</script>