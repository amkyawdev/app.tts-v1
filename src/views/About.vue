<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="about">
    <h1>ℹ️ About This App</h1>

    <section class="about-section">
      <h2>Project Overview</h2>
      <p>
        This is a modern Text-to-Speech and Translation application built with Vue 3 and TypeScript.
        It leverages the power of Google's Gemini API for high-quality speech synthesis and Groq's
        AI models for lightning-fast translations.
      </p>
    </section>

    <section class="tech-stack">
      <h2>Technology Stack</h2>
      <div class="tech-grid">
        <div class="tech-item">
          <span class="tech-icon">⚡</span>
          <span class="tech-name">Vue 3</span>
          <span class="tech-desc">Composition API</span>
        </div>
        <div class="tech-item">
          <span class="tech-icon">📘</span>
          <span class="tech-name">TypeScript</span>
          <span class="tech-desc">Type-safe development</span>
        </div>
        <div class="tech-item">
          <span class="tech-icon">🚀</span>
          <span class="tech-name">Vite</span>
          <span class="tech-desc">Lightning-fast builds</span>
        </div>
        <div class="tech-item">
          <span class="tech-icon">📦</span>
          <span class="tech-name">Pinia</span>
          <span class="tech-desc">State management</span>
        </div>
        <div class="tech-item">
          <span class="tech-icon">🔊</span>
          <span class="tech-name">Gemini API</span>
          <span class="tech-desc">Text-to-Speech</span>
        </div>
        <div class="tech-item">
          <span class="tech-icon">🌐</span>
          <span class="tech-name">Groq API</span>
          <span class="tech-desc">AI Translation</span>
        </div>
        <div class="tech-item">
          <span class="tech-icon">☁️</span>
          <span class="tech-name">Cloudflare</span>
          <span class="tech-desc">Hosting & Workers</span>
        </div>
        <div class="tech-item">
          <span class="tech-icon">🎨</span>
          <span class="tech-name">Panda CSS</span>
          <span class="tech-desc">Modern styling</span>
        </div>
      </div>
    </section>

    <section class="features-list">
      <h2>Features</h2>
      <ul>
        <li>🎙️ <strong>TTS Generator</strong> - Convert text to natural speech</li>
        <li>🌐 <strong>Translator</strong> - Translate across 15+ languages</li>
        <li>🔒 <strong>Secure API Keys</strong> - Stored locally in browser</li>
        <li>📱 <strong>Responsive Design</strong> - Works on all devices</li>
        <li>⚡ <strong>Fast Performance</strong> - Optimized for speed</li>
      </ul>
    </section>

    <section class="navigation-section">
      <h2>Quick Links</h2>
      <div class="nav-links">
        <RouterLink to="/get-started" class="nav-link">Get Started</RouterLink>
        <RouterLink to="/tts-generator" class="nav-link">TTS Generator</RouterLink>
        <RouterLink to="/translator" class="nav-link">Translator</RouterLink>
        <RouterLink to="/user-api" class="nav-link">Configure API Keys</RouterLink>
      </div>
    </section>

    <footer class="about-footer">
      <p>Built with ❤️ using Vue 3, TypeScript & Cloudflare</p>
      <p class="version">Version 1.0.0</p>
    </footer>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.about h1 {
  margin-bottom: var(--space-5);
}

.about-section {
  margin-bottom: var(--space-6);
}

.about-section h2 {
  margin-bottom: var(--space-3);
}

.about-section p {
  line-height: 1.7;
  color: var(--color-text);
}

.tech-stack {
  margin-bottom: var(--space-6);
}

.tech-stack h2 {
  margin-bottom: var(--space-4);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-3);
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: transform 0.2s;
}

.tech-item:hover {
  transform: translateY(-2px);
}

.tech-icon {
  font-size: 2rem;
  margin-bottom: var(--space-2);
}

.tech-name {
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.tech-desc {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.features-list {
  margin-bottom: var(--space-6);
}

.features-list h2 {
  margin-bottom: var(--space-4);
}

.features-list ul {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: var(--space-2);
}

.navigation-section {
  margin-bottom: var(--space-6);
}

.navigation-section h2 {
  margin-bottom: var(--space-4);
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.nav-link {
  padding: var(--space-3) var(--space-5);
  background: var(--color-primary);
  color: var(--color-inverse);
  border-radius: var(--radius);
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav-link:hover {
  text-decoration: none;
  opacity: 0.9;
}

.about-footer {
  text-align: center;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.about-footer p {
  margin: 0;
}

.version {
  margin-top: var(--space-2) !important;
  color: var(--color-muted);
  font-size: 0.85rem;
}
</style>