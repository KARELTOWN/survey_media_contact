<template>
    <v-select :label="props.label" :options="props.options" :taggable="props.isTaggable" :reduce="props.reduce"
        v-model="select" :placeholder="props.placeholder" :disabled="props.disabled">
        <template v-slot:no-options="{ search, searching, loading }">
            <template v-if="loading">
                Chargement en cours...
            </template>
            <template v-if="searching">
                Aucun résultat pour : <em>{{ search }}</em>
            </template>
            <template v-else>
                Aucun élément trouvé
            </template>
        </template>
    </v-select>
</template>
<script setup>
import { ref } from 'vue';
import { watch } from 'vue';

const props = defineProps({
    options: Array,
    label: String,
    isTaggable: Boolean,
    reduce: String,
    placeholder: String,
    disabled: Boolean
})
const select = ref(null)
const emit = defineEmits(['select'])
watch(() => select.value, (newValue) => {
    emit('select', newValue)
})
</script>