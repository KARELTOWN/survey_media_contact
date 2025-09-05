<script setup lang="ts">
import PreviewPanel from '@/components/survey/preview/PreviewPanel.vue';
import { errorNotify } from '@/utils/notification';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()

onMounted(() => {
    if (!route.params.id) {
        errorNotify('Impossible d\'accéder au formulaire')
        return
    }
})
</script>

<template>
    <div v-if="route.params.id">
        <PreviewPanel :preview="false" />
    </div>
</template>