<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
            <label class="form-label">Minimum</label>
            <input v-model.number="questionSelect.field_params.min" type="number" class="setting-input" />
        </div>
        <div>
            <label class="form-label">Maximum</label>
            <input v-model.number="questionSelect.field_params.max" type="number"
                :min="questionSelect.field_params.min" class="setting-input" />
        </div>
        <div>
            <label class="form-label">Pas</label>
            <input v-model.number="questionSelect.field_params.step" type="number" min="1" class="setting-input" />
        </div>
        <div>
            <label class="form-label">Etiquette min</label>
            <input v-model="questionSelect.field_params.min_label" type="text" class="setting-input" />
        </div>
        <div class="md:col-span-2">
            <label class="form-label">Etiquette max</label>
            <input v-model="questionSelect.field_params.max_label" type="text" class="setting-input" />
        </div>
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
import { watch } from "vue";

const store = surveyStore()
const { questionSelect } = storeToRefs(store)

watch(
    () => [
        questionSelect.value.field_params.min,
        questionSelect.value.field_params.max,
        questionSelect.value.field_params.step,
    ],
    ([min, max, step]) => {
        const safeMin = Number.isFinite(Number(min)) ? Number(min) : 0
        let safeMax = Number.isFinite(Number(max)) ? Number(max) : safeMin + 1
        let safeStep = Number.isFinite(Number(step)) && Number(step) > 0 ? Number(step) : 1

        if (safeMax <= safeMin) {
            safeMax = safeMin + safeStep
        }

        questionSelect.value.field_params.min = safeMin
        questionSelect.value.field_params.max = safeMax
        questionSelect.value.field_params.step = safeStep
    },
    { immediate: true }
)
</script>

<style scoped>
.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #1f2937;
}

.setting-input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.75rem;
    padding: 0.75rem 0.875rem;
    outline: none;
}
</style>
