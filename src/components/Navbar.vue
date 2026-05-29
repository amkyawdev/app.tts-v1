<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <RouterLink to="/" class="brand-link">
        <span class="brand-icon">🔊</span>
        <span class="brand-text">TTS App</span>
      </RouterLink>
    </div>

    <button 
      class="menu-toggle" 
      :class="{ active: isMenuOpen }"
      @click="toggleMenu"
      aria-label="Toggle navigation menu"
    >
      <span class="menu-bar"></span>
      <span class="menu-bar"></span>
      <span class="menu-bar"></span>
    </button>

    <div class="navbar-links" :class="{ open: isMenuOpen }">
      <RouterLink to="/get-started" @click="closeMenu">Get Started</RouterLink>
      <RouterLink to="/tts-generator" @click="closeMenu">TTS Generator</RouterLink>
      <RouterLink to="/translator" @click="closeMenu">Translator</RouterLink>
      <RouterLink to="/user-api" @click="closeMenu">User API</RouterLink>
      <RouterLink to="/about" @click="closeMenu">About</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text);
}

.brand-link:hover {
  text-decoration: none;
}

.brand-icon {
  font-size: 1.4rem;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  padding: 4px;
  gap: 5px;
}

.menu-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.menu-toggle.active .menu-bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.menu-toggle.active .menu-bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.menu-toggle.active .menu-bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.navbar-links {
  display: flex;
  gap: var(--space-3);
}

.navbar-links a {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  color: var(--color-text);
  transition: background 0.2s, color 0.2s;
}

.navbar-links a:hover {
  background: var(--color-muted);
  text-decoration: none;
}

.navbar-links a.router-link-active {
  background: var(--color-primary);
  color: var(--color-inverse);
}

@media (max-width: 640px) {
  .menu-toggle {
    display: flex;
  }

  .navbar-links {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--color-surface);
    flex-direction: column;
    padding: var(--space-3);
    gap: var(--space-2);
    border-bottom: 1px solid var(--color-border);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .navbar-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .navbar-links a {
    padding: var(--space-3);
    text-align: center;
  }
}
</style>