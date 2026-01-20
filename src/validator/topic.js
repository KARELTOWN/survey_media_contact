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
      topic_id: yup.string().required('La thématique est obligatoire'),
    })
  }

  const valideCreateCategory = () => {
    return yup.object({
      libelle: yup
        .string()
        .required('Le nom de la thématique est obligatoire')
        .min(1, 'Minimum un caractère'),
      topic_id: yup.string().required('La thématique est obligatoire'),
    })
  }
  const valideUpdateCategory = () => {
    return yup.object({
      libelle: yup
        .string()
        .required('Le nom de la thématique est obligatoire')
        .min(1, 'Minimum un caractère'),
      topic_id: yup.string().required('La thématique est obligatoire'),
      category_id: yup.string().required('La catégorie est obligatoire'),
    })
  }

  return {
    validateCreate,
    validateUpdate,
    valideCreateCategory,
    valideUpdateCategory
  }
}
