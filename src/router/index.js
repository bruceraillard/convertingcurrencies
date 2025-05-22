import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CurrencyOption from "@/components/CurrencyOption.vue";
import CurrencyComposition from "@/components/CurrencyComposition.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/currencies-option',
    name: 'currencies-option',
    component: CurrencyOption,
  },
  {
    path: '/currencies-composition',
    name: 'currencies-composition',
    component: CurrencyComposition,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
