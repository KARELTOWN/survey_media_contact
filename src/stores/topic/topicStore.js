import { fetchGet, fetchPost, fetchPut, fetchDestroy } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { successNotify } from '@/utils/notification'
import topicValidator from '@/validator/topic'
const { validateCreate, validateUpdate, valideCreateCategory, valideUpdateCategory } =
  topicValidator()

export const topicStore = defineStore('topic-store', () => {
  const errors = ref({})
  const search_errors = ref({})
  const topics = ref([])
  // Pagination topics
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const totalPages = ref(0)
  // Pagination category
  const totalCateg = ref(0)
  const pageCateg = ref(1)
  const totalPagesCateg = ref(0)

  const newTopic = ref(null)
  const newCategory = ref(null)
  const topicSuccess = ref(false)
  const search_form = reactive({
    search: '',
  })

  let selectTopic = ref(null)
  let selectCategory = ref(null)

  let openModal = ref(false)
  const topicCategory = ref([])
  const category = ref([])

  const updatePaginationTopic = (action = 'add') => {
    if (action == 'add') {
      total.value += 1
    } else if (action == 'delete') {
      total.value -= 1
    }
    totalPages.value = Math.ceil(total.value / limit.value)
  }

  const updatePaginationCateg = (action = 'add') => {
    if (action == 'add') {
      totalCateg.value += 1
    } else if (action == 'delete') {
      totalCateg.value -= 1
    }
    totalPagesCateg.value = Math.ceil(totalCateg.value / limit.value)
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

  const filterCategory = async (data) => {
    try {
      search_errors.value = {}
      const result = await fetchPost(`topic/category/filter?limit=${limit.value}&page=${page.value}`, data)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          category.value = response.data.category
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
      newTopic.value = null
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
          newTopic.value = response.data.topic
          topics.value.unshift(response.data.topic)
          updatePaginationTopic('add')
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
      newCategory.value = null
      topicSuccess.value = false
      errors.value = {}
      const schemaProject = valideCreateCategory()
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
          newCategory.value = response.data.category
          topicCategory.value.unshift(response.data.category)
          category.value.unshift(response.data.category)
          updatePaginationCateg('add')
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

  const destroyTopic = async (topic_id) => {
    try {
      if (topic_id && topic_id !== undefined) {
        topicSuccess.value = false
        errors.value = {}
        const result = await fetchDestroy(`topic/delete/${topic_id}`)
        const response = await handleAppError(result)
        if (response.status === true) {
          if (response.errors) {
            errors.value = response.errors
          }
        } else {
          topics.value = topics.value.filter((e) => e._id !== topic_id)
          updatePaginationTopic('delete')
          successNotify('Thématique supprimée')
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

  const getAllCategory = async () => {
    try {
      search_errors.value = {}
      const result = await fetchGet(
        `topic/category-get?limit=${limit.value}&page=${pageCateg.value}`,
      )
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          category.value = response.data.category
          totalCateg.value = response.data.total
          pageCateg.value = response.data.page
          limit.value = response.data.limit
          totalPagesCateg.value = response.data.totalPages
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const updateCategory = async (data) => {
    try {
      topicSuccess.value = false
      errors.value = {}
      const schemaProject = valideUpdateCategory()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPut(`topic/category/${data_result.category_id}/update`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          topicSuccess.value = true
          let categ_index = category.value.findIndex((item) => item._id === data_result.category_id)
          category.value[categ_index] = response.data.category
          successNotify('Catégorie modifié')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const destroyCategory = async (category_id) => {
    try {
      if (category_id && category_id !== undefined) {
        topicSuccess.value = false
        errors.value = {}
        const result = await fetchDestroy(`topic/category/${category_id}/delete`)
        const response = await handleAppError(result)
        if (response.status === true) {
          if (response.errors) {
            errors.value = response.errors
          }
        } else {
          category.value = category.value.filter((e) => e._id !== category_id)
          updatePaginationCateg('delete')
          successNotify('Catégorie supprimée')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
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
    createCategory,
    newTopic,
    newCategory,
    destroyTopic,
    category,
    getAllCategory,
    totalCateg,
    pageCateg,
    totalPagesCateg,
    updateCategory,
    destroyCategory,
    filterCategory
  }
})
