import { createRouter, createWebHistory } from 'vue-router'
import GetStarted from '@/views/GetStarted.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/get-started'
    },
    {
      path: '/get-started',
      name: 'get-started',
      component: GetStarted
    },
    {
      path: '/tts-generator',
      name: 'tts-generator',
      component: () => import('@/views/TtsGenerator.vue')
    },
    {
      path: '/translator',
      name: 'translator',
      component: () => import('@/views/Translator.vue')
    },
    {
      path: '/user-api',
      name: 'user-api',
      component: () => import('@/views/UserApi.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue')
    }
  ]
})

export default router