import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        // 动态路由生成，参考 https://uvr.esm.is/introduction.html
        // Vue 必须放在 VueRouter() 之后
        VueRouter({
            /* 自定义配置，覆盖默认配置 */
        }),
        vue()
    ],
})
