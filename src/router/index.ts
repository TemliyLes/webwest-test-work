import { createRouter, createWebHistory } from 'vue-router'
import Detail from '@/pages/Detail.vue'
import List from '@/pages/List.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: List,
    },
    {
      path: '/:page',
      component: List,
    },
    {
      path: '/tender/:id',
      component: Detail
    }
  ],
})
export default router