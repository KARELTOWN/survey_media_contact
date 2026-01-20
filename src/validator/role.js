import * as yup from 'yup'

export default function topicValidator() {
  const validateCreate = () => {
    return yup.object({
      libelle: yup.string().required('Le libelle est obligatoire').min(1, 'Minimum un caractère'),
    })
  }

  const validateUpdate = () => {
    return yup.object({
      libelle: yup.string().required('Le libelle est obligatoire').min(1, 'Minimum un caractère'),
      role_id: yup.string().required('Le role est obligatoire'),
    })
  }

  const validateUpdatePermission = () => {
    return yup.object({
      permission_id: yup.string().required('La permission est obligatoire'),
    })
  }
  return {
    validateCreate,
    validateUpdate,
    validateUpdatePermission,
  }
}
