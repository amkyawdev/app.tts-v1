<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label: string
  placeholder?: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isVisible = ref(false)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function toggleVisibility() {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <div class="api-key-input">
    <label class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :type="isVisible ? 'text' : 'password'"
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder || 'Enter your API key'"
        class="key-input"
        autocomplete="off"
      />
      <button 
        type="button" 
        class="toggle-visibility"
        @click="toggleVisibility"
        :aria-label="isVisible ? 'Hide API key' : 'Show API key'"
      >
        {{ isVisible ? '👁️' : '👁️‍🗨️' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.api-key-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-label {
  font-weight: 500;
  color: var(--color-text);
}

.input-wrapper {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.key-input {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-canvas);
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: monospace;
}

.key-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-faded);
}

.toggle-visibility {
  padding: var(--space-2);
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.toggle-visibility:hover {
  background: var(--color-border);
}
</style>