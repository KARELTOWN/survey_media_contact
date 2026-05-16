<template>
    <Modal v-if="props.open === true">
        <template #body>
            <div class="no-scrollbar relative mx-4 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
                <button @click="$emit('close')"
                    class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div class="border-b border-gray-100 px-6 py-5 text-center">
                    <div class="text-xs font-semibold uppercase tracking-wide text-blue-600">Parametres</div>
                    <h2 class="mt-1 text-2xl font-bold text-gray-800">Configuration du champ</h2>
                    <p class="mt-2 text-sm text-gray-500">Ajustez uniquement les options propres au type de champ selectionne.</p>
                </div>

                <div class="px-6 py-6">
                    <QuestionSetting @save="$emit('save')" />
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import Modal from '@/components/profile/Modal.vue'
import QuestionSetting from './QuestionSetting.vue'

defineEmits(["save", "close"])

const props = defineProps({
    open: Boolean
})
</script>
