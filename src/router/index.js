import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/index.vue'
import Trip from '../pages/trip/index.vue'
import TripCreate from '../pages/trip/create/index.vue'

import AppLayout from '../layout/app.vue'

import { auth } from '@/router/middleware'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: AppLayout,
      beforeEnter: [auth],
      children: [
        {
          path: '',
          component: Home,
        }
      ]
    },
    // Trips
    {
      path: '/trip/create',
      name: 'TripCreate',
      component: AppLayout,
      beforeEnter: [auth],
      children: [
        {
          path: '',
          component: TripCreate,
        }
      ]
    },
    {
      path: '/trip/invite',
      name: 'TripInvite',
      component: AppLayout,
      children: [
        {
          path: '',
          component: () => import('../pages/trip/invite/index.vue'),
        }
      ]
    },
    {
      path: '/trip/view',
      name: 'TripView',
      component: () => import('../pages/trip/view/index.vue'),
    },
    {
      path: '/trip',
      name: 'Trip',
      component: AppLayout,
      beforeEnter: [auth],
      children: [
        {
          path: '',
          component: Trip,
        }
      ]
    },
    // Auth
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/login/index.vue')
    }
  ]
})

export default router
