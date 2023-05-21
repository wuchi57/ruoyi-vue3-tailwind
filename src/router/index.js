import { createRouter, createWebHistory } from 'vue-router'
import interceptor from './before-each.js'
import Layout from 'layout/index.vue'

/**
 * 路由设计
 *
 * {
 *   path: '/login',
 *   name: 'Login',
 *   component: () => import('@views/Login.vue'),
 *   redirect: '/login/xxx',
 *   children: []
 * }
 *
 */

const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/Home.vue'),
      }
    ]
  },
]

const routes = [...constantRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior () {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

router.beforeEach(interceptor)

export default router