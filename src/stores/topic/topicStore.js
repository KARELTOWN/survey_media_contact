import { fetchGet, fetchPost, fetchPut } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { successNotify } from '@/utils/notification'
import topicValidator from '@/validator/topic'
const { validateCreate, validateUpdate } = topicValidator()

export const topicStore = defineStore('topic-store', () => {
  const errors = ref({})
  const search_errors = ref({})
  const topics = ref([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const totalPages = ref(0)
  const topicSuccess = ref(false)
  const search_form = reactive({
    search: '',
  })

  let selectTopic = ref(null)
    let selectCategory = ref(null)

  let openModal = ref(false)
  const topicCategory = ref([])

  const updatePagination = () => {
    total.value += 1
    totalPages.value = Math.ceil(total.value / limit.value)
  }

  const getTopics = async () => {
    try {
      const result = await fetchGet(`topic/get?limit=${limit.value}&page=${page.value}`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          topics.value = response.data.topics
          total.value = response.data.total
          page.value = response.data.page
          limit.value = response.data.limit
          totalPages.value = response.data.totalPages
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const filterTopics = async (data) => {
    try {
      search_errors.value = {}
      const result = await fetchPost(`topic/filter?limit=${limit.value}&page=${page.value}`, data)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          topics.value = response.data.topics
          total.value = response.data.total
          page.value = response.data.page
          limit.value = response.data.limit
          totalPages.value = response.data.totalPages
        }
      } else {
        if (response.errors) {
          search_errors.value = response.errors
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const createTopic = async (data) => {
    try {
      topicSuccess.value = false
      errors.value = {}
      const schemaProject = validateCreate()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPost(`topic/create`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          topicSuccess.value = true
          topics.value.unshift(response.data.topic)
          updatePagination()
          successNotify('Thématique créé')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const createCategory = async (data) => {
    try {
      topicSuccess.value = false
      errors.value = {}
      const schemaProject = validateCreate()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPost(`topic/category/create`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          topicSuccess.value = true
          topicCategory.value.unshift(response.data.category)
          updatePagination()
          successNotify('Catégorie créé')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const updateTopic = async (data) => {
    try {
      topicSuccess.value = false
      errors.value = {}
      const schemaProject = validateUpdate()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPut(`topic/update/${data_result.topic_id}`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          topicSuccess.value = true
          let topic_index = topics.value.findIndex((item) => item._id === data_result.topic_id)
          topics.value[topic_index] = response.data.topic
          successNotify('Topic modifié')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const getCategoryInTopic = async (topic) => {
    try {
      search_errors.value = {}
      const result = await fetchGet(`topic/category/${topic}`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          topicCategory.value = response.data
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  return {
    createTopic,
    updateTopic,
    getTopics,
    errors,
    topics,
    total,
    page,
    limit,
    totalPages,
    topicSuccess,
    filterTopics,
    search_errors,
    search_form,
    selectTopic,
    selectCategory,
    openModal,
    topicCategory,
    getCategoryInTopic,
    createCategory
  }
})
