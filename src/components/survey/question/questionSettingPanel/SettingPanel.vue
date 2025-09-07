<template>
    <Modal v-if="props.open === true">
        <template #body>
            <div
                class="no-scrollbar relative w-3/3 md:w-2/3 max-w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-5 mx-5">
                <!-- Overlay -->
                <!-- Modal -->
                <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] overflow-hidden flex z-50">

                    <!-- Bouton de fermeture -->
                    <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div class="w-3/3 flex flex-col">
                        <!-- Tabs -->
                        <div class="flex border-b">
                            <button @click="activeTab = 'paramètres'" :class="tabClass('paramètres')">Paramètres</button>
                        </div>

                        <!-- Contenu des tabs -->
                        <div class="flex-1 overflow-y-auto p-4">
                            <div v-if="activeTab === 'paramètres'" class="space-y-4">
                                <QuestionSetting @save="$emit('save')"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Modal>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import Modal from '@/components/profile/Modal.vue'
import QuestionSetting from './QuestionSetting.vue'
const emit = defineEmits(["save"])

onMounted(() => {
})

const props = defineProps({
    open: Boolean
})

const activeTab = ref('paramètres')

function tabClass(tab) {
    return activeTab.value === tab
        ? 'flex-1 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 py-2'
        : 'flex-1 text-sm text-gray-500 py-2 hover:text-blue-600'
}


</script>
