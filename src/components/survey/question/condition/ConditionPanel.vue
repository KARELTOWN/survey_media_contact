<template>
    <Modal v-if="props.open === true">
        <template #body>
            <div
                class="no-scrollbar relative mx-4 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
                <button @click="$emit('close')"
                    class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div class="border-b border-gray-100 px-6 py-5 text-center">
                    <div class="text-xs font-semibold uppercase tracking-wide text-blue-600">Regle logique</div>
                    <h1 class="mt-1 text-2xl font-bold text-gray-800">Condition d'affichage</h1>
                    <p class="mx-auto mt-2 max-w-2xl text-sm text-gray-500">
                        Definissez quand cette question doit etre affichee ou masquee selon une reponse precedente.
                    </p>
                </div>

                <div class="px-6 py-6">
                    <div v-if="questions.length === 0"
                        class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                        <h2 class="text-base font-semibold text-gray-800">Aucune question compatible</h2>
                        <p class="mt-2 text-sm text-gray-500">
                            Ajoutez d'abord une question exploitable avant de creer une condition.
                        </p>
                    </div>

                    <div v-else class="space-y-5">
                        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                            <div class="mb-5">
                                <h2 class="text-base font-semibold text-gray-800">Declencheur</h2>
                                <p class="mt-1 text-sm text-gray-500">
                                    Choisissez l'action, la question de reference et l'operateur de comparaison.
                                </p>
                            </div>

                            <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                <div class="condition-field">
                                    <SimpleSelect :data="displayOptions" label="Action" optionTextAttr="libelle"
                                        optionValueAttr="id" @change="getDisplayValue"
                                        :defaultValue="defaultDisplayValue" />
                                </div>

                                <div class="condition-field">
                                    <SimpleSelect :data="questions" label="Si la question" optionTextAttr="title"
                                        optionValueAttr="question_id" @change="getQuestion"
                                        :defaultValue="defaultQuestionValue" />
                                </div>

                                <div class="condition-field">
                                    <SimpleSelect :data="operators" label="Condition" optionTextAttr="libelle"
                                        optionValueAttr="value" @change="getOperator"
                                        :defaultValue="defaultOperatorValue" />
                                </div>
                            </div>
                        </div>

                        <div v-if="compareToOptions.length > 0 || compareToNumber === true || compareToDate === true"
                            class="rounded-2xl border border-gray-200 bg-white p-5">
                            <div class="mb-4">
                                <h2 class="text-base font-semibold text-gray-800">Valeur attendue</h2>
                                <p class="mt-1 text-sm text-gray-500">
                                    Completez la valeur qui servira a valider la condition.
                                </p>
                            </div>

                            <SimpleSelect v-if="compareToOptions.length > 0" :data="compareToOptions"
                                :label="target.title || 'Reponse attendue'" optionTextAttr="value"
                                optionValueAttr="value" @change="getCompareToFromOption"
                                :defaultValue="defaultCompareOptionValue" />

                            <input v-if="compareToNumber === true" @change="getCompareTo" type="number" min="0"
                                :defaultValue="defaultCompareNumberValue" class="condition-input" />

                            <input v-if="compareToDate === true" @change="getCompareTo" type="date"
                                :defaultValue="defaultCompareDateValue" class="condition-input" />
                        </div>

                        <div v-else
                            class="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-800">
                            Certaines conditions, comme "vide" ou "rempli", n'ont pas besoin de valeur attendue.
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <button type="button" @click="$emit('close')"
                        class="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                        Annuler
                    </button>
                    <button @click="$emit('save')"
                        class="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
                        Enregistrer
                    </button>
                </div>
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
const { questionSelect, formSurvey, logicOperators } = storeToRefs(store)
import SimpleSelect from "@/components/forms/FormElements/SimpleSelect.vue";
import { fieldExluseFromComparaison } from "@/utils/survey";


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
                operators = logicOperators.value.filter((e) => {
                    return (e.value === '=' || e.value === '!=')
                })
            }
            else if (q.type_field == 'number' || q.type_field == 'range') {
                compareToNumber.value = true
                operators = logicOperators.value.filter((e) => {
                    return (e.value === '=' || e.value === '!=' || e.value === '<' || e.value === '>' || e.value === '<=' || e.value === '>=')
                })
            } else if (q.type_field == 'review') {
                compareToNumber.value = true
                operators = logicOperators.value.filter((e) => {
                    return (e.value === '=' || e.value === '!=' || e.value === '<' || e.value === '>' || e.value === '<=' || e.value === '>=')
                })
            }
            else if (q.type_field == 'date') {
                compareToDate.value = true
                operators = logicOperators.value.filter((e) => {
                    return (e.value === '=' || e.value === '!=' || e.value === '<' || e.value === '>' || e.value === '<=' || e.value === '>=')
                })
            }
            else if (q.type_field == 'text' || q.type_field == 'textarea') {
                questionSelect.value.condition.compareTo = ''
                operators = logicOperators.value.filter((e) => {
                    return (e.value === 'vide' || e.value === 'rempli')
                })
            }
        }


    }
}




</script>

<style scoped>
.condition-field :deep(label) {
    font-weight: 700;
    color: #374151;
}

.condition-input {
    height: 2.75rem;
    width: 100%;
    appearance: none;
    border-radius: 0.75rem;
    border: 1px solid #d1d5db;
    background: #ffffff;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    color: #111827;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.condition-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
</style>
