<template>
    {{ questionSelect.field_params }}

    <div v-if="questionSelect.type_field == 'file'">
        <FileInputSetting />
    </div>
    <div v-if="questionSelect.type_field == 'textarea'">
        <TextareaInputSetting />
    </div>
    <div v-if="questionSelect.type_field == 'text'">
        <TextInputSetting />
    </div>
    <div v-if="questionSelect.type_field == 'review'">
        <ReviewInputSetting />
    </div>
    <div v-if="questionSelect.type_field == 'number'">
        <NumberInputSetting />
    </div>
    <div v-if="questionSelect.type_field == 'date'">
        <DateInputSetting />
    </div>
    <button @click="$emit('save')" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
        Enregistrer
    </button>

</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import FileInputSetting from "../setting/FileInputSetting.vue";
import { storeToRefs } from "pinia";
import TextareaInputSetting from "../setting/TextareaInputSetting.vue";
import TextInputSetting from "../setting/TextareaInputSetting.vue";
import ReviewInputSetting from "../setting/ReviewInputSetting.vue";
import NumberInputSetting from "../setting/NumberInputSetting.vue";
import DateInputSetting from "../setting/DateInputSetting.vue";

const emit = defineEmits(["save"])
const store = surveyStore()
const { questionSelect } = storeToRefs(store)
</script>