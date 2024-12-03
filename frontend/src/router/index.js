import { createRouter, createWebHistory } from 'vue-router'
import Pdf from '../views/Pdf.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pdf',
      component: Pdf,
    },
  ],
})

export default router
