// 引入 Vite 类型和工具函数
import { defineConfig, loadEnv, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'

// 使用函数式配置（推荐）
export default defineConfig(({ command, mode, isSsrBuild, isPreview }): UserConfig => {
    // 当前工作目录路径
    const root = process.cwd()

    // 加载环境变量（根据 mode 加载对应的 .env 文件）
    // 参数说明：mode, 目录路径, 环境变量前缀（空字符串表示加载所有）
    const env = loadEnv(mode, root, '')
    // 也可以选择只加载指定前缀的环境变量
    //  const env = loadEnv(mode, process.cwd(), 'VITE_')

    // 判断环境类型
    const isDev = command === 'serve'
    const isBuild = command === 'build'
    const isSSR = isSsrBuild === true

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
        vue(),
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