import { fetchDestroy, fetchGet, fetchPost, fetchPut } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { successNotify } from '@/utils/notification'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const analyticsDimensionStore = defineStore('analytics-dimension-store', () => {
  const formations = ref([])
  const modules = ref([])
  const chapters = ref([])
  const trainers = ref([])
  const sessions = ref([])
  const errors = ref({})

  const getDimensions = async () => {
    try {
      const result = await fetchGet('analytics-dimensions')
      const response = await handleAppError(result)
      if (response.status === false && response.data) {
        formations.value = response.data.formations || []
        modules.value = response.data.modules || []
        chapters.value = response.data.chapters || []
        trainers.value = response.data.trainers || []
        sessions.value = response.data.sessions || []
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const saveDimension = async (resource, payload, id = null) => {
    try {
      errors.value = {}
      const result = id
        ? await fetchPut(`analytics-dimensions/${resource}/${id}`, payload)
        : await fetchPost(`analytics-dimensions/${resource}`, payload)
      const response = await handleAppError(result)
      if (response.status === true) {
        errors.value = response.errors || {}
        return false
      }
      successNotify(id ? 'Element modifie' : 'Element ajoute')
      await getDimensions()
      return true
    } catch (err) {
      const result = handleCatchError(err)
      if (result) errors.value = result
      return false
    }
  }

  const deleteDimension = async (resource, id) => {
    try {
      const result = await fetchDestroy(`analytics-dimensions/${resource}/${id}`)
      const response = await handleAppError(result)
      if (response.status === true) return false
      successNotify('Element supprime')
      await getDimensions()
      return true
    } catch (err) {
      handleCatchError(err)
      return false
    }
  }

  const modulesByFormation = computed(() => (formationId) => {
    if (!formationId) return modules.value
    return modules.value.filter((module) => module.formation_id?._id === formationId)
  })

  const chaptersByModule = computed(() => (moduleId) => {
    if (!moduleId) return chapters.value
    return chapters.value.filter((chapter) => chapter.module_id?._id === moduleId)
  })

  const sessionsByFormation = computed(() => (formationId) => {
    if (!formationId) return sessions.value
    return sessions.value.filter((session) => session.formation_id?._id === formationId)
  })

  return {
    formations,
    modules,
    chapters,
    trainers,
    sessions,
    errors,
    getDimensions,
    saveDimension,
    deleteDimension,
    modulesByFormation,
    chaptersByModule,
    sessionsByFormation,
  }
})
