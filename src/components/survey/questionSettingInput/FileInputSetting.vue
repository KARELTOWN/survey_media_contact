<template>
    <h3 class="text-xl md:text-xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg">Paramètres champ Fichier</h3>
    <div class="mb-3">
        <label for="max_size" class="form-label">Taille maximale (Mo)</label>
        <input type="number" min="1" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3"
            id="max_size" v-model="questionSelect.field_params.max_size" />
    </div>

    <div class="mb-3">
        <label for="allowed_types" class="form-label">Types de fichiers autorisés (séparés par des virgules)</label>
        <div class="grid grid-cols-3 my-3">

            <div v-for="(value, index) in survey_allowed_upload_types" :key="index" class="my-1">
                <div class="flex items-center gap-3">
                    <input type="checkbox" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2"
                        :id="value" v-model="questionSelect.field_params.accept" :value="value" />
                    <div>
                        <label :for="value" name="acceptType">{{ value }}</label>

                    </div>
                </div>
            </div>

        </div>

    </div>

    <div class="mb-3">
        <label for="allowed_types" class="form-label">Multiple fichiers</label>
        <div class="grid grid-cols-5 my-3">
            <div class="flex items-center gap-3">
                <input type="radio" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3"
                    id="multiple_file" v-model="questionSelect.field_params.multiple" :value="true" />
                <label for="multiple_file" name="multiple_file">OUI</label>
            </div>
            <div class="flex items-center gap-3">
                <input type="radio" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2 mb-3"
                    id="unique_file" v-model="questionSelect.field_params.multiple" :value="false" />
                <label for="unique_file" name="unique_file">NON</label>
            </div>

        </div>
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { survey_allowed_upload_types } from "@/utils/survey";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
const store = surveyStore()
const { questionSelect } = storeToRefs(store)

const accept = ref([])
const multiple = ref(false)

watch(() => multiple.value, (newValue, oldValue) => {
    console.log('multiple', newValue)
})
// questionSelect.field_params.accept
// questionSelect.field_params.multiple
</script>
