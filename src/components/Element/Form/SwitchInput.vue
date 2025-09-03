<template>
  <div class="flex items-center space-x-3">
    <button
      @click="toggle"
      :class="[
        'relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none',
        modelValue ? 'bg-blue-500' : 'bg-gray-300'
      ]"
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        :class="modelValue ? 'translate-x-6' : 'translate-x-1'"
      ></span>
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>
