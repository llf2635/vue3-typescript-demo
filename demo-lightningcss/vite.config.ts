import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import browserslist from 'browserslist';
import {browserslistToTargets} from "lightningcss";
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

  // Vite 中集成 Lightning CSS 配置参考 https://lightningcss.dev/docs.html#with-vite
  css: {
    // 指定使用 Lightning CSS 处理 CSS。默认是 PostCSS。
    transformer: 'lightningcss',
    // Lightning CSS 配置，可选配置项参考 Vite 官网 https://cn.vite.dev/config/shared-options#css-lightningcss
    lightningcss: {
      // 关于lightningcss的配置添加在这里
      targets: browserslistToTargets(browserslist('>= 0.25%, not dead, not ie 11')),
      // 启用 CSS Modules（默认关闭）
      cssModules: {

      },
      // 实验性 CSS 功能草案
      drafts: {
        customMedia: true // @custom-media 规则
      }
    }
  },
  build: {
    // 构建CSS交给lightningcss
    cssMinify: 'lightningcss',
  }
})
