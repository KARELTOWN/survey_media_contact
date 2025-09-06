import { fetchGet, fetchPost } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import userValidator from '@/validator/user'
import { successNotify } from '@/utils/notification'
const { validateAddUser } = userValidator()
export const userStore = defineStore('user-store', () => {
  const errors = ref({})
  const search_errors = ref({})
  const users = ref([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(15)
  const totalPages = ref(0)
  const userSuccess = ref(false)
  const search_form = reactive({
    search: '',
    start_date: '',
    end_date: '',
    status: '',
  })
  const directions = ref([])
  const fonctions = ref([])
  const roles = ref([])

  let selectUser = ref('')
  let openModal = ref(false)

  const updatePagination = () => {
    total.value += 1
    totalPages.value = Math.ceil(total.value / limit.value)
  }

  const getUserAccountParams = async () => {
    try {
      const result = await fetchGet(`users/params`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          roles.value = response.data.roles
          fonctions.value = response.data.fonctions
          directions.value = response.data.directions
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const getUsers = async () => {
    try {
      const result = await fetchGet(`users/get?limit=${limit.value}&page=${page.value}`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          users.value = response.data.users
          total.value = response.data.total
          page.value = response.data.page
          limit.value = response.data.limit
          totalPages.value = response.data.totalPages
          console.log('response.data', response.data)
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const changeStatus = async (data) => {
    try {
      search_errors.value = {}
      userSuccess.value = false
      const result = await fetchPost(`users/change_account_status`, data)
      const response = await handleAppError(result)
      if (response.status === false) {
        userSuccess.value = true
        successNotify('Status changé')
      } else {
        if (response.errors) {
          search_errors.value = response.errors
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const filterUsers = async (data) => {
    try {
      search_errors.value = {}
      const result = await fetchPost(`users/filter?limit=${limit.value}&page=${page.value}`, data)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          users.value = response.data.users
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

  const createUser = async (data) => {
    try {
      userSuccess.value = false
      errors.value = {}
      const schemaProject = validateAddUser()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPost(`users/create`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          userSuccess.value = true
          users.value.unshift(response.data.user)
          updatePagination()
          successNotify('Utilisateur créé')
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
    createUser,
    getUsers,
    errors,
    users,
    total,
    page,
    limit,
    totalPages,
    userSuccess,
    filterUsers,
    search_errors,
    search_form,
    selectUser,
    openModal,
    changeStatus,
    getUserAccountParams,
    directions,
    fonctions,
    roles,
  }
})
