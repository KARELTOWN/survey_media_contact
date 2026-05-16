import { getUUID } from './uuid'
import { surveyStore } from '@/stores/survey/surveyStore'
import { storeToRefs } from 'pinia'


export const getSurveyStoreRefs = () => {
  const store = surveyStore()
  const { questionsFieldType, logicOperators } = storeToRefs(store)
  return { questionsFieldType, logicOperators }
}

export const survey_allowed_upload_types = ['image', 'video', 'pdf', 'word', 'excel', 'powerpoint']

export const surveyDefaultFieldTypes = [
  { libelle: 'Reponse courte', field: 'text' },
  { libelle: 'Paragraphe', field: 'textarea' },
  { libelle: 'Choix multiple', field: 'radio' },
  { libelle: 'Case a cocher', field: 'checkbox' },
  { libelle: 'Liste deroulante', field: 'select' },
  { libelle: 'Fichier', field: 'file' },
  { libelle: 'Avis', field: 'review' },
  { libelle: 'Echelle de satisfaction', field: 'range' },
  { libelle: 'Chiffre', field: 'number' },
  { libelle: 'Date', field: 'date' },
  { libelle: 'Heure', field: 'hour' },
]

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
    field_params.accept = []
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

  if (type_field == 'range') {
    field_params.min = 1
    field_params.max = 5
    field_params.step = 1
    field_params.min_label = 'Pas satisfait'
    field_params.max_label = 'Très satisfait'
  }

  if (type_field == 'date') {
    field_params.max_date = null
    field_params.min_date = null
  }

  if (type_field == 'hour') {
    field_params.max = ''
  }

  if (type_field == 'number') {
    field_params.max = 1000
    field_params.min = 0
  }
  return field_params
}

export const surveyGetFieldFromType = (name) => {
  const { questionsFieldType } = getSurveyStoreRefs()
  const fieldTypes = questionsFieldType.value?.length ? questionsFieldType.value : surveyDefaultFieldTypes
  let field = fieldTypes.find((e) => e.libelle === name)
  if (field && field !== undefined) {
    return field.field
  }
  return 'text'
}

export const defaultQuestion = {
  question_id: getUUID(),
  category: 'question',
  title: '',
  type_field: 'text',
  field_libelle: 'Réponse courte',
  required: false,
  field_params: {
    maxlength: 255,
    disabled: true,
    value: '',
    placeholder: 'Ecrivez votre réponse ici ...',
  },
  condition: {
    display: 'show',
    compareTo: '',
    operator: '',
    target: '',
  },
}

export const emailQuestionField = {
  question_id: getUUID(),
  category: 'question',
  title: 'Email',
  type_field: 'email',
  field_libelle: 'Email',
  required: true,
  field_params: {
    maxlength: 255,
    disabled: true,
    value: '',
    placeholder: 'Ecrivez votre adresse email ici ...',
    class:'pointer-events-none'
  },
  condition: {
    display: 'show',
    compareTo: '',
    operator: '',
    target: '',
  },
}

export const defaultTitleAndDesription = {
  question_id: getUUID(),
  category: 'title_description',
  title: '',
  description: '',
  condition: {
    display: 'show',
    compareTo: '',
    operator: '',
    target: '',
  },
}

export const defaultImage = {
  question_id: getUUID(),
  category: 'image',
  img: '',
  condition: {
    display: 'show',
    compareTo: '',
    operator: '',
    target: '',
  },
}

export const fieldExluseFromComparaison = ['file', 'hour']
export const defaultFileImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAQAAABecRxxAAAPgElEQVR42uzYP0uVcRQH8KyhoBoLiiAcImppMggkGhwSIlqkVxEI9znP9UaC1exQkBiY4SSljjZUz+JLaEiIJqGlFqM/S+FpuItDf256Lz7K5/N9C+d7OL/fPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgM1GDhTHy3PNwWKoMRwj8sdcbQ6OnjAv7AHlqcZw2Yy5WIm1+BkpHWe9fFFG0W+G2IWaF4rRYiE+KPL/psx7OZkP81FO5t2MjVgpb0zsN1HsCrcOltfLGcXfWu7kTC5ntSnLOZPjGW+KK2aLeusrhmIu1tV4q5nKl1n9Jq9yKsssZovDhoxaah0rW/FehbeeZj7L6i+Zz7GM1Thj1qiZ8mxMx3cV3l79F7L6RxazlfGxMWDiqI2iPx77299+nrRL3skK+Nq4bO6ogfJkMav83cj9rDrMUrYyPheXTB87auJQ3C6+qG53Mp9Vx1m0AthpzcFYVdtuZTxfZ9WOhwB1N3EkpmNDbbuXB1m14yFA3TUG4p3KdjdP27V2BVBzfTEWPxS2Jz8ArgDqrTxaLChrL/I8q6xcAdRZ43S8VdUeLgBXAPXVOB9rilqvBdDOkiuAXisvxic17ekCsAKoq7gW35S0xwvACqCe4qZ//1/s3b+Lz3EcwPEvQmwGpcRCVlLKbPAfiFXKQAbc6+OuM5wSC4tSBjpEOb8GJuVTNvEH2MQkGcQtTi5vw03uForP+929Hs/Xn6DXo9f76+6+gwHgswC11di+mLOggwDgClBrnd7jp/0HAgABaq3x7fHRcg4EAALUVic3x3urOTAAPgtQM7/s+9piDgqAK0Dt1F23loMCgAC109gRS1kBAA8BtVBsi1lLOTgArgC10NHVXv9VAHAFqIXGJi1kFQBcAarfqR3xzUJWAAABaqAV8cI6VgPAQ0B1i4OWsRoArgDV7eS6eGcZKwGAANUuOqtYFQAPAVX9a/+frGJFAFwBqlmctYhVAXAFqF5T6/3Vv8oAuAJUrzhuDasCgADVa2qlr/tqAAAPAdUp9lvC6gC4AlQrX/lVHQAEqFYTG+O7JWwAAA8B1ag7ZgUbAMAVoDr5BaAGAECA6hSbYt4KNgGAh4CGrztsAZsAwBWgGnUzFrABABCgGh1YFZ8tYCMAeAho6GKX9WsEAFeA/BcgABCgAYs71g8AHgJpizfWDwCugKSdWBs/rB8AEJC02G35AOAhkLaxQ5YPAK6AtHUTlg8ACEhbXLN8AEBA2uKp5QOAzwLSFi8tHwBcAWnzp0ABgIDE+S4gAHgIJC5mLR8AXAFpiznLBwAEpC1+Wj4AeAikzeoBwBUAAAMABADAAAABADAAQAAADAAQAAADAAQAwAAAAQAw/wsABAgAAECAAAAABAgAAECAAAAABAgAAECAAAAABAgAAECAAAAABAgAAECAAAAABAgAAECAAAAABAgAAECAAACAoQj42u21WQAwfwcAAgQAACBAAAAAAgQAACBAAEgw90q/zOYhAgBg/nTulr70rgABIOfcLj0CBICsc2NhZTwEBICMc6X0pXcFCAA552LpESAAZJ3JhWXxEBAAcs6T0rsCBICsc7P0CBAAss7l0pfeQ0AAyDnj5VnpM1wBX87stHcAMEvmVulTENB9OLPV5gHALJoLpU8w90tX4tXUGrsHALNoHqUgYLpEiXOjZdFKhOjf9XaUoS2jDaPR+Kkd/r1dAOa36crjFDfAgxKlm7F9ADCL5nx5noKAqRLzbgAAmCUznQKAqyVKXPIZwC/27SAlqygAw/BrMyfR2A00riW0izZSUBAtrZDAqIEQaJllakSBhAZqWXqTf5b9iUkDvT3Pt4ELl/PCGRw4YaW9xu9a1e2HVwQAfvGjxY4au9mqub2bAgAnfGmpsZuparglAPCb9602bodVzdwQAJhitY3GbLeJ6wIAUy33tvHaqWqYEwCYamil5YbGaOhTE1cFAP5ovWd9a3w+dNDErADAKT73pK3G5ajVymMgOIODnrfY18ZjuX0BgLP72Hyv+94YrLVZAgB/47A3Peplu11mQ6+OlwDAeSLwrvkW2mi/y2i7hdZKAOD8tlvq8fFetN5W+w1ddEO7bfa0hXb8Ps+B7V/v7nBveHBhd3+4c8q3O4ECYP/xXAEAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEAAQAEAAAAEABAAQAEAAAAEABAAQAPjZ3t3+al3XcQD/HEIU0rURztt6oBF4w9aaUmpWForLBzUZPqnMbuZ6INPjub6/C8gHZ7Yxe1CDnhQDcsMlDSe5mg8qpCQEbc4iJnQoBBQ07g4IQpxzkF8sV44xU/A6v+/vOtfr9f4PPvt83rvuLxQAoAAABQAoAEABAAoAUACAAhjJ47w0psR1cYO0PNfFlLjUwrbYaCNolQ/FjXFljDOIYXUkNsbqOGgQHgHUSVd8JmbFNc5/2I2La2JW3BBdRqEA6jPE22OaB1OVOStujtutrgKoi1tjiiFUbErcYggKoA6uiKmGkMGnY7IhKID8A/yiIWQyLT5gCAogr4kxwRAymRCXG4ICyOsKI8jHkwAFkNslRpDRpUagAPI6zwhMXwF0LC9D+SCrAuhkbxhBRoeMQAHk1W8Epq8AOtdmI8iozwgUQF4b45ghZDIUmwxBAeR1KJ4zhEye8wqMAshvdew1hAz2xGpDUAD5DcSyOGIMFTscy2LQGBRAHeyLhfGaMVRodyz2DoACqI/X42exMgYMogJH43exKPYbhAKok6FYEz+M5fFCbIu9sV9anr2xLV6I5fGjeCaGLBxvSaVIvngEACgAQAEACgBQAIACABQAoAAABQAoAEABAAoAUACAAgAUAKAAAAUAKABAAQAKAFAAgAIAFACgAAAFACgAQAEACgAUAKAAAAUAKABAAQAKAFAAgAIAFACgAAAFwAnjY2pMjxkxU1qeGTE9psZ4S9ZSo42gVSbGTXGxMQy7V+Op2GIMHgHUyZi4I77q/CtxcXw9ZsYYg1AAdXFOfCuuNIYKXRXfjHOMQQHUY4Qz4kJjqNhFcYflVQB18KmYaAgZXBbXGoICyO3suNEQMvmcVwIUQG6TY5whZDIuJhuCAshrkhGYvgLoXBcYQT5efFUAuZ1nBKavACCH0ggUQF4HjSCjQ0agAPLabQQZ7TICBZDX34zA9BVAJ6/gEUPI5HD0GYICyGswVhtCJk/HoCEogNz+FJsNIYMt8bwhKID8jseKeM0YKvZqLI/jxqAA6uBoPBwvGkOFNsTDMWAMCqAuBuOxeCR2GkQFdsTSeDyGDEIB1MuWWBQL4slYGxviRWl5NsS6eDIWxOJ4ybLxX6kUyRe/Cgx4CgAoAEABAAoAUACAAgAUAKAAAAUAKABAAQAKAFAAgAIAFACgAAAFACgAQAEACgBQAIACABQAoAAABQAoAEABgAIAFACgAAAFACgAQAEACgBQAIACABQAoACIs+Pq+ErcFffEvdLy3BN3xZfjqhhj0XhbKuuR75W/LvvLwzLs6S9/Vc4tU03iAhXAicwrtznNCrO1nKcAqEsB/KDc4ygrzp7yIQVAHQrggfJlB5kh28sHFAD5V2ClY8yU3yoAci/Ag+XrTjFTDpQPKgAFkDePO8SMeUwBKIC8+aszzJj1CkAB5M1OZ5gxOxSAAsibA84wYw4oAAWQN3udYcbsVQAKIGt8AjBrtioABZA3f3SGGbNaASiAvFnsDDNmkQJQAHnTLLc7xEx5uWwqAAWQO0ucYqYs9lFgUpk/qxxjhqz0bUDqUQDN8lkHWXHWlU0FQF1+EKQon/CRoMpyoPylXwTi5ALIn++XT/thkGHPnvIPJyadFACnFkD+NMv55dJyRfmEtDwrTkx2/lsP/BUAbxeAiALws+CAAgAUAKAAAAUAKABAAQAKAFAAoAAABQAoAEABtAffxyKf4wogt0FbiO1TAFC9AQWQ21FbiO3r2ALo2m8LyaZfAWRW7rOF2L6OLYDYaw3JpUsBZLfTGpLNDgWQ23ZbSDbbos2NjjZXbuuyhuSy1SOAzI732UJyGbVZAWQ2tDGGLCJZDI3tUwC5DcRmm0gWm3wUuA7+bBPJ4i++DVgHa20iOZRrFEANlM9YRWxex+odlfb5k0qpPLvDO9D1kH5hHaXyPOLyaiLdZR2l6jS+5vJqYu4F6ZiFlEozNOd8l1cbaZWVlErzG1dXI8V3raRUmca3XV2N9ExIA5ZSKsu/use7ulpJy62lVJafu7iaKW62llJVGl9wcTXTO6ros5hSSTb5CJAXAqVz8x3XVkPdY9NuyynDnl2957i2WkpzracMd4rk0mqq99y0y4LKsGZ377kurbZSw4rKcKZxnyursd4xjb9bUhmuFH2zznZltZZmWFPx/n8HS09ZVBmWPOq62kCamI5YVml5DhYXu662kGZbV2l57nVZbaJ3dHrWwkpLs7p3tMtqG7MvSwctrbQs+5ofdVVtpfiGtZUW5c10q4tqO2mh1ZVWpDHPNbWhu89KayyvvO+su/ss19SW7rsovWSB5X3lH+lCl9S20uXpn5ZYzji77/+4K2prxTXeD5AzzMH0SRfU9oqb0lHLLKedgXSL6xkRGnekIQstp5XBNNPljBiNaZ4IyGnkcOM2VzOiFFPTHost7yn96QYXM+IUV6TtllveNTubU1zLiHT/R9IGCy7/N+u7L3EpI1b32GKBJZd3SmNp44OuZIRLd6Y3rLqckiP+8KND9ExO6y28nJSNjatdRsfoHZd+nI5Ze/lPhtL87rGuosOkT6S1ll+K53uudQ2dqSvd6f8EOzr96d7eUQ6hg/VMSD9NA06hAzOYftI93gUQcy9oPJQOO4kOyptp+eyP2Xz+Z875RW/a7zQ6IEcbS4tJNp5TdI8vmmmzExm5KfpSMefDNp131tX4fFqS+h3LCMu+YnHPZ6PLgvPe/mX4trTQl4dGRLanhelLftiTM9C8Ks0qlqVXnFEb5pX0aHFPz5W2mFb8vvAtqZGWpN+nrX5dqLYZSlvTqrQkNYqb77vI1jI8unomFJOa1zemNaenmZI7zemNac3ri0k9EzzDBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATvZvlMrbnx2EWCsAAAAASUVORK5CYII="
