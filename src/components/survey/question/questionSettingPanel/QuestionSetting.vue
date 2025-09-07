<template>

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
    <button @click="$emit('save')" class="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700">
        Enregistrer
    </button>

</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import FileInputSetting from "../questionSettingInput/FileInputSetting.vue";
import { storeToRefs } from "pinia";
import TextareaInputSetting from "../questionSettingInput/TextareaInputSetting.vue";
import TextInputSetting from "../questionSettingInput/TextInputSetting.vue";
import ReviewInputSetting from "../questionSettingInput/ReviewInputSetting.vue";
import NumberInputSetting from "../questionSettingInput/NumberInputSetting.vue";
import DateInputSetting from "../questionSettingInput/DateInputSetting.vue";
import { watch } from "vue";
const emit = defineEmits(["save"])
const store = surveyStore()
const { questionSelect } = storeToRefs(store)


</script>