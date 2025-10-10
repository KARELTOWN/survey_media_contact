import * as yup from 'yup'

export default function companyValidator() {
  const validateCreate = () => {
    return yup.object({
      denomination: yup.string().required('Dénomination obligatoire'),
      logo: yup.string().required('Logo obligatoire'),
      phone: yup
        .string()
        .required('Téléphone obligatoire')
        .matches(/^\+?[0-9]{8,15}$/, 'Numéro de téléphone invalide'),

      adress: yup.string().required('Adresse est obligatoire'),
      open_hours: yup.string().required("Heures d'ouvertures est obligatoire"),
    })
  }

  const validateUpdate = () => {
    return yup.object({
      denomination: yup.string().required('Dénomination obligatoire'),
      company_id: yup.string().required('Société obligatoire'),
      logo: yup.string().required('Logo obligatoire'),
      phone: yup
        .string()
        .required('Téléphone obligatoire')
        .matches(/^\+?[0-9]{8,15}$/, 'Numéro de téléphone invalide'),
      adress: yup.string().required('Adresse est obligatoire'),
      open_hours: yup.string().required("Heures d'ouvertures est obligatoire"),
    })
  }

  return {
    validateCreate,
    validateUpdate,
  }
}
