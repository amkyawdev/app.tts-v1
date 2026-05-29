import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApiStore = defineStore('api', () => {
  const geminiKey = ref<string>(localStorage.getItem('gemini-key') || '')
  const groqKey = ref<string>(localStorage.getItem('groq-key') || '')

  function setGeminiKey(key: string) {
    geminiKey.value = key
    localStorage.setItem('gemini-key', key)
  }

  function setGroqKey(key: string) {
    groqKey.value = key
    localStorage.setItem('groq-key', key)
  }

  function clearKeys() {
    geminiKey.value = ''
    groqKey.value = ''
    localStorage.removeItem('gemini-key')
    localStorage.removeItem('groq-key')
  }

  return {
    geminiKey,
    groqKey,
    setGeminiKey,
    setGroqKey,
    clearKeys
  }
})