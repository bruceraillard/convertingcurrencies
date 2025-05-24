import { createRouter, createWebHistory } from 'vue-router'
import CurrencyOption from "@/components/CurrencyOption.vue";
import CurrencyComposition from "@/components/CurrencyComposition.vue";

const routes = [
  {
    path: '/',
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
