<template>
    <Modal v-if="props.open === true">
        <template #body>
            <div
                class="no-scrollbar relative w-3/3 md:w-2/3 max-w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h5 class="mb-5 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                    Configuration enquête
                </h5>
                <div class="grid grid-cols-2">
                    <div class="mb-3 col-span-2">
                        <label class="form-label">Soumission multiple</label>
                        <div class="flex my-3">
                            <div class="flex items-center gap-3">
                                <input type="radio" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2"
                                    id="multiple" v-model="formSurvey.multiple_submission" :value="true" />
                                <label for="multiple" name="multiple">OUI</label>
                            </div>
                            <div class="flex items-center gap-3">
                                <input type="radio" class="ms-4 border border-gray-200 focus:outline-none text-lg p-2"
                                    id="unique" v-model="formSurvey.multiple_submission" :value="false" />
                                <label for="unique" name="unique">NON</label>
                            </div>

                        </div>
                    </div>
                    <div class="mb-3 flex items-center">
                        <label for="allowed_types" class="form-label me-3">Date début</label>
                        <flat-pickr v-model="formSurvey.start_date" :config="flatpickrConfig({ minDate: actualDate })"
                            placeholder="Date début" :class="flatpickrStyle" />
                    </div>
                    <div>
                        <label for="allowed_types" class="form-label me-3">Date fin</label>
                        <flat-pickr v-model="formSurvey.end_date"
                            :config="flatpickrConfig({ minDate: formSurvey.start_date })" placeholder="Date début"
                            :class="flatpickrStyle" max />
                    </div>
                </div>


            </div>
        </template>
    </Modal>
</template>

<script setup>
import Modal from '@/components/profile/Modal.vue';
import { surveyStore } from '@/stores/survey/surveyStore';
import { flatpickrConfig } from '@/utils/format';
import { flatpickrStyle } from '@/utils/style';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
const store = surveyStore()
const { formSurvey } = storeToRefs(store)
const props = defineProps({
    open: Boolean,
})
const actualDate = moment().toDate()
</script>