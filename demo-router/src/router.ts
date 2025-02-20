import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 这将在运行时更新路由，而无需重新加载页面
if (import.meta.hot) {
    handleHotUpdate(router)
}