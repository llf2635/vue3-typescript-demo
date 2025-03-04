import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssPresetEnv from 'postcss-preset-env'
import cssnano from 'cssnano'

// https://cn.vite.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   css: {
//     postcss: {
//       plugins: [
//         // 启用并配置 postcss-preset-env（包含 autoprefixer）
//         postcssPresetEnv({
//           stage: 3, // 启用稳定和实验性 CSS 功能（0: 草案, 3: 稳定）
//           // 自定义配置
//           features: {
//             'nesting-rules': true, // 启用 CSS 嵌套语法
//             'custom-media-queries': true // 启用媒体查询变量
//           },
//           // 自动添加浏览器前缀
//           autoprefixer: {
//             grid: true // 启用网格布局前缀
//           }
//         }),
//         // 生产环境启用 CSS 压缩
//         process.env.NODE_ENV === 'production' ? cssnano() : null,
//       ].filter(Boolean) // 过滤掉 null 值
//     },
//   }
// })

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  // console.log(command, mode, isSsrBuild, isPreview)

  // 加载环境变量：根据 mode 读取 .env.[mode] 文件 使用 process 需要安装 bun add -D @types/node
  const env = loadEnv(mode, process.cwd(), '')

  // 1. 先处理 SSR 构建
  if (isSsrBuild) {
    return {
      build: {
        ssr: true,
        outDir: 'dist/ssr',
        rollupOptions: { /* SSR 入口配置 */ }
      },
      // 强制关闭开发环境独有配置（即使 command === 'serve'）
      server: undefined
    }
  }

  // 2. 处理预览模式
  if (isPreview) {
    return {
      server: {
        port: 4173,
        strictPort: true
      }
    }
  }

  // 3. 常规开发/生产配置
  if (command === 'serve') {
    return {
      // dev 独有配置
      server: { proxy: { '/api': 'http://localhost:3000' } }
    }
  } else {
    // command === 'build'
    return {
      // build 独有配置
      build: { minify: 'terser', sourcemap: true }
    }
  }


})