import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import lightningcss from "vite-plugin-lightningcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      lightningcss({
        // 目标浏览器范围 (基于 browserslist 语法)
        browserslist: "> 0.5%, last 2 versions, not dead",
        // 是否启用 CSS Modules (默认: false)
        cssModules: true,
        // 实验性 CSS 功能草案 (如嵌套语法)
        drafts: {
          customMedia: true // @custom-media 规则
        },
        // 是否压缩 CSS (生产环境默认: true)
        minify: process.env.NODE_ENV === "production",
        // 是否生成 Source Map (默认跟随 Vite 配置)
        sourceMap: true,
      }),
  ],


})
