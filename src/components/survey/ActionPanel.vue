<template>
    <div ref="panelRoot" class="relative z-40 flex justify-end" v-if="props.type_field !== 'email'">
        <button type="button" @click.stop="togglePanel"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <SettingsIcon class="h-4 w-4" />
            <span>Configurer</span>
        </button>

        <div v-if="open"
            class="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            <div class="px-2 pb-1">
                <div class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Question</div>
            </div>

            <div v-if="props.have_required === true"
                class="mb-1 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <label for="Obligatoire" class="text-sm font-semibold text-gray-800">Obligatoire</label>
                <SwitchInput v-model="switchValue" id="Obligatoire" />
            </div>

            <div class="space-y-0.5">
                <button type="button" @click="emitAction('copy')" class="action-button">
                    <span class="action-icon">+</span>
                    <span class="action-title">Dupliquer</span>
                </button>
            </div>

            <div class="my-2 border-t border-gray-100"></div>

            <div class="px-2 pb-1">
                <div class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Configuration</div>
            </div>

            <div class="space-y-1">
                <button v-if="props.have_params === true" type="button" @click="emitAction('setting')"
                    class="action-button primary">
                    <span class="action-icon">⚙</span>
                    <span class="action-title">Paramètres du champ</span>
                </button>
                <button type="button" @click="emitAction('condition')" class="action-button primary">
                    <span class="action-icon">↳</span>
                    <span class="action-title">Condition d'affichage</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import SwitchInput from '@/components/forms/FormElements/SwitchInput.vue'
import { SettingsIcon } from '@/icons';

const props = defineProps({
    have_params: Boolean,
    have_required: Boolean,
    required: Boolean,
    type_field: String
});

const emit = defineEmits(['required', 'condition', 'setting', 'delete', 'copy'])
const open = ref(false)
const panelRoot = ref(null)
const switchValue = ref(false)

const togglePanel = () => {
    open.value = !open.value
}

const emitAction = (action) => {
    emit(action)
    open.value = false
}

watchEffect(() => {
    switchValue.value = props.required === true
})

watch(() => switchValue.value, (newValue) => {
    emit('required', newValue)
})

const handleClickOutside = (event) => {
    if (open.value && panelRoot.value && !panelRoot.value.contains(event.target)) {
        open.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.action-button {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    border-radius: 0.625rem;
    padding: 0.625rem 0.75rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    transition: background-color 0.15s ease;
}

.action-button:hover {
    background-color: #f9fafb;
}

.action-button.primary {
    border: 1px solid #dbeafe;
    background-color: #eff6ff;
}

.action-button.primary:hover {
    background-color: #dbeafe;
}

.action-button.danger {
    color: #dc2626;
}

.action-icon {
    display: inline-flex;
    height: 1.5rem;
    width: 1.5rem;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: #f3f4f6;
    font-size: 0.875rem;
    line-height: 1;
}

.action-title {
    display: block;
    color: inherit;
}
</style>
