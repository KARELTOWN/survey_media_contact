<template>
    <div class="space-y-4">
        <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div class="mb-4 grid gap-4 lg:grid-cols-[1fr,280px]">
                <div>
                    <label class="mb-2 block text-xs font-semibold uppercase text-gray-400">Question</label>
                    <input v-model="question.title" :disabled="question.type_field === 'email'" type="text"
                        placeholder="Ecrivez ici la question"
                        class="w-full border-b border-gray-200 bg-transparent p-2 text-lg font-semibold focus:outline-none disabled:opacity-50" />
                </div>

                <div v-if="question.type_field !== 'email'">
                    <label class="mb-2 block text-xs font-semibold uppercase text-gray-400">Type de champ</label>
                    <select v-model="question.field_libelle" @change="changeField"
                        class="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm">
                        <option v-for="field in questionFieldTypes" :key="field.field" :value="field.libelle">
                            {{ field.libelle }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="rounded-xl border border-dashed border-gray-200 bg-white p-4">
                <div v-if="hasOptions">
                    <div class="mb-3 flex items-center justify-between gap-3">
                        <div class="text-sm font-semibold text-gray-700">Liste des options</div>
                        <button type="button" @click="addOption"
                            class="rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                            + Ajouter
                        </button>
                    </div>
                    <div class="space-y-2">
                        <div v-for="(option, index) in field_params.options" :key="index"
                            class="rounded-xl border border-gray-100 bg-gray-50 p-2.5">
                        <div class="grid grid-cols-[1fr,auto] gap-2 md:grid-cols-[1fr,auto,auto,auto] md:items-center">
                            <input v-model="option.value" type="text"
                                class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none" />
                            <div class="flex items-center gap-2">
                                <input :id="`option-image-${question.question_id}-${index}`" type="file" accept="image/*"
                                    class="hidden" @change="uploadOptionImage($event, option)" />
                                <button type="button" @click="openOptionImagePicker(index)"
                                    class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100">
                                    Image
                                </button>
                                <button v-if="option.img" type="button" @click="clearOptionImage(option)"
                                    class="h-10 rounded-lg border border-red-100 bg-white px-3 text-xs font-semibold text-red-600 hover:bg-red-50">
                                    Retirer
                                </button>
                            </div>
                            <input v-if="question.type_field === 'select' || question.type_field === 'radio'" type="radio"
                                :name="`default_option_${question.question_id}`" :checked="option.default"
                                @change="setDefaultOption(index)" class="h-5 w-5 justify-self-end" title="Option par defaut" />
                            <input v-else-if="question.type_field === 'checkbox'" type="checkbox" v-model="option.default"
                                class="h-5 w-5 justify-self-end" title="Coche par defaut" />
                            <button type="button" @click="deleteOption(index)"
                                class="h-10 rounded-lg border border-red-100 bg-white px-3 text-sm font-semibold text-red-600 hover:bg-red-50">
                                Supprimer
                            </button>
                        </div>
                        <div v-if="option.img" class="mt-2 flex items-center gap-2">
                            <img :src="option.img" alt="Image option" class="h-12 w-16 rounded-lg border border-gray-200 object-cover" />
                            <span class="text-xs text-gray-500">Image liee a cette option</span>
                        </div>
                        </div>
                    </div>
                </div>

                <input v-else-if="question.type_field === 'text' || question.type_field === 'email'" disabled type="text"
                    :placeholder="field_params.placeholder"
                    class="w-full border-b border-gray-200 p-2 text-lg focus:outline-none" />

                <textarea v-else-if="question.type_field === 'textarea'" disabled :rows="field_params.rows || 4"
                    :placeholder="field_params.placeholder"
                    class="w-full border-b border-gray-200 p-2 text-lg focus:outline-none"></textarea>

                <input v-else-if="question.type_field === 'file'" disabled type="file"
                    class="w-full border border-gray-200 p-2 text-lg" />

                <input v-else-if="question.type_field === 'date'" disabled type="date"
                    class="w-full border border-gray-200 p-2 text-lg focus:outline-none" />

                <input v-else-if="question.type_field === 'hour'" disabled type="time"
                    class="w-full border border-gray-200 p-2 text-lg focus:outline-none" />

                <input v-else-if="question.type_field === 'number'" disabled type="number"
                    class="w-full border border-gray-200 p-2 text-lg focus:outline-none" />

                <div v-else-if="question.type_field === 'range'" class="rounded-xl border border-gray-200 p-4">
                    <input disabled type="range" :min="field_params.min" :max="field_params.max" :step="field_params.step"
                        :value="field_params.min" class="h-2 w-full rounded-lg bg-gray-200" />
                    <div class="mt-3 flex items-center justify-between gap-3 text-sm text-gray-500">
                        <span>{{ field_params.min_label || field_params.min }}</span>
                        <span class="rounded-full bg-red-50 px-3 py-1 font-semibold text-red-600">
                            {{ field_params.min }} a {{ field_params.max }}
                        </span>
                        <span>{{ field_params.max_label || field_params.max }}</span>
                    </div>
                </div>

                <div v-else-if="question.type_field === 'review'" class="flex items-center space-x-1">
                    <span v-for="n in field_params.rating || 5" :key="n" class="text-2xl text-gray-300">*</span>
                </div>
            </div>
        </div>

        <ActionPanel @copy="copyQuestion" @delete="deleteQuestion" @setting="editSetting"
            @condition="setCondition" :have_params="fieldHaveSetting" @required="requiredQuestion" :have_required="true"
            :required="question.required" :type_field="question.type_field" />
        <SettingPanel @close="openSetting = false" :open="openSetting" @save="changeSetting" />
        <ConditionPanel @save="saveCondition" :open="openCondition" @close="openCondition = false" />
    </div>
</template>

<script setup>
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import ActionPanel from "@/components/survey/ActionPanel.vue";
import SettingPanel from "./questionSettingPanel/SettingPanel.vue";
import { surveyDefaultFieldTypes, surveyGetFieldFromType, surveyGetFieldParams } from "@/utils/survey";
import { errorNotify, infoNotify } from '@/utils/notification'
import ConditionPanel from "./condition/ConditionPanel.vue";
import { uploadSurveyImage } from "@/composables/request";

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(["data", 'copy', 'delete', 'save'])
const store = surveyStore()
const { questionsFieldType, questionSelect } = storeToRefs(store)

let question = reactive({})
let field_params = reactive({})

const questionFieldTypes = computed(() => {
    return questionsFieldType.value?.length ? questionsFieldType.value : surveyDefaultFieldTypes
})

const hasOptions = computed(() => ['select', 'radio', 'checkbox'].includes(question.type_field))

const syncQuestionState = () => {
    Object.keys(question).forEach((key) => delete question[key])
    Object.keys(field_params).forEach((key) => delete field_params[key])

    Object.entries(props.question || {}).forEach(([key, value]) => {
        question[key] = value
    })

    const params = props.question?.field_params || surveyGetFieldParams(question.type_field || 'text')
    Object.entries(params).forEach(([key, value]) => {
        field_params[key] = value
    })

    if (question.category === 'question' && question.type_field !== 'email') {
        const matchingField = questionFieldTypes.value.find((field) => field.field === question.type_field)
        if (!question.field_libelle || !questionFieldTypes.value.some((field) => field.libelle === question.field_libelle)) {
            question.field_libelle = matchingField?.libelle || questionFieldTypes.value[0]?.libelle || 'Reponse courte'
        }
    }
}

watch(() => props.question, syncQuestionState, { immediate: true })

const getQuestion = () => {
    return {
        question_id: question.question_id,
        title: question.title,
        type_field: question.type_field,
        category: question.category,
        field_libelle: question.field_libelle,
        condition: question.condition,
        field_params: { ...field_params },
        required: question.required,
    }
}

const saveQuestion = () => {
    emit("save", getQuestion())
}

watch(question, saveQuestion, { deep: true })
watch(field_params, saveQuestion, { deep: true })

const changeField = () => {
    Object.keys(field_params).forEach(key => delete field_params[key])
    question.type_field = surveyGetFieldFromType(question.field_libelle)
    Object.entries(surveyGetFieldParams(question.type_field)).forEach(([key, value]) => {
        field_params[key] = value
    })
}

const addOption = () => {
    if (!field_params.options) {
        field_params.options = []
    }
    field_params.options.push({ value: '', img: '', default: false })
}

const deleteOption = (index) => {
    if (field_params.options.length === 1) {
        infoNotify('Impossible de supprimer le dernier element')
        return
    }
    field_params.options.splice(index, 1)
}

const setDefaultOption = (index) => {
    field_params.options.forEach((option, optionIndex) => {
        option.default = optionIndex === index
    })
}

const openOptionImagePicker = (index) => {
    document.getElementById(`option-image-${question.question_id}-${index}`)?.click()
}

const uploadOptionImage = async (event, option) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
        errorNotify('Veuillez selectionner une image')
        return
    }

    try {
        infoNotify("Televersement de l'image en cours")
        option.img = await uploadSurveyImage(file)
    } catch (error) {
        errorNotify(error.message || "Impossible de televerser l'image")
    }
}

const clearOptionImage = (option) => {
    option.img = ''
}

const copyQuestion = () => {
    emit('copy', getQuestion())
}

const deleteQuestion = () => {
    emit("delete", getQuestion())
}

const requiredQuestion = (value) => {
    question.required = value
}

const openSetting = ref(false)

const editSetting = () => {
    openSetting.value = true
    questionSelect.value.type_field = question.type_field
    questionSelect.value.field_params = { ...field_params }
}

const changeSetting = () => {
    Object.keys(field_params).forEach((key) => delete field_params[key])
    Object.entries(questionSelect.value.field_params || {}).forEach(([key, value]) => {
        field_params[key] = value
    })
    openSetting.value = false
}

const openCondition = ref(false)

const setCondition = () => {
    openCondition.value = true
    questionSelect.value.category = question.category
    questionSelect.value.question_id = question.question_id
    questionSelect.value.type_field = question.type_field
    questionSelect.value.field_params = { ...field_params }
    questionSelect.value.condition = { ...question.condition }
}

const saveCondition = () => {
    question.condition = { ...questionSelect.value.condition }
    openCondition.value = false
}

const fieldHaveSetting = computed(() => {
    return !(['select', 'radio', 'checkbox', 'hour', 'date'].includes(question.type_field))
})
</script>
