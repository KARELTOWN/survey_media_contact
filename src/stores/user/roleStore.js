import { fetchGet, fetchPost, fetchPut } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { successNotify } from '@/utils/notification'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import role from '@/validator/role'
const { validateCreate, validateUpdate, validateUpdatePermission } = role()
export const roleStore = defineStore('role-store', () => {
  const errors = ref({})
  const roles = ref([])
  const roleSuccess = ref(false)
  const permissions = ref([])
  const selectRole = ref({})
  const role = ref({})

  const getRoles = async () => {
    try {
      const result = await fetchGet(`roles/get`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          roles.value = response.data
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const storeRole = async (data) => {
    try {
      roleSuccess.value = false
      errors.value = {}
      const schemaProject = validateCreate()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPost(`roles/create`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          roleSuccess.value = true
          roles.value.unshift(response.data.role)
          successNotify('Role créé')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const updateRole = async (data) => {
    try {
      roleSuccess.value = false
      errors.value = {}
      const schemaProject = validateUpdate()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPut(`roles/update/${data_result.role_id}`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          roleSuccess.value = true
          let role_index = roles.value.findIndex((item) => item._id === data_result.role_id)
          roles.value[role_index] = response.data.role
          successNotify('Role modifié')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const getPermissions = async (role_id) => {
    try {
      const result = await fetchGet(`roles/permissions/${role_id}`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          permissions.value = response.data.permissions
          role.value = response.data.role
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const updatePermission = async (data) => {
    try {
      roleSuccess.value = false
      errors.value = {}
      const schemaProject = validateUpdatePermission()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPut(
        `roles/update_permission/${data_result.permission_id}`,
        data_result,
      )
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
          roleSuccess.value = true
          successNotify('Permission modifiée')
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  return {
    getRoles,
    roles,
    errors,
    roleSuccess,
    storeRole,
    updateRole,
    getPermissions,
    updatePermission,
    permissions,
    selectRole,
    role
  }
})
