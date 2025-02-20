import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // 配置参考 https://unocss.net/integrations/vite
        UnoCSS()
    ],
})
