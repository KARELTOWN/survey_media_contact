import { fetchGet, fetchPost, fetchPut, get_account_id } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { successNotify } from '@/utils/notification'
import { deleteIndexDBStorage, getLocalStorage, setIndexDBStorage } from '@/utils/storage'
import { defaultQuestion } from '@/utils/survey'
import { getUUID } from '@/utils/uuid'
import { saveAs } from 'file-saver'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
export const surveyStore = defineStore('survey-store', () => {
  const questionsFieldType = ref([])
  const logicOperators = ref([])
  const surveySuccess = ref(false)
  const surveyID = ref('')
  const surveysList = ref('')
  const responsesToSurvey = ref([])
  const statistics = ref({})
  const questionSelect = reactive({
    type_field: '',
    field_params: {},
    question_id: '',
    category: '',
    condition: {
      display: 'show',
      compareTo: '',
      operator: '',
      target: '',
    },
  })

  const liveFormSurvey = ref({})

  const errors = ref({})

  function getInitialFormSurvey() {
    return {
      form_id: '',
      title: '',
      description: '',
      topic: {},
      category: {},
      topic_id: '',
      category_id: '',
      lastEdit: 0,
      createdAt: Date.now(),
      questions: [
        {
          ...defaultQuestion,
          question_id: getUUID(),
        },
      ],
    multiple_submission: true,
    start_date: '',
    end_date: '',
    }
  }

  const formSurvey = ref({
    form_id: '',
    title: '',
    description: '',
    topic: {},
    category: {},
    topic_id: '',
    category_id: '',
    lastEdit: 0,
    createdAt: Date.now(),
    questions: [
      {
        ...defaultQuestion,
        question_id: getUUID(),
      },
    ],
    multiple_submission: true,
    start_date: '',
    end_date: '',
  })

  const getSurveyParams = async () => {
    try {
      const result = await fetchGet(`survey/params`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          questionsFieldType.value = response.data.questions_field_types
          logicOperators.value = response.data.logic_operators
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const showSurvey = async (survey_id) => {
    try {
      const result = await fetchGet(`survey/show/${survey_id}`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          formSurvey.value = response.data
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const getSurveys = async () => {
    try {
      const result = await fetchGet(`survey/get`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          surveysList.value = response.data
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const getSurveyForm = async (id) => {
    try {
      const result = await fetchGet(`survey/form/${id}`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          liveFormSurvey.value = response.data
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const saveFormInstance = async () => {
    formSurvey.value.lastEdit = Date.now()
    await setIndexDBStorage(
      `survey_form_${formSurvey.value.form_id}@${get_account_id()}`,
      formSurvey.value,
    )
  }

  const createSurvey = async () => {
    try {
      surveyID.value = ''
      surveySuccess.value = false
      errors.value = {}
      formSurvey.value.questions.forEach((question) => {
        if (question.condition.display == '') {
          question.condition.display = 'show'
        }
      })
      const data = {
        ...formSurvey.value,
        topic: '',
        category: '',
        topic_id: formSurvey.value.topic?._id,
        category_id: formSurvey.value.category?._id,
      }

      const result = await fetchPost(`survey/create`, data)

      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          surveySuccess.value = true
          surveyID.value = response?.data
          successNotify("Questionnaire d'enquête créé")
          await deleteIndexDBStorage(`survey_form_${data.form_id}@${get_account_id()}`)
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const updateSurvey = async () => {
    try {
      surveyID.value = ''
      surveySuccess.value = false
      errors.value = {}
      formSurvey.value.questions.forEach((question) => {
        if (question.condition.display == '') {
          question.condition.display = 'show'
        }
      })
      const data = {
        ...formSurvey.value,
        topic: '',
        category: '',
        topic_id: formSurvey.value.topic?._id,
        category_id: formSurvey.value.category?._id,
      }

      const result = await fetchPut(`survey/update/${formSurvey.value._id}`, data)

      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          surveySuccess.value = true
          surveyID.value = response?.data
          successNotify("Questionnaire d'enquête modifié")
          await deleteIndexDBStorage(`survey_form_${data.form_id}@${get_account_id()}`)
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const saveSurveyResponse = async (answers, survey_id) => {
    try {
      surveySuccess.value = false
      errors.value = {}
      let responses = []

      Object.entries(answers).forEach(([key, value]) => {
        responses.push({ question: key, response: value })
      })

      let metadata = {
        user_agent: navigator.userAgent,
      }

      const result = await fetchPut(`survey/responses/${survey_id}`, {
        responses: responses,
        metadata: metadata,
      })

      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        surveySuccess.value = true
        successNotify('Vos réponses ont été envoyées')
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const getSurveyResponses = async (survey_id) => {
    try {
      surveySuccess.value = false
      errors.value = {}

      const result = await fetchGet(`survey/detail/responses/${survey_id}`)

      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          surveySuccess.value = true
          responsesToSurvey.value = response.data
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const getSurveyStatistics = async (survey_id) => {
    try {
      surveySuccess.value = false
      errors.value = {}

      const result = await fetchGet(`survey/statistics/${survey_id}`)

      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          surveySuccess.value = true
          statistics.value = response.data
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const surveyFormLink = (surveyID) => {
    return `${import.meta.env.VITE_FRONT_URL}/forms/${surveyID}`
  }

  const exportToExcel = async (survey_id, title) => {
    try {
      const result = await fetchGet(`survey/export_excel/${survey_id}`)
      const blob = await result.blob()
      console.log('blob', blob)
      saveAs(blob, `${title}.xlsx`)
    } catch (err) {
      handleCatchError(err)
    }
  }

  return {
    surveyFormLink,
    getSurveyParams,
    questionsFieldType,
    formSurvey,
    saveFormInstance,
    questionSelect,
    logicOperators,
    createSurvey,
    surveySuccess,
    surveyID,
    liveFormSurvey,
    getSurveyForm,
    saveSurveyResponse,
    surveysList,
    getSurveys,
    showSurvey,
    responsesToSurvey,
    getSurveyResponses,
    getInitialFormSurvey,
    getSurveyStatistics,
    statistics,
    updateSurvey,
    exportToExcel,
  }
})
