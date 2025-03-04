import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssPresetEnv from 'postcss-preset-env'
import cssnano from 'cssnano'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          stage: 3,          // 控制 CSS 特性阶段
          features: { 'nesting-rules': true },  // CSS 嵌套规则
          autoprefixer: { grid: true }, // 自动添加浏览器前缀
        }),
        cssnano() // 生产环境压缩
      ]
    }
  }
})
