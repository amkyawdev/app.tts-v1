<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="get-started">
    <header class="hero">
      <h1>🔊 Text-to-Speech & Translation</h1>
      <p class="subtitle">Powered by Gemini & Groq APIs</p>
    </header>

    <section class="features">
      <div class="feature-card">
        <span class="feature-icon">🎙️</span>
        <h3>TTS Generator</h3>
        <p>Convert text to natural speech using Google's Gemini API</p>
        <RouterLink to="/tts-generator" class="cta-button">Try Now</RouterLink>
      </div>

      <div class="feature-card">
        <span class="feature-icon">🌐</span>
        <h3>Translator</h3>
        <p>Translate text across languages with Groq's lightning-fast AI</p>
        <RouterLink to="/translator" class="cta-button">Try Now</RouterLink>
      </div>

      <div class="feature-card">
        <span class="feature-icon">🔑</span>
        <h3>API Keys</h3>
        <p>Securely store your own API keys locally in your browser</p>
        <RouterLink to="/user-api" class="cta-button">Configure</RouterLink>
      </div>
    </section>

    <section class="setup-guide">
      <h2>Quick Start</h2>
      <ol class="steps">
        <li>
          <strong>Get your API keys</strong>
          <p>Sign up for <a href="https://aistudio.google.com/app/apikey" target="_blank">Gemini</a> and <a href="https://console.groq.com/keys" target="_blank">Groq</a> APIs</p>
        </li>
        <li>
          <strong>Configure keys</strong>
          <p>Go to <RouterLink to="/user-api">User API</RouterLink> and paste your keys</p>
        </li>
        <li>
          <strong>Start creating</strong>
          <p>Head to TTS Generator or Translator and begin</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.get-started {
  max-width: 900px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: var(--space-6) 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-2);
}

.subtitle {
  font-size: 1.2rem;
  color: var(--color-muted);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin: var(--space-6) 0;
}

.feature-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-3);
}

.feature-card h3 {
  margin-bottom: var(--space-2);
}

.feature-card p {
  color: var(--color-muted);
  margin-bottom: var(--space-4);
}

.cta-button {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: var(--color-inverse);
  border-radius: var(--radius);
  font-weight: 500;
}

.cta-button:hover {
  text-decoration: none;
  opacity: 0.9;
}

.setup-guide {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.setup-guide h2 {
  margin-bottom: var(--space-4);
}

.steps {
  list-style: decimal;
  padding-left: var(--space-5);
}

.steps li {
  margin-bottom: var(--space-4);
}

.steps li strong {
  display: block;
  margin-bottom: var(--space-1);
}

.steps li p {
  color: var(--color-muted);
  margin: 0;
}
</style>