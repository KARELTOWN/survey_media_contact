<template>
    <div class="grid gap-4 md:grid-cols-2">
        <div>
            <label class="setting-label">Minimum</label>
            <input type="number" class="setting-input" v-model.number="questionSelect.field_params.min" />
        </div>
        <div>
            <label class="setting-label">Maximum</label>
            <input type="number" :min="questionSelect.field_params.min" class="setting-input"
                v-model.number="questionSelect.field_params.max" />
        </div>
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
const store = surveyStore()
const { questionSelect } = storeToRefs(store)
</script>

<style scoped>
.setting-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
}

.setting-input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.75rem;
    background: white;
    padding: 0.75rem 0.875rem;
    font-size: 0.95rem;
    outline: none;
}
</style>
