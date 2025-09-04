<template>
    <Modal v-if="props.open === true">
        <template #body>
            <div
                class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <!-- Overlay -->
                <!-- Bouton de fermeture -->
                <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {{ questionSelect }}
                {{ defaultDisplayValue }}
                <!-- AFFICHAGE -->

                <div class="grid grid-cols-3 gap-3 my-4">

                    <div>
                        <SimpleSelect :data="displayOptions" label="Affichage" optionTextAttr="libelle"
                            optionValueAttr="id" @change="getDisplayValue" :defaultValue="defaultDisplayValue" />

                    </div>

                    <!-- TARGET -->
                    <div>
                        <SimpleSelect :data="questions" label="SI" optionTextAttr="title" optionValueAttr="question_id"
                            @change="getQuestion" :defaultValue="defaultQuestionValue" />
                    </div>

                    <div>
                        <!-- OPERATEURS -->
                        <SimpleSelect :data="operators" label="Condition" optionTextAttr="libelle"
                            optionValueAttr="value" @change="getOperator" :defaultValue="defaultOperatorValue" />
                    </div>
                    <div>
                        <!-- CAS LISTE DEROULANTE, CHOIX MULTIPLE,  -->
                        <SimpleSelect v-if="compareToOptions.length > 0" :data="compareToOptions" :label="target.title"
                            optionTextAttr="value" optionValueAttr="value" @change="getCompareToFromOption"
                            :defaultValue="defaultCompareOptionValue" />
                        <input v-if="compareToNumber === true" @change="getCompareTo" type="number" min="0"
                            :defaultValue="defaultCompareNumberValue"
                            class="text-gray-800 dark:text-white/90 dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                        <input v-if="compareToDate === true" @change="getCompareTo" type="date"
                            :defaultValue="defaultCompareDateValue"
                            class="text-gray-800 dark:text-white/90 dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                    </div>

                </div>
                <button @click="$emit('save')"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                    Enregistrer
                </button>

            </div>
        </template>
    </Modal>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref, watch } from "vue";
import Modal from '@/components/profile/Modal.vue'

const emit = defineEmits(["save", "close"])

const store = surveyStore()
const { questionSelect, formSurvey } = storeToRefs(store)
import SimpleSelect from "@/components/forms/FormElements/SimpleSelect.vue";
import { allConditonOperators, fieldExluseFromComparaison } from "@/utils/survey";


const props = defineProps({
    open: Boolean,
})

onMounted(() => {
    questionSelect.value.condition.display = "show"
    defaultDisplayValue.value = "show"
})

const displayOptions = reactive([
    { libelle: 'Afficher', id: 'show' },
    { libelle: 'Cacher', id: 'hide' }
])

let questions = ref([])

let defaultDisplayValue = ref('')
let defaultQuestionValue = ref('')
let defaultOperatorValue = ref('')
let defaultCompareOptionValue = ref('')
let defaultCompareNumberValue = ref('')
let defaultCompareDateValue = ref('')

const setDefaultValue = () => {
        const condition = questionSelect.value.condition;

        // Display
        if (condition.display) {
            const display = displayOptions.find(e => e.id == condition.display);
            defaultDisplayValue.value = display?.id ?? "show";
        } else {
            condition.display = "show";
            defaultDisplayValue.value = "show";
        }

        // Target
        defaultQuestionValue.value = condition.target ?? "";
        if (condition.target) getQuestion(defaultQuestionValue.value);

        // Operator
        defaultOperatorValue.value = condition.operator ?? "";

        // CompareTo
        if (condition.compareTo) {
            if (compareToOptions.value.length > 0) {
                defaultCompareOptionValue.value = condition.compareTo;
            } else if (compareToNumber.value === true) {
                defaultCompareNumberValue.value = condition.compareTo;
            } else if (compareToDate.value === true) {
                defaultCompareDateValue.value = condition.compareTo;
            }
        } else {
            defaultCompareNumberValue.value = "";
        }
}

watch(() => props.open, (newValue, oldValue) => {
    questions.value = formSurvey.value.questions.filter((e) => (e.category === 'question' && !fieldExluseFromComparaison.includes(e.type_field) && e.question_id !== questionSelect.value.question_id))
    setDefaultValue()
})

const getDisplayValue = (value) => {
    questionSelect.value.condition.display = value
}

const getOperator = (value) => {
    questionSelect.value.condition.operator = value
}

const getCompareToFromOption = (value) => {
    questionSelect.value.condition.compareTo = value
}

const getCompareTo = (value) => {
    questionSelect.value.condition.compareTo = value.target.value
}

let compareToOptions = ref([])
let compareToNumber = ref(false)
let compareToDate = ref(false)

let target = reactive({})

let operators = reactive([])

const getQuestion = (value) => {
    compareToOptions.value = []
    compareToNumber.value = false
    compareToDate.value = false
    target = {}
    operators = []

    questionSelect.value.condition.target = value
    let q = formSurvey.value.questions.find((e) => (e.question_id === value))
    if (!q) {
        alert('Question non trouvé')
    }
    else {
        target = { ...q }
        if (q.category == 'question') {
            if (q.type_field == 'radio' || q.type_field == 'checkbox' || q.type_field == 'select') {
                compareToOptions.value = q.field_params.options
                operators = allConditonOperators.filter((e) => {
                    return (e.value === '=' || e.value === '!=')
                })
            }
            else if (q.type_field == 'number') {
                compareToNumber.value = true
                operators = allConditonOperators.filter((e) => {
                    return (e.value === '=' || e.value === '!=' || e.value === '<' || e.value === '>' || e.value === '<=' || e.value === '>=')
                })
            } else if (q.type_field == 'review') {
                compareToNumber.value = true
                operators = allConditonOperators.filter((e) => {
                    return (e.value === '=' || e.value === '!=' || e.value === '<' || e.value === '>' || e.value === '<=' || e.value === '>=')
                })
            }
            else if (q.type_field == 'date') {
                compareToDate.value = true
                operators = allConditonOperators.filter((e) => {
                    return (e.value === '=' || e.value === '!=' || e.value === '<' || e.value === '>' || e.value === '<=' || e.value === '>=')
                })
            }
            else if (q.type_field == 'text' || q.type_field == 'textarea') {
                questionSelect.value.condition.compareTo = ''
                operators = allConditonOperators.filter((e) => {
                    return (e.value === 'vide' || e.value === 'rempli')
                })
            }
        }


    }
}




</script>