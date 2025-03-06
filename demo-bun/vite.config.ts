import {ConfigEnv, defineConfig, loadEnv, UserConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import consoleArt from "./plugins/vitePluginDemo.ts";

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  // 加载环境变量：根据 mode 读取 .env.[mode] 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 VITE_ 前缀。
  // 如果是两个参数则读取我们配置在 .env.mode 的环境变量；加第三个参数 ”“ 则当前主机的全量环境变量配置
  // 要安装 Bun 内置 API 的 TypeScript 定义，请使用 bun add -d @types/bun 安装 @types/bun。此时，你应该可以在 TypeScript 文件中引用 Bun 全局变量，而不会在编辑器中看到错误。
  // 例如：使用 process 就需要安装 bun add -D @types/bun 如果是用的是 nodejs 则是 @types/node
  // 当我们使用一些 nodejs 的 API 时，例如：process、path、require() 等，也需要安装 @types/bun ，因为 Bun 旨在实现完整的 Node.js API 兼容性。
  const env = loadEnv(mode, process.cwd(), '');
  // const { VITE_VERSION, VITE_PORT, VITE_BASE_URL, VITE_API_URL } = env;

  // 如果我们使用 Web 标准 API ，例如：常见的有 console、JSON、setTimeout、setInterval等。也需要在项目根目录下安装 @types/bun
  // 即使是使用 console 打印也需要安装 @types/bun 。因为 Bun 会实现这些 Web 标准 API，参考 https://bun.net.cn/docs/runtime/web-apis
  // console.log(env)
  // console.log(command, mode)
  // console.log(JSON.stringify({ x: 5, y: 6 }));
  // path.resolve(__dirname)

  return {
    // vite 配置
    plugins: [
        vue(),
      consoleArt(),
      // vitePluginVueMonitor(),
      // consoleArtPlugin()
    ],

    // Bun 特定优化
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
      open: false,
      // 热更新
      hmr: true,
      // 为开发服务器配置自定义代理规则，代理所有从vite发出的url中带/api的请求
      proxy: {
        "/api": {
          // 匹配上则转发到target 目标Host
          target: env.VITE_APP_BASE_URL,
          // 是否跨域
          changeOrigin: true,
          // 路径重写，剔除/api，然后将剩余的path拼接到target后，组成最终发出去请求
          // path 参数代表的是端口后的路径，例如http://localhost:6666/api/userInfo ，则path代表/api/userInfo
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/api/gen": {
          //单体架构下特殊处理代码生成模块代理
          target:
              env.VITE_IS_MICRO === "true"
                  ? env.VITE_ADMIN_PROXY_PATH
                  : env.VITE_GEN_PROXY_PATH,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
        "^/fallback/.*": {
          target: "https://jsonplaceholder.typicode.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, ""),
        },
      },
    },

    // 配置路径别名，方便在项目中使用 import.meta.env.VITE_APP_BASE_URL 获取配置的变量
    // https://cn.vitejs.dev/config/shared-options.html#resolve-alias
    // 对应的也要在 tsconfig.json 中配置 alias 以获得智能类型提示
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
        "@assets": path.resolve(process.cwd(), "src/assets"),
        "@components": path.resolve(process.cwd(), "src/components"),
        "@views": path.resolve(process.cwd(), "src/views"),
        "@utils": path.resolve(process.cwd(), "src/utils"),
      },
    },
  }
})