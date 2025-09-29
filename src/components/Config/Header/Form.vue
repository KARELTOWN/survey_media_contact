<template>
    <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

            <div class="col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Logo <span class="text-danger">*</span>
                </label>
                <input type="file" @change="handleFile($event)" accept="image/*"
                    class="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400" />
                <p v-if="errors.logo" class="text-red-500">{{ errors.logo }}</p>
            </div>
            <div class="col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Téléphone <span class="text-danger" v-if="isEnterprise">*</span>
                </label>
                <input type="text" v-model="form.phone"
                    class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800  placeholder:text-gray-400 " />
                <p v-if="errors.phone" class="text-red-500">{{ errors.phone }}</p>

            </div>
            <div class="col-span-1" v-if="isEnterprise">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Adresse <span class="text-danger" v-if="isEnterprise">*</span>
                </label>
                <textarea v-model="form.adress"
                    class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800  placeholder:text-gray-400 "></textarea>
                <p v-if="errors.adress" class="text-red-500">{{ errors.adress }}</p>
            </div>
            <div class="col-span-1" v-if="isEnterprise">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Horaires d'ouvertures <span class="text-danger" v-if="isEnterprise">*</span>
                </label>
                <textarea v-model="form.open_hours"
                    class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800  placeholder:text-gray-400 "></textarea>
                <p v-if="errors.open_hours" class="text-red-500">{{ errors.open_hours }}</p>
            </div>
        </div>
        <p class="my-4" v-if="form.logo"><img :src="form.logo" class="object-contain w-50 h-50" /></p>
        <div class="flex justify-end mt-5">
            <Button class="bg-red-500">Enregistrer</Button>
        </div>
    </form>
</template>
<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import { convertToBase64, isFileSizeAllowed } from '@/utils/file';
import { infoNotify } from '@/utils/notification';
import { computed, onMounted, reactive } from 'vue';
import { configStore } from '@/stores/config/config';
import { storeToRefs } from 'pinia';
import { get_account_type } from '@/composables/request';
const store = configStore()
const { errors, config, configSuccess } = storeToRefs(store)
const { storeHeaderConfig, getConfig } = store


const form = reactive({
    adress: '',
    phone: '',
    logo: '',
    open_hours: ''
})


const handleSubmit = async () => {
    await storeHeaderConfig(form)
}

onMounted(async () => {
    await getConfig().then(() => {
        if (configSuccess.value === true) {
            const header = config.value
            if (header) {
                form.phone = header.phone
                form.logo = header.logo
                form.adress = header.adress
                form.open_hours = header.open_hours
            }
        }
    })
})

const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const handleFile = async (event) => {
    if (acceptedImageTypes.includes(event.target.files[0].type)) {
        if (isFileSizeAllowed(event.target.files[0])) {
            const file = event.target.files[0]
            const file64 = await convertToBase64(file)
            form.logo = file64
            console.log('form', form)
        }
        else {
            infoNotify('Taille de fichier trop volumineux. Taille maximale acceptée: 10 MB')
        }

    } else {
        infoNotify('Type de fichier non supporté. Veuillez sélectionner une image (jpg, jpeg, png, gif).')
    }
}

const isEnterprise = computed(() => {
    return get_account_type() === 'enterprise'
})
</script>
