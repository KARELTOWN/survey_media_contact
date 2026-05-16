<template>
    <Modal v-if="props.open === true">
        <template #body>
            <div
                class="no-scrollbar relative mx-4 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-[980px] overflow-y-auto overscroll-contain rounded-[28px] bg-white p-6 shadow-xl dark:bg-gray-900 md:p-8">
                <button @click="$emit('close')"
                    class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div class="mb-8">
                    <h5 class="text-3xl font-semibold text-gray-800 dark:text-white/90">Parametres d'enquete</h5>
                    <p class="mt-2 text-sm text-gray-500">Configurez la collecte, les couleurs et les contenus visibles sur la page publique.</p>
                </div>

                <div class="space-y-8">
                    <section class="grid gap-6 lg:grid-cols-2">
                        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                            <h6 class="mb-1 text-base font-semibold text-gray-800">Collecte</h6>
                            <p class="mb-5 text-sm text-gray-500">Mode de reponse attendu.</p>

                            <div class="space-y-5">
                                <div>
                                    <label class="mb-3 block text-sm font-medium text-gray-700">Mode de reponse</label>
                                    <div class="grid gap-2 sm:grid-cols-3">
                                        <button type="button" @click="formSurvey.response_mode = 'anonymous'"
                                            :class="radioButtonClass(formSurvey.response_mode === 'anonymous')">Anonyme</button>
                                        <button type="button" @click="formSurvey.response_mode = 'semi_anonymous'"
                                            :class="radioButtonClass(formSurvey.response_mode === 'semi_anonymous')">Semi-anonyme</button>
                                        <button type="button" @click="formSurvey.response_mode = 'identified'"
                                            :class="radioButtonClass(formSurvey.response_mode === 'identified')">Identifie</button>
                                    </div>
                                </div>

                                <div>
                                    <label class="mb-3 block text-sm font-medium text-gray-700">Soumissions multiples</label>
                                    <div class="flex flex-wrap gap-3">
                                        <button type="button" @click="formSurvey.multiple_submission = true"
                                            :class="radioButtonClass(formSurvey.multiple_submission === true)">Oui</button>
                                        <button type="button" @click="formSurvey.multiple_submission = false"
                                            :class="radioButtonClass(formSurvey.multiple_submission === false)">Non</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                            <h6 class="mb-1 text-base font-semibold text-gray-800">Periode d'ouverture</h6>
                            <p class="mb-5 text-sm text-gray-500">Disponibilite du formulaire.</p>

                            <div class="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label class="mb-2 block text-sm font-medium text-gray-700">Date debut</label>
                                    <flat-pickr v-model="formSurvey.start_date"
                                        :config="flatpickrConfig({ minDate: actualDate })" placeholder="Date debut"
                                        :class="flatpickrInputClass" />
                                </div>

                                <div>
                                    <label class="mb-2 block text-sm font-medium text-gray-700">Date fin</label>
                                    <flat-pickr v-model="formSurvey.end_date"
                                        :config="flatpickrConfig({ minDate: formSurvey.start_date || actualDate })"
                                        placeholder="Date fin" :class="flatpickrInputClass" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="rounded-2xl border border-gray-200 bg-white p-5">
                        <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h6 class="text-base font-semibold text-gray-800">Apparence</h6>
                                <p class="text-sm text-gray-500">Couleurs, logo, banniere, intro et pied de page.</p>
                            </div>
                            <select v-model="selectedThemeId" @change="applyThemePreset"
                                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm md:w-72">
                                <option value="">Personnalise</option>
                                <option v-for="theme in surveyDefaultThemes" :key="theme.id" :value="String(theme.id)">
                                    {{ theme.name }}
                                </option>
                            </select>
                        </div>

                        <div class="grid gap-6 lg:grid-cols-[1.25fr,0.9fr]">
                            <div class="grid gap-4 md:grid-cols-2">
                                <ColorField label="Couleur du header" v-model="headerBgColor" placeholder="#2B7FFF" />
                                <ColorField label="Couleur du texte du header" v-model="headerTextColor" placeholder="#FFFFFF" />
                                <ColorField label="Couleur de la page" v-model="pageBgColor" placeholder="#F5F7FB" class="md:col-span-2" />

                                <div>
                                    <label class="mb-2 block text-sm font-medium text-gray-700">Logo</label>
                                    <input id="survey-logo-upload" type="file" accept="image/*" class="hidden"
                                        @change="uploadThemeImage($event, 'logo_url')" />
                                    <div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                        <div class="mb-3 flex gap-2">
                                            <input v-model="logoUrl" type="text"
                                                class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                                                placeholder="https://.../logo.png" />
                                            <button type="button" @click="openImagePicker('survey-logo-upload')"
                                                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                Upload
                                            </button>
                                        </div>
                                        <div v-if="logoUrl" class="flex items-center gap-3">
                                            <img :src="logoUrl" class="h-12 w-20 rounded-lg border border-gray-200 object-contain" />
                                            <button type="button" @click="clearThemeImage('logo_url')"
                                                class="text-sm font-medium text-red-600">Retirer</button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label class="mb-2 block text-sm font-medium text-gray-700">Banniere</label>
                                    <input id="survey-banner-upload" type="file" accept="image/*" class="hidden"
                                        @change="uploadThemeImage($event, 'banner_url')" />
                                    <div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                        <div class="mb-3 flex gap-2">
                                            <input v-model="bannerUrl" type="text"
                                                class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                                                placeholder="https://.../banniere.jpg" />
                                            <button type="button" @click="openImagePicker('survey-banner-upload')"
                                                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                Upload
                                            </button>
                                        </div>
                                        <div v-if="bannerUrl" class="space-y-2">
                                            <img :src="bannerUrl" class="h-24 w-full rounded-lg border border-gray-200 object-cover" />
                                            <button type="button" @click="clearThemeImage('banner_url')"
                                                class="text-sm font-medium text-red-600">Retirer</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <label class="mb-2 block text-sm font-medium text-gray-700">Image de fond</label>
                                    <input id="survey-background-upload" type="file" accept="image/*" class="hidden"
                                        @change="uploadThemeImage($event, 'container_bg_img')" />
                                    <div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                        <div class="mb-3 flex gap-2">
                                            <input v-model="backgroundImage" type="text"
                                                class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                                                placeholder="https://..." />
                                            <button type="button" @click="openImagePicker('survey-background-upload')"
                                                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                Upload
                                            </button>
                                        </div>
                                        <div v-if="backgroundImage" class="space-y-2">
                                            <img :src="backgroundImage" class="h-28 w-full rounded-lg border border-gray-200 object-cover" />
                                            <button type="button" @click="clearThemeImage('container_bg_img')"
                                                class="text-sm font-medium text-red-600">Retirer</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <label class="mb-2 block text-sm font-medium text-gray-700">Pied de page</label>
                                    <textarea v-model="footerText" rows="3"
                                        class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none"
                                        placeholder="Contact, confidentialite, signature..."></textarea>
                                </div>

                                <div class="md:col-span-2 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h6 class="text-sm font-semibold text-gray-800">Contact dans le pied de page</h6>
                                            <p class="text-xs text-gray-500">Affichez les informations du centre ou des valeurs personnalisees.</p>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <button type="button" @click="showFooterContact = !showFooterContact"
                                                :class="radioButtonClass(showFooterContact)">
                                                {{ showFooterContact ? 'Affiche' : 'Masque' }}
                                            </button>
                                            <button type="button" @click="useCompanyContact"
                                                class="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                Infos du centre
                                            </button>
                                        </div>
                                    </div>
                                    <div class="grid gap-3 md:grid-cols-2">
                                        <TextField label="Nom / centre" v-model="footerContactName" placeholder="Centre Survey MC" />
                                        <TextField label="Email" v-model="footerContactEmail" placeholder="contact@centre.com" />
                                        <TextField label="Telephone" v-model="footerContactPhone" placeholder="+225..." />
                                        <TextField label="Adresse" v-model="footerContactAddress" placeholder="Adresse du centre" />
                                        <TextField label="Horaires" v-model="footerContactHours" placeholder="Lun - Ven, 8h - 18h" class="md:col-span-2" />
                                    </div>
                                </div>

                                <div class="md:col-span-2 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <div class="mb-4 flex items-center justify-between">
                                        <div>
                                            <h6 class="text-sm font-semibold text-gray-800">Liens du pied de page</h6>
                                            <p class="text-xs text-gray-500">Ajoutez par exemple site web, confidentialite ou support.</p>
                                        </div>
                                        <button type="button" @click="addFooterLink"
                                            class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Ajouter</button>
                                    </div>
                                    <div class="space-y-3">
                                        <div v-for="(link, index) in footerLinks" :key="index" class="grid gap-2 md:grid-cols-[1fr,1.4fr,auto]">
                                            <input v-model="link.label" class="rounded-xl border border-gray-300 px-3 py-2 text-sm" placeholder="Libelle" />
                                            <input v-model="link.url" class="rounded-xl border border-gray-300 px-3 py-2 text-sm" placeholder="https://..." />
                                            <button type="button" @click="removeFooterLink(index)"
                                                class="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600">Retirer</button>
                                        </div>
                                        <p v-if="footerLinks.length === 0" class="text-sm text-gray-500">Aucun lien ajoute.</p>
                                    </div>
                                </div>

                                <div class="md:col-span-2 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <h6 class="mb-4 text-sm font-semibold text-gray-800">Mise en page</h6>
                                    <div class="grid gap-4 md:grid-cols-2">
                                        <ColorField label="Fond global" v-model="globalBgColor" placeholder="#F3F4F6" />
                                        <div>
                                            <label class="mb-2 block text-sm font-medium text-gray-700">Largeur du formulaire</label>
                                            <select v-model="formWidth" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
                                                <option value="narrow">Etroite</option>
                                                <option value="medium">Standard</option>
                                                <option value="wide">Large</option>
                                                <option value="full">Pleine largeur</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="mb-2 block text-sm font-medium text-gray-700">Alignement</label>
                                            <select v-model="formAlignment" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
                                                <option value="center">Centre</option>
                                                <option value="left">Gauche</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="mb-2 block text-sm font-medium text-gray-700">Espacement</label>
                                            <select v-model="formSpacing" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
                                                <option value="compact">Compact</option>
                                                <option value="normal">Normal</option>
                                                <option value="comfortable">Aere</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                <div class="mb-3 text-sm font-medium text-gray-700">Apercu rapide</div>
                                <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                    <div class="px-4 py-4" :style="{ backgroundColor: headerBgColor, color: headerTextColor }">
                                        <img v-if="logoUrl" :src="logoUrl" class="mb-3 h-10 max-w-32 rounded object-contain" />
                                        <div class="text-base font-semibold">Titre de l'enquete</div>
                                        <div class="mt-1 text-sm opacity-90">En-tete personnalise</div>
                                    </div>
                                    <div class="space-y-3 px-4 py-5" :style="previewContainerStyle">
                                        <img v-if="bannerUrl" :src="bannerUrl" class="h-24 w-full rounded-xl object-cover" />
                                        <div class="rounded-xl bg-white/90 p-3 shadow-sm">
                                            <div class="mb-2 text-sm font-medium text-gray-700">Exemple de question</div>
                                            <div class="h-10 rounded-lg border border-gray-200 bg-white"></div>
                                        </div>
                                        <p v-if="footerText" class="text-center text-xs text-gray-500">{{ footerText }}</p>
                                        <div v-if="showFooterContact" class="rounded-lg bg-white/80 p-2 text-xs text-gray-500">
                                            <div class="font-semibold text-gray-700">{{ footerContactName }}</div>
                                            <div>{{ footerContactEmail }} {{ footerContactPhone }}</div>
                                            <div>{{ footerContactAddress }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import Modal from '@/components/profile/Modal.vue';
import { surveyStore } from '@/stores/survey/surveyStore';
import { flatpickrConfig } from '@/utils/format';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, h, ref, watch } from 'vue';
import { surveyDefaultThemes } from '../../../config/theme';
import { configStore } from '@/stores/config/config.js';
import { isFileSizeAllowed } from '@/utils/file';
import { errorNotify, infoNotify, warningNotify } from '@/utils/notification';
import { companyStore } from '@/stores/company/companyStore';
import { get_account_id, get_account_type, uploadSurveyImage } from '@/composables/request';

const ColorField = defineComponent({
    props: ['label', 'modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    setup(props, { emit, attrs }) {
        return () => h('div', attrs, [
            h('label', { class: 'mb-2 block text-sm font-medium text-gray-700' }, props.label),
            h('div', { class: 'flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2' }, [
                h('input', {
                    value: props.modelValue || '#ffffff',
                    type: 'color',
                    class: 'h-10 w-12 rounded border-0 bg-transparent p-0',
                    onInput: (event) => emit('update:modelValue', event.target.value),
                }),
                h('input', {
                    value: props.modelValue,
                    type: 'text',
                    class: 'w-full bg-transparent text-sm text-gray-700 focus:outline-none',
                    placeholder: props.placeholder,
                    onInput: (event) => emit('update:modelValue', event.target.value),
                }),
            ]),
        ])
    },
})

const TextField = defineComponent({
    props: ['label', 'modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    setup(props, { emit, attrs }) {
        return () => h('div', attrs, [
            h('label', { class: 'mb-2 block text-sm font-medium text-gray-700' }, props.label),
            h('input', {
                value: props.modelValue,
                type: 'text',
                class: 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none',
                placeholder: props.placeholder,
                onInput: (event) => emit('update:modelValue', event.target.value),
            }),
        ])
    },
})

const config_store = configStore()
const { chooseTheme, setThemeProperties, updateThemeProperty } = config_store
const { themeProperties } = storeToRefs(config_store)

const store = surveyStore()
const { formSurvey } = storeToRefs(store)
const company_store = companyStore()
const { company } = storeToRefs(company_store)
const { getCompany } = company_store

const props = defineProps({
    open: Boolean,
})

const actualDate = moment().toDate()
const selectedThemeId = ref(themeProperties.value.id ? String(themeProperties.value.id) : '')
const flatpickrInputClass = 'h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:outline-none'

const radioButtonClass = (isActive) => [
    'rounded-full border px-5 py-2 text-sm font-medium transition',
    isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
]

const syncThemeToSurvey = () => {
    formSurvey.value.theme = { ...themeProperties.value }
}

const applyThemePreset = () => {
    if (selectedThemeId.value && chooseTheme(selectedThemeId.value) === true) {
        syncThemeToSurvey()
    }
}

const openImagePicker = (inputId) => {
    document.getElementById(inputId)?.click()
}

const uploadThemeImage = async (event, key) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
        warningNotify('Veuillez selectionner une image')
        return
    }

    if (!isFileSizeAllowed(file, 2)) {
        warningNotify("L'image ne doit pas depasser 2 Mo")
        return
    }

    try {
        selectedThemeId.value = ''
        infoNotify("Televersement de l'image en cours")
        const imageUrl = await uploadSurveyImage(file)
        updateThemeProperty(key, imageUrl)
        syncThemeToSurvey()
    } catch (error) {
        errorNotify(error.message || "Impossible de televerser l'image")
    }
}

const clearThemeImage = (key) => {
    selectedThemeId.value = ''
    updateThemeProperty(key, '')
    syncThemeToSurvey()
}

const createThemeBinding = (key) => computed({
    get: () => themeProperties.value?.[key] || '',
    set: (value) => {
        selectedThemeId.value = ''
        updateThemeProperty(key, value)
        syncThemeToSurvey()
    }
})

const headerBgColor = createThemeBinding('header_bg_color')
const headerTextColor = createThemeBinding('header_text_color')
const pageBgColor = createThemeBinding('container_bg_color')
const backgroundImage = createThemeBinding('container_bg_img')
const logoUrl = createThemeBinding('logo_url')
const bannerUrl = createThemeBinding('banner_url')
const footerText = createThemeBinding('footer_text')
const showFooterContact = createThemeBinding('show_footer_contact')
const footerContactName = createThemeBinding('footer_contact_name')
const footerContactEmail = createThemeBinding('footer_contact_email')
const footerContactPhone = createThemeBinding('footer_contact_phone')
const footerContactAddress = createThemeBinding('footer_contact_address')
const footerContactHours = createThemeBinding('footer_contact_hours')
const formWidth = createThemeBinding('form_width')
const formAlignment = createThemeBinding('form_alignment')
const formSpacing = createThemeBinding('form_spacing')
const globalBgColor = createThemeBinding('global_bg_color')

const footerLinks = computed({
    get: () => themeProperties.value?.footer_links || [],
    set: (value) => {
        selectedThemeId.value = ''
        updateThemeProperty('footer_links', value)
        syncThemeToSurvey()
    }
})

const addFooterLink = () => {
    footerLinks.value = [...footerLinks.value, { label: '', url: '' }]
}

const removeFooterLink = (index) => {
    footerLinks.value = footerLinks.value.filter((_, linkIndex) => linkIndex !== index)
}

const useCompanyContact = async () => {
    if (get_account_type() === 'enterprise' && get_account_id()) {
        await getCompany(get_account_id())
    }
    const data = company.value || {}
    footerContactName.value = data.denomination || footerContactName.value
    footerContactEmail.value = data.email || footerContactEmail.value
    footerContactPhone.value = data.phone || footerContactPhone.value
    footerContactAddress.value = data.adress || footerContactAddress.value
    footerContactHours.value = data.open_hours || footerContactHours.value
    logoUrl.value = logoUrl.value || data.logo || ''
    showFooterContact.value = true
}

const previewContainerStyle = computed(() => ({
    backgroundColor: pageBgColor.value || '#F5F7FB',
    backgroundImage: backgroundImage.value ? `url(${backgroundImage.value})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
}))

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        setThemeProperties(formSurvey.value?.theme || themeProperties.value)
        selectedThemeId.value = themeProperties.value?.id ? String(themeProperties.value.id) : ''
        if (get_account_type() === 'enterprise' && get_account_id()) {
            getCompany(get_account_id())
        }
        formSurvey.value.capture_mail = false
        formSurvey.value.questions = formSurvey.value.questions.filter((question) => question.type_field !== 'email')
        syncThemeToSurvey()
    }
}, { immediate: true })
</script>
