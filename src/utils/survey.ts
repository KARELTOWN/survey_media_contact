import { getUUID } from './uuid'

export const survey_allowed_upload_types = ['image', 'video', 'pdf', 'word', 'excel', 'powerpoint']

export const surveyGetFieldParams = (type_field) => {
  let field_params = {}
  if (type_field == 'radio' || type_field == 'checkbox' || type_field == 'select') {
    field_params.options = [
      { value: 'Option 1', img: '', default: false },
      { value: 'Option 2', img: '', default: false },
      { value: 'Option 3', img: '', default: false },
    ]
  }

  if (type_field == 'file') {
    field_params.accept = survey_allowed_upload_types
    field_params.max_size = 10 // En Mo
    field_params.multiple = false
  }

  if (type_field == 'text') {
    field_params.maxlength = 255
    field_params.disabled = true
    field_params.value = ''
    field_params.placeholder = 'Ecrivez votre réponse ici ...'
  }

  if (type_field == 'textarea') {
    field_params.rows = 4
    field_params.cols = 4
    field_params.value = ''
    field_params.disabled = true
    field_params.maxlength = 1000
    field_params.placeholder = 'Ecrivez votre réponse ici ...'
  }

  if (type_field == 'review') {
    field_params.rating = 5
  }

  if (type_field == 'date') {
    field_params.max_date = null
    field_params.min_date = null
  }

  if (type_field == 'hour') {
  }

  if (type_field == 'number') {
    field_params.max = 1000
    field_params.min = 0
  }
  return field_params
}

export const surveyGetFieldFromType = {
  'Réponse courte': 'text',
  Paragraphe: 'textarea',
  'Choix multiple': 'radio',
  'Case à cocher': 'checkbox',
  'Liste déroulante': 'select',
  Fichier: 'file',
  Avis: 'review',
  Chiffre: 'number',
  Date: 'date',
  Heure: 'hour',
}

export const defaultQuestion = {
  question_id: getUUID(),
  title: '',
  type_field: 'text',
  field_libelle: 'Réponse courte',
  field_params: {
    maxlength: 255,
    disabled: true,
    value: '',
    placeholder: 'Ecrivez votre réponse ici ...',
  },
}
