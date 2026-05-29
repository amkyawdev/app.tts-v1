<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiStore } from '@/store/apiStore'
import ApiKeyInput from '@/components/ApiKeyInput.vue'

const apiStore = useApiStore()

const localGeminiKey = ref(apiStore.geminiKey)
const localGroqKey = ref(apiStore.groqKey)

const isSaved = ref(false)

function saveKeys() {
  apiStore.setGeminiKey(localGeminiKey.value)
  apiStore.setGroqKey(localGroqKey.value)
  isSaved.value = true
  setTimeout(() => {
    isSaved.value = false
  }, 3000)
}

function clearAllKeys() {
  localGeminiKey.value = ''
  localGroqKey.value = ''
  apiStore.clearKeys()
  isSaved.value = true
  setTimeout(() => {
    isSaved.value = false
  }, 3000)
}

const hasKeys = computed(() => localGeminiKey.value || localGroqKey.value)
</script>

<template>
  <div class="user-api">
    <h1>🔑 API Configuration</h1>
    <p class="description">Securely store your API keys in your browser's local storage</p>

    <div class="info-banner">
      💡 Your keys are stored locally and never sent to any server except the respective API providers
    </div>

    <div class="api-form">
      <ApiKeyInput 
        v-model="localGeminiKey"
        label="Gemini API Key"
        placeholder="Enter your Gemini API key"
      />
      
      <div class="helper-text">
        Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>
      </div>

      <ApiKeyInput 
        v-model="localGroqKey"
        label="Groq API Key"
        placeholder="Enter your Groq API key"
      />

      <div class="helper-text">
        Get your key from <a href="https://console.groq.com/keys" target="_blank">Groq Console</a>
      </div>

      <div class="actions">
        <button class="save-btn" @click="saveKeys">
          💾 Save Keys
        </button>
        <button 
          v-if="hasKeys" 
          class="clear-btn" 
          @click="clearAllKeys"
        >
          🗑️ Clear All
        </button>
      </div>

      <div v-if="isSaved" class="success-message">
        ✓ Keys saved successfully!
      </div>
    </div>

    <div class="status-section">
      <h3>Current Status</h3>
      <div class="status-grid">
        <div class="status-item" :class="{ active: apiStore.geminiKey }">
          <span class="status-icon">{{ apiStore.geminiKey ? '✓' : '✗' }}</span>
          <span>Gemini: {{ apiStore.geminiKey ? 'Configured' : 'Not set' }}</span>
        </div>
        <div class="status-item" :class="{ active: apiStore.groqKey }">
          <span class="status-icon">{{ apiStore.groqKey ? '✓' : '✗' }}</span>
          <span>Groq: {{ apiStore.groqKey ? 'Configured' : 'Not set' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-api {
  max-width: 600px;
  margin: 0 auto;
}

.user-api h1 {
  margin-bottom: var(--space-2);
}

.description {
  color: var(--color-muted);
  margin-bottom: var(--space-4);
}

.info-banner {
  background: var(--color-primary-faded);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius);
  padding: var(--space-3);
  margin-bottom: var(--space-5);
}

.api-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.helper-text {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-top: calc(-1 * var(--space-2));
}

.helper-text a {
  color: var(--color-primary);
}

.actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.save-btn {
  flex: 1;
  padding: var(--space-3);
  background: var(--color-primary);
  color: var(--color-inverse);
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.save-btn:hover {
  opacity: 0.9;
}

.clear-btn {
  padding: var(--space-3) var(--space-4);
  background: var(--color-error);
  color: var(--color-inverse);
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.clear-btn:hover {
  opacity: 0.9;
}

.success-message {
  color: var(--color-success);
  padding: var(--space-3);
  background: var(--color-success-faded);
  border-radius: var(--radius);
  text-align: center;
  font-weight: 500;
}

.status-section {
  margin-top: var(--space-6);
}

.status-section h3 {
  margin-bottom: var(--space-3);
}

.status-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-muted);
  border-radius: var(--radius);
}

.status-item.active {
  background: var(--color-success-faded);
}

.status-icon {
  font-weight: bold;
}

.status-item.active .status-icon {
  color: var(--color-success);
}

.status-item:not(.active) .status-icon {
  color: var(--color-error);
}
</style>