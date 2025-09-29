import { get_account_type } from '@/composables/request'
import * as yup from 'yup'

export default function configValidator() {
  const validateHeaderConfig = () => {
    return yup.object({
      logo: yup.string().required('Logo obligatoire'),
      phone: yup
        .string()
        .nullable()
        .notRequired()
        .test('is-valid-phone', 'Numéro de téléphone invalide', (value) => {
          const account_type = get_account_type()
          if (account_type === 'enterprise') {
            if (!value)
              return this.createError({
                message: 'Le téléphone est obligatoire pour une entreprise',
              })
          }
          if (!value) return true // autorise vide ou null
          return /^\+?[0-9]{8,15}$/.test(value)
        }),

      adress: yup
        .string()
        .test('required-if-enterprise', 'Adresse est obligatoire', function (value) {
          const account_type = get_account_type()

          if (account_type === 'enterprise') {
            return !!value
          }
          return true
        }),
      open_hours: yup
        .string()
        .test('required-if-enterprise', "Heures d'ouvertures est obligatoire", function (value) {
          const account_type = get_account_type()
          if (account_type === 'enterprise') {
            return !!value
          }
          return true
        }),
    })
  }

  return {
    validateHeaderConfig,
  }
}
