import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 更多 vite 配置详细细节可以参考官网: https://cn.vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  // 开发服务器配置，绝对不能配置 https 选项，否则导致整个文件报错
  server: {
    // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    host: true,
    // 指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口
    port: 3002,
    // 固定端口，设为 true 时若端口已占用则会直接退出，而不是尝试下一个可用端口。
    strictPort: false,
    // 为开发服务器配置 CORS,默认启用并允许任何源
    cors: true,
    // 开发服务器启动时，自动在浏览器中打开应用程序
    open: true,
    // 热更新
    hmr: true,
  },
})
