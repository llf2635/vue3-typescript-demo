以下是一个结合 Vue3 + TypeScript + Vite 的综合性配置示例，包含详细注释说明，涵盖开发/生产环境、环境变量、SSR、预览模式等场景：

```typescript
// 引入 Vite 类型和工具函数
import { defineConfig, loadEnv, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'

// 使用函数式配置（推荐）
export default defineConfig(({ command, mode, ssrBuild, isPreview }): UserConfig => {
  // 当前工作目录路径
  const root = process.cwd()
  
  // 加载环境变量（根据 mode 加载对应的 .env 文件）
  // 参数说明：mode, 目录路径, 环境变量前缀（空字符串表示加载所有）
  const env = loadEnv(mode, root, '')

  // 判断环境类型
  const isDev = command === 'serve'
  const isBuild = command === 'build'
  const isSSR = ssrBuild === true

  // 基础配置
  const baseConfig: UserConfig = {
    // 项目根目录（默认当前目录）
    root,

    // 公共基础路径（推荐通过环境变量配置）
    base: env.VITE_BASE_URL || '/',

    // 解析别名配置
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '#': resolve(__dirname, 'types')
      },
      // 自动解析扩展名（优先级顺序）
      extensions: ['.ts', '.js', '.vue', '.json']
    },

    // CSS 相关配置
    css: {
      preprocessorOptions: {
        scss: {
          // 全局注入 scss 变量（文件路径需要真实存在）
          additionalData: `@import "@/styles/variables.scss";`
        }
      },
      // 开启 CSS 模块化
      modules: {
        generateScopedName: isDev 
          ? '[name]__[local]' 
          : '[hash:base64:8]'
      }
    },

    // TypeScript 配置
    esbuild: {
      // 构建时移除 console/log
      drop: isBuild ? ['console', 'debugger'] : []
    },

    // 全局变量替换
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  }

  // 开发服务器配置
  const devServerConfig: UserConfig = {
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true, // 端口占用时直接退出
      open: true,       // 自动打开浏览器
      proxy: {
        // API 代理示例
        '/api': {
          target: env.VITE_API_BASE || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      },
      // 文件系统监听配置
      watch: {
        usePolling: true, // Docker 环境需要开启
        interval: 1000
      }
    }
  }

  // 生产构建配置
  const buildConfig: UserConfig = {
    build: {
      target: 'esnext',
      outDir: isSSR ? 'dist/ssr' : 'dist', // SSR 单独目录
      assetsDir: 'static',
      assetsInlineLimit: 4096, // 4KB 以下文件转 base64
      cssCodeSplit: true,
      sourcemap: env.VITE_SOURCEMAP === 'true', // 通过环境变量控制
      // Rollup 配置
      rollupOptions: {
        output: {
          // 分块策略
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) {
                return 'vendor-lodash'
              }
              return 'vendor'
            }
          },
          // 入口文件命名
          entryFileNames: 'static/[name]-[hash].js',
          // 资源文件命名
          assetFileNames: 'static/[name]-[hash][extname]'
        }
      },
      // 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true // 移除所有 console
        }
      }
    }
  }

  // SSR 配置
  const ssrConfig: UserConfig = {
    ssr: {
      // SSR 入口文件（需真实存在）
      entry: 'src/entry-server.ts',
      // 指定不进行 SSR 处理的依赖
      noExternal: ['vue-router']
    }
  }

  // 预览服务器配置
  const previewConfig: UserConfig = {
    preview: {
      port: 4173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://your-production-api.com',
          changeOrigin: true
        }
      }
    }
  }

  // 插件配置（条件式加载）
  const plugins = [
    vue({
      reactivityTransform: true // 启用响应性语法糖
    }),
    // 生产构建时启用传统浏览器支持
    isBuild && legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: true
    }),
    // 生成构建分析报告（仅通过 --mode report 启用）
    mode === 'report' && visualizer({
      open: true,
      filename: 'dist/stats.html'
    })
  ].filter(Boolean)

  // 合并配置
  const config: UserConfig = {
    ...baseConfig,
    plugins,
    // 条件配置合并
    ...(isDev ? devServerConfig : {}),
    ...(isBuild ? buildConfig : {}),
    ...(isSSR ? ssrConfig : {}),
    ...(isPreview ? previewConfig : {})
  }

  // 打印最终配置（调试时使用）
  if (isDev) {
    console.log('Current Vite Config:', config)
  }

  return config
})
```

### 配套文件建议

#### `.env.development`
```ini
# 开发环境变量
VITE_BASE_URL=/
VITE_API_BASE=http://localhost:3000
VITE_SOURCEMAP=true
```

#### `.env.production`
```ini
# 生产环境变量
VITE_BASE_URL=https://your-cdn.com/project/
VITE_SOURCEMAP=false
```

### 关键配置说明

1. **环境变量处理**
    - 使用 `loadEnv()` 自动加载对应模式的环境变量
    - 通过 `define` 注入构建时全局常量
    - 敏感变量应以 `VITE_` 前缀开头并通过 `.gitignore` 保护

2. **构建优化**
    - 自动分块 (`manualChunks`)
    - 按需加载传统浏览器支持 (`@vitejs/plugin-legacy`)
    - 动态控制 sourcemap 生成

3. **开发效率**
    - 热更新代理配置
    - 响应式语法糖支持
    - 路径别名简化导入

4. **SSR 支持**
    - 单独输出目录
    - 指定 SSR 入口文件
    - 排除不必要的依赖

5. **安全实践**
    - 生产环境移除 console
    - 开发环境保留调试信息
    - 严格端口控制

### 使用方式

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 自定义模式构建（加载 .env.staging）
npm run build -- --mode staging

# 生成构建分析报告
npm run build -- --mode report
```

此配置可作为现代 Web 应用的基准模板，可根据项目需求调整插件、构建策略和环境变量管理方式。