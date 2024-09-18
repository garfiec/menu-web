import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: () => import('@/views/CreateMenuModal.vue')
    },
    {
        path: '/create',
        name: 'CreateMenuView',
        component: () => import('@/views/CreateMenuModal.vue')
    },
    {
        path: '/restaurant/:restaurantId',
        name: 'RestaurantView',
        component: () => import('@/views/RestaurantMenuView.vue')
    },
    {
        path: '/settings',
        name: 'SettingsView',
        component: () => import('@/views/SettingsView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
