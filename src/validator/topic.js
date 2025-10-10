import * as yup from 'yup'

export default function topicValidator() {
  const validateCreate = () => {
    return yup.object({
      libelle: yup
        .string()
        .required('Le nom de la thématique est obligatoire')
        .min(1, 'Minimum un caractère')
    })
  }

  const validateUpdate = () => {
    return yup.object({
      libelle: yup
        .string()
        .required('Le nom de la thématique est obligatoire')
        .min(1, 'Minimum un caractère'),
      topic_id: yup.string().required('Le topic est obligatoire'),
    })
  }

  return {
    validateCreate,
    validateUpdate
  }
}
