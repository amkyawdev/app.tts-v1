<script setup lang="ts">
import { ref } from 'vue'
import { useApiStore } from '@/store/apiStore'

const apiStore = useApiStore()

const text = ref('')
const isLoading = ref(false)
const audioUrl = ref<string | null>(null)
const error = ref('')

async function generateSpeech() {
  if (!text.value.trim()) {
    error.value = 'Please enter some text'
    return
  }

  if (!apiStore.geminiKey) {
    error.value = 'Please configure your Gemini API key first'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gemini-Key': apiStore.geminiKey
      },
      body: JSON.stringify({ text: text.value })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to generate speech')
    }

    const blob = await response.blob()
    audioUrl.value = URL.createObjectURL(blob)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

function downloadAudio() {
  if (!audioUrl.value) return
  const a = document.createElement('a')
  a.href = audioUrl.value
  a.download = 'speech.mp3'
  a.click()
}
</script>

<template>
  <div class="tts-generator">
    <h1>🎙️ TTS Generator</h1>
    <p class="description">Convert your text into natural speech using Gemini API</p>

    <div v-if="!apiStore.geminiKey" class="warning-banner">
      ⚠️ Please configure your Gemini API key in <RouterLink to="/user-api">User API</RouterLink> first
    </div>

    <div class="tts-form">
      <div class="input-group">
        <label for="text-input">Text to convert</label>
        <textarea
          id="text-input"
          v-model="text"
          placeholder="Enter the text you want to convert to speech..."
          rows="6"
          :disabled="isLoading"
        ></textarea>
      </div>

      <button 
        class="generate-btn" 
        @click="generateSpeech"
        :disabled="isLoading || !apiStore.geminiKey"
      >
        {{ isLoading ? 'Generating...' : 'Generate Speech' }}
      </button>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div v-if="audioUrl" class="result-section">
        <h3>Generated Audio</h3>
        <audio controls :src="audioUrl"></audio>
        <button class="download-btn" @click="downloadAudio">Download Audio</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tts-generator {
  max-width: 700px;
  margin: 0 auto;
}

.tts-generator h1 {
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

.tts-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-group label {
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

.generate-btn {
  padding: var(--space-3) var(--space-5);
  background: var(--color-primary);
  color: var(--color-inverse);
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.generate-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.generate-btn:disabled {
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

.result-section h3 {
  margin-bottom: var(--space-3);
}

audio {
  width: 100%;
  margin-bottom: var(--space-3);
}

.download-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: background 0.2s;
}

.download-btn:hover {
  background: var(--color-border);
}
</style>