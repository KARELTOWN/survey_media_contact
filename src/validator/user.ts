import * as yup from 'yup'

export default function userValidator() {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

  const validateAddUser = () => {
    return yup.object({
      firstname: yup
        .string()
        .min(1, 'Le prénom doit avoir au moins 1 caractère')
        .required('Email obligatoire'),
      lastname: yup
        .string()
        .min(1, 'Le prénom doit avoir au moins 1 caractère')
        .required('Email obligatoire'),
      email: yup.string().email('Email invalide').required('Email obligatoire'),
      direction_id: yup.string().required('La direction est obligatoire'),
      fonction_id: yup.string().optional(),
      role_id: yup.string().required('Le role est obligatoire'),
      phone: yup
        .string()
        .required('Le téléphone est obligatoire')
        .matches(/^\d+$/, 'Le téléphone doit contenir uniquement des chiffres'),

      code: yup
        .string()
        .required('Le code pays est obligatoire')
        .matches(
          /^\+\d+$/,
          'Le code pays doit commencer par + et contenir uniquement des chiffres',
        ),
    })
  }

  return {
    validateAddUser,
  }
}
