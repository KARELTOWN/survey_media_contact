<template>
    <Modal v-if="isOpen">
        <template #body>
            <div
                class="no-scrollbar relative max-h-[900px] max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="mt-3">
                    <div v-if="file_type == 'image'">
                        <img :src="file_base_64" alt="Fichier image" class="w-[40rem] h-[25rem] object-contain" />
                    </div>
                    <div v-if="file_type == 'video'">
                        <video :src="file_base_64" alt="Fichier video" class="w-[40rem] h-[25rem]" />
                    </div>
                    <div v-if="file_type == 'pdf'">
                        <embed :src="file_base_64" alt="Fichier video" class="w-[40rem] h-[25rem]" />
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup>

import { ref, watchEffect } from 'vue';
import Modal from '../profile/Modal.vue';
import { getFileType } from '@/utils/file';
import { infoNotify } from '@/utils/notification';

const isOpen = ref(false)
const file_base_64 = ref('')
const file_type = ref()
const emits = defineEmits(['close'])

const props = defineProps({
    open: {
        type: Boolean,
        required: true
    },
    file: {
        type: String,
        required: true
    }
})


watchEffect(() => {
    if (props.open !== undefined) {
        isOpen.value = props.open
    }
    if (props.file !== undefined) {
        file_base_64.value = props.file
        let filetype = getFileType(props.file)
        if (filetype == 'word' || filetype == 'excel' || filetype == 'powerpoint') {
            return
        }
        file_type.value = filetype
    }
})

const closeModal = () => {
    emits('close')
}

</script>