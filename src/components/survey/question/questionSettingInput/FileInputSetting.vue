<template>
    <div class="space-y-5">
        <div>
            <label for="max_size" class="setting-label">Taille maximale</label>
            <div class="relative">
                <input id="max_size" v-model.number="questionSelect.field_params.max_size" type="number" min="1"
                    max="16" class="setting-input pr-14" />
                <span
                    class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                    Mo
                </span>
            </div>
            <p class="mt-1 text-xs text-gray-500">Valeur autorisee entre 1 et 16 Mo.</p>
        </div>

        <div>
            <label class="setting-label">Types autorises</label>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <label v-for="(value, index) in survey_allowed_upload_types" :key="index" :for="`accept-${value}`"
                    class="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50">
                    <input :id="`accept-${value}`" v-model="questionSelect.field_params.accept" :value="value"
                        type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span>{{ value }}</span>
                </label>
            </div>
        </div>

        <div>
            <label class="setting-label">Plusieurs fichiers</label>
            <div class="inline-flex rounded-xl border border-gray-200 bg-white p-1">
                <button type="button" :class="toggleClass(questionSelect.field_params.multiple === true)"
                    @click="questionSelect.field_params.multiple = true">
                    Oui
                </button>
                <button type="button" :class="toggleClass(questionSelect.field_params.multiple === false)"
                    @click="questionSelect.field_params.multiple = false">
                    Non
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { survey_allowed_upload_types } from "@/utils/survey";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { infoNotify } from '@/utils/notification'

const store = surveyStore()
const { questionSelect } = storeToRefs(store)

const toggleClass = (active) => [
    'min-w-20 rounded-lg px-4 py-2 text-sm font-semibold transition',
    active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
]

watch(() => questionSelect.value.field_params.max_size, (newValue) => {
    if (newValue !== '' && (newValue > 16 || newValue <= 0)) {
        infoNotify("La taille doit etre comprise entre 1 et 16")
        questionSelect.value.field_params.max_size = 10
    }
})
</script>

<style scoped>
.setting-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #374151;
}

.setting-input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.75rem;
    background: #ffffff;
    padding: 0.75rem 0.875rem;
    color: #111827;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.setting-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
</style>
