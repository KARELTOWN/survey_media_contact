<template>
    <h3 class="text-xl md:text-xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg">Paramètres champ Fichier</h3>
    <div class="mb-3">
        <label for="max_size" class="form-label">Taille maximale (Mo)</label>
        <input type="number" min="1" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="max_size"
            v-model="questionSelect.field_params.max_size" />
    </div>

    <div class="mb-3">
        <label for="allowed_types" class="form-label">Types de fichiers autorisés (séparés par des virgules)</label>
        <div class="grid grid-cols-3" v-for="(value, index) in survey_allowed_upload_types" :key="index">
            <div class="flex items-center gap-3">
                <input type="checkbox" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="allowed_types"
                    v-model="questionSelect.field_params.accept" />
                <label for="newsletter" name="acceptType">{{ value }}</label>
            </div>

        </div>
    </div>

    <div class="mb-3">
        <label for="allowed_types" class="form-label">Multiple fichiers</label>
        <div class="grid grid-cols-2">
            <div class="flex items-center gap-3">
                <input type="radio" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="multiple_file"
                    v-model="questionSelect.field_params.multiple" />
                <label for="newsletter" name="acceptType">OUI</label>
            </div>
            <div class="flex items-center gap-3">
                <input type="radio" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3" id="multiple_file"
                    v-model="questionSelect.field_params.multiple" />
                <label for="newsletter" name="acceptType">NON</label>
            </div>

        </div>
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { survey_allowed_upload_types } from "@/utils/survey";
import { storeToRefs } from "pinia";
const store = surveyStore()
const { questionSelect } = storeToRefs(store)
</script>