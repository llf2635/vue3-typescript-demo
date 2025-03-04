import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  console.log(command, mode)

  // 加载环境变量：根据 mode 读取 .env.[mode] 文件 使用 process 需要安装 bun add -D @types/bun 或者 @types/node
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env)

  return {
    // vite 配置
    plugins: [vue()],

    // Bun 特定优化
    server: {
      watch: {
        usePolling: true  // 建议在 Bun 中启用文件监听
      }
    },
  }
})