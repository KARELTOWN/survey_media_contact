import * as yup from 'yup'

export default function configValidator() {
  const validateHeaderConfig = () => {
    return yup.object({
      logo: yup.string().required('Logo obligatoire'),
      phone: yup
        .string()
        .required('Téléphone obligatoire')
        .matches(/^\+?[0-9]{8,15}$/, 'Numéro de téléphone invalide'),

      adress: yup.string().required('Adresse obligatoire'),
      open_hours: yup.string().required("Les heures d'ouvertures sont obligatoires"),
    })
  }

  return {
    validateHeaderConfig,
  }
}
