import * as yup from 'yup'

export default function userValidator() {
  const validateInviteUser = () => {
    return yup.object({
      email: yup.string().email('Email invalide').required('Email obligatoire'),
      role_id: yup.string().required('Le role est obligatoire'),
    })
  }

  return {
    validateInviteUser,
  }
}
