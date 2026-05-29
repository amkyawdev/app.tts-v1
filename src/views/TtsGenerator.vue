<script setup lang="ts">
import { ref } from 'vue'
import { useApiStore } from '@/store/apiStore'

const apiStore = useApiStore()

const text = ref('')
const isLoading = ref(false)
const audioUrl = ref<string | null>(null)
const error = ref('')

// Language and narrator selection
const selectedLanguage = ref('myanmar')
const selectedNarrator = ref('thiha')

// Input format mode
type InputMode = 'text' | 'srt'
const inputMode = ref<InputMode>('text')

const languages = [
  { code: 'myanmar', name: '🇲🇲 Myanmar', label: 'Myanmar' },
  { code: 'english', name: '🇬🇧 English', label: 'English' },
  { code: 'thai', name: '🇹🇭 Thai', label: 'Thai' }
]

const narrators = [
  { id: 'thiha', name: '🎙️ Thiha', desc: 'Male voice' },
  { id: 'nilar', name: '🎙️ Nilar', desc: 'Female voice' }
]

const inputModes = [
  { id: 'text', name: '📝 Plain Text', icon: '📝' },
  { id: 'srt', name: '🎬 SRT Format', icon: '🎬' }
]

// Parse SRT content and extract text
function parseSrt(content: string): string[] {
  const lines = content.split('\n')
  const texts: string[] = []
  let currentText = ''
  
  for (const line of lines) {
    const trimmed = line.trim()
    // Skip empty lines, numbers, and timecodes
    if (!trimmed) {
      if (currentText) {
        texts.push(currentText)
        currentText = ''
      }
    } else if (!/^\d+$/.test(trimmed) && !/\d{2}:\d{2}:\d{2}/.test(trimmed)) {
      // This is text content
      currentText += trimmed + ' '
    }
  }
  if (currentText) {
    texts.push(currentText.trim())
  }
  return texts
}

// Handle file upload
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (inputMode.value === 'srt') {
      const texts = parseSrt(content)
      text.value = texts.join('\n\n')
    } else {
      text.value = content
    }
  }
  reader.readAsText(file)
  input.value = '' // Reset input
}

async function generateSpeech() {
  if (!text.value.trim()) {
    error.value = 'Please enter some text or upload a file'
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
      body: JSON.stringify({
        text: text.value,
        language: selectedLanguage.value,
        narrator: selectedNarrator.value
      })
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
      <!-- Control Options -->
      <div class="options-section">
        <!-- Language Selector -->
        <div class="option-group">
          <label>🌍 Language</label>
          <div class="button-group">
            <button
              v-for="lang in languages"
              :key="lang.code"
              :class="['option-btn', { active: selectedLanguage === lang.code }]"
              @click="selectedLanguage = lang.code"
              :disabled="isLoading"
            >
              {{ lang.name }}
            </button>
          </div>
        </div>

        <!-- Narrator Selector -->
        <div class="option-group">
          <label>🎭 Narrator</label>
          <div class="button-group">
            <button
              v-for="narr in narrators"
              :key="narr.id"
              :class="['option-btn', { active: selectedNarrator === narr.id }]"
              @click="selectedNarrator = narr.id"
              :disabled="isLoading"
            >
              {{ narr.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Input Mode Toggle -->
      <div class="input-mode-section">
        <label>📄 Input Format</label>
        <div class="mode-toggle">
          <button
            v-for="mode in inputModes"
            :key="mode.id"
            :class="['mode-btn', { active: inputMode === mode.id }]"
            @click="inputMode = mode.id as InputMode"
            :disabled="isLoading"
          >
            {{ mode.icon }} {{ mode.name }}
          </button>
        </div>
      </div>

      <!-- Text Input Container -->
      <div class="input-container">
        <div class="input-header">
          <label for="text-input">
            {{ inputMode === 'srt' ? '🎬 SRT Content' : '📝 Text to convert' }}
          </label>
          <span class="format-hint" v-if="inputMode === 'srt'">
            Extracts text from SRT subtitles
          </span>
        </div>
        
        <textarea
          id="text-input"
          v-model="text"
          :placeholder="inputMode === 'srt' 
            ? 'Paste your SRT content here or upload a file...\n\nExample:\n1\n00:00:01,000 --> 00:00:04,000\nHello world\n\n2\n00:00:05,000 --> 00:00:08,000\nThis is subtitle text' 
            : 'Enter the text you want to convert to speech...'"
          rows="8"
          :disabled="isLoading"
        ></textarea>
      </div>

      <!-- File Upload -->
      <div class="upload-section">
        <label>📁 Upload File</label>
        <div class="upload-buttons">
          <label class="upload-btn">
            📄 Upload TXT
            <input
              type="file"
              accept=".txt"
              @change="handleFileUpload"
              :disabled="isLoading"
              hidden
            />
          </label>
          <label class="upload-btn">
            🎬 Upload SRT
            <input
              type="file"
              accept=".srt"
              @change="handleFileUpload"
              :disabled="isLoading"
              hidden
            />
          </label>
        </div>
        <p class="upload-hint">
          Supported formats: .txt, .srt (SubRip subtitles)
        </p>
      </div>

      <button 
        class="generate-btn" 
        @click="generateSpeech"
        :disabled="isLoading || !apiStore.geminiKey"
      >
        {{ isLoading ? '⏳ Generating...' : '🎙️ Generate Speech' }}
      </button>

      <div v-if="error" class="error-message">⚠️ {{ error }}</div>

      <div v-if="audioUrl" class="result-section">
        <h3>🔊 Generated Audio</h3>
        <audio controls :src="audioUrl"></audio>
        <div class="result-actions">
          <button class="download-btn" @click="downloadAudio">
            💾 Download Audio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tts-generator {
  max-width: 800px;
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
  color: var(--color-text);
}

.tts-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Options Section */
.options-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.option-group label {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-muted);
}

.button-group {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.option-btn {
  padding: var(--space-2) var(--space-3);
  background: var(--color-canvas);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.option-btn:hover:not(:disabled) {
  background: var(--color-muted);
}

.option-btn.active {
  background: var(--color-primary);
  color: var(--color-inverse);
  border-color: var(--color-primary);
}

.option-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input Mode Section */
.input-mode-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.input-mode-section label {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-muted);
}

.mode-toggle {
  display: flex;
  gap: var(--space-2);
}

.mode-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-canvas);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover:not(:disabled) {
  background: var(--color-muted);
}

.mode-btn.active {
  background: var(--color-primary);
  color: var(--color-inverse);
  border-color: var(--color-primary);
}

.mode-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input Container */
.input-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-header label {
  font-weight: 500;
}

.format-hint {
  font-size: 0.85rem;
  color: var(--color-muted);
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
  min-height: 150px;
}

textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Upload Section */
.upload-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.upload-section label {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-muted);
}

.upload-buttons {
  display: flex;
  gap: var(--space-3);
}

.upload-btn {
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.upload-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-faded);
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--color-muted);
  margin: 0;
}

/* Generate Button */
.generate-btn {
  padding: var(--space-3) var(--space-5);
  background: var(--color-primary);
  color: var(--color-inverse);
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.2s;
  cursor: pointer;
}

.generate-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  color: var(--color-error);
  padding: var(--space-3);
  background: var(--color-error-faded);
  border-radius: var(--radius);
  border: 1px solid var(--color-error);
}

/* Result Section */
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

.result-actions {
  display: flex;
  gap: var(--space-3);
}

.download-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s;
}

.download-btn:hover {
  background: var(--color-border);
}
</style>