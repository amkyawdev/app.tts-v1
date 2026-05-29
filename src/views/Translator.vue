<script setup lang="ts">
import { ref } from 'vue'
import { useApiStore } from '@/store/apiStore'

const apiStore = useApiStore()

const text = ref('')
const targetLanguage = ref('myanmar')
const isLoading = ref(false)
const translation = ref('')
const error = ref('')

const languages = [
  { code: 'myanmar', name: '🇲🇲 Myanmar', label: 'Myanmar' },
  { code: 'english', name: '🇬🇧 English', label: 'English' },
  { code: 'thai', name: '🇹🇭 Thai', label: 'Thai' },
  { code: 'japanese', name: '🇯🇵 Japanese', label: 'Japanese' },
  { code: 'korean', name: '🇰🇷 Korean', label: 'Korean' },
  { code: 'chinese', name: '🇨🇳 Chinese', label: 'Chinese' },
  { code: 'spanish', name: '🇪🇸 Spanish', label: 'Spanish' },
  { code: 'french', name: '🇫🇷 French', label: 'French' },
  { code: 'german', name: '🇩🇪 German', label: 'German' },
  { code: 'italian', name: '🇮🇹 Italian', label: 'Italian' },
  { code: 'portuguese', name: '🇵🇹 Portuguese', label: 'Portuguese' },
  { code: 'russian', name: '🇷🇺 Russian', label: 'Russian' },
  { code: 'arabic', name: '🇸🇦 Arabic', label: 'Arabic' },
  { code: 'hindi', name: '🇮🇳 Hindi', label: 'Hindi' },
  { code: 'vietnamese', name: '🇻🇳 Vietnamese', label: 'Vietnamese' }
]

async function translateText() {
  if (!text.value.trim()) {
    error.value = 'Please enter some text to translate'
    return
  }

  if (!apiStore.groqKey) {
    error.value = 'Please configure your Groq API key first'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Groq-Key': apiStore.groqKey
      },
      body: JSON.stringify({ 
        text: text.value,
        targetLanguage: targetLanguage.value
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to translate')
    }

    const data = await response.json()
    translation.value = data.choices?.[0]?.message?.content || 'Translation unavailable'
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

function copyTranslation() {
  if (translation.value) {
    navigator.clipboard.writeText(translation.value)
  }
}
</script>

<template>
  <div class="translator">
    <h1>🌐 Translator</h1>
    <p class="description">Translate text across languages using Groq's AI</p>

    <div v-if="!apiStore.groqKey" class="warning-banner">
      ⚠️ Please configure your Groq API key in <RouterLink to="/user-api">User API</RouterLink> first
    </div>

    <div class="translator-form">
      <div class="input-row">
        <div class="input-group">
          <label for="text-input">Text to translate</label>
          <textarea
            id="text-input"
            v-model="text"
            placeholder="Enter text to translate..."
            rows="5"
            :disabled="isLoading"
          ></textarea>
        </div>

        <div class="options-column">
          <label for="language-select">🌍 Target Language</label>
          <select id="language-select" v-model="targetLanguage" :disabled="isLoading">
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
          </select>
        </div>
      </div>

      <button 
        class="translate-btn" 
        @click="translateText"
        :disabled="isLoading || !apiStore.groqKey"
      >
        {{ isLoading ? 'Translating...' : 'Translate' }}
      </button>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div v-if="translation" class="result-section">
        <div class="result-header">
          <h3>Translation</h3>
          <button class="copy-btn" @click="copyTranslation">📋 Copy</button>
        </div>
        <div class="translation-text">{{ translation }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.translator {
  max-width: 800px;
  margin: 0 auto;
}

.translator h1 {
  margin-bottom: var(--space-2);
}

.description {
  color: var(--color-muted);
  margin-bottom: var(--space-5);
}

.warning-banner {
  background: var(--color-warning-faded);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius);
  padding: var(--space-3);
  margin-bottom: var(--space-4);
}

.warning-banner a {
  font-weight: 500;
}

.translator-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: var(--space-4);
}

@media (max-width: 600px) {
  .input-row {
    grid-template-columns: 1fr;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-group label,
.options-column label {
  font-weight: 500;
}

textarea {
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-canvas);
  color: var(--color-text);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.options-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

select {
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-canvas);
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.translate-btn {
  padding: var(--space-3) var(--space-5);
  background: var(--color-primary);
  color: var(--color-inverse);
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.translate-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.translate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: var(--color-error);
  padding: var(--space-3);
  background: var(--color-error-faded);
  border-radius: var(--radius);
}

.result-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.result-header h3 {
  margin: 0;
}

.copy-btn {
  padding: var(--space-2) var(--space-3);
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: var(--color-border);
}

.translation-text {
  padding: var(--space-3);
  background: var(--color-canvas);
  border-radius: var(--radius);
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>