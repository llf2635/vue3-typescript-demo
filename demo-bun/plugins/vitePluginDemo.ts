// Vite 默认内置了 picocolors，用于在终端中打印彩色日志、控制台 ASCII 艺术字输出等
import c from 'picocolors';

// plugins/consoleArt.ts (Bun 适配版)
import type {Plugin, ResolvedConfig, ViteDevServer} from 'vite'
import * as fs from "node:fs";

/**
 * 自定义控制台艺术字插件，增强 Vite 开发服务器的控制台输出
 *
 * @example
 * // vite.config.ts
 * import consoleArt from '@plugins/consoleArt'
 *
 * export default defineConfig({
 *   plugins: [consoleArt({ style: 'fancy' })]
 * })
 *
 * @param options - 插件配置项
 * @returns Vite 插件实例
 */

// 插件配置项类型定义
interface ConsoleArtOptions {
    /** 是否显示网络地址（默认：true） */
    showNetwork?: boolean
    /** 自定义艺术字样式（默认：内置样式） */
    artText?: string
    /** 是否显示构建信息（默认：开发模式显示） */
    showBuildInfo?: boolean
}

export default function consoleArt(options?: ConsoleArtOptions): Plugin {
    console.log(options)
    let viteConfig: ResolvedConfig
    let serverInfo: ViteDevServer
    let buildStartTime: number

    const tips = [
        "你知道吗？按住 Alt 点击浏览器刷新可以强制清除缓存",
        "尝试 Ctrl+Shift+R 进行硬刷新",
        "使用 .env.local 文件保存本地敏感配置",
        "Vite 的热更新延迟通常在 50ms 以内"
    ]

    return {
        // ==================== 核心配置项 ====================
        name: 'vite-plugin-console-art', // 插件唯一标识（必填）
        apply: 'serve',                 // 应用场景：serve|build|both（默认：both）
        enforce: 'post',                // 执行顺序：pre|post（影响插件执行顺序）

        // ==================== 生命周期钩子 ====================
        // 1. 配置解析钩子（修改 Vite 配置）
        config(config, env) {
            console.log(c.cyan('🔧 配置解析钩子，用户配置：'), config)
            console.log(c.cyan('🔧 配置解析钩子，环境变量：'), env)
            return {
                // 合并配置（这里示例关闭默认的 clearScreen 行为）
                clearScreen: false
            }
        },

        // 获取最终配置，参考 Vite 官方文档 https://cn.vitejs.dev/guide/api-plugin#configresolved
        // 2. 配置解析完成钩子（获取最终配置）
        configResolved(config) {
            viteConfig = config
        },

        // 配置开发服务器
        configureServer(server: ViteDevServer) {
            serverInfo = server
            return () => {
                server.httpServer?.once('listening', () => {
                    const info = server.config.logger.info
                    if (process.env.VITE_API_KEY) {
                        info(c.red('⚠️ 警告：检测到敏感环境变量 VITE_API_KEY 被前端使用！'))
                    }
                    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

                    // ASCII 艺术字生成工具推荐：https://patorjk.com/software/taag
                    const artText = `
${c.green(`
 ██████╗ ██████╗ ████████╗██╗███╗   ██╗███████╗
██╔═══██╗██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝
██║   ██║██████╔╝   ██║   ██║██╔██╗ ██║█████╗
██║   ██║██╔═══╝    ██║   ██║██║╚██╗██║██╔══╝
╚██████╔╝██║        ██║   ██║██║ ╚████║███████╗
 ╚═════╝ ╚═╝        ╚═╝   ╚═╝╚═╝  ╚═══╝╚══════╝
`)}
${c.bold('🚀 项目已启动!')} ${c.dim('— 按下')} ${c.cyan('q')} ${c.dim('退出')}
${c.dim('──────────────────────────────')}
${c.green('➜ 项目名称:')} ${pkg.name} ${c.green('➜ 版本:')} ${pkg.version}
${c.cyan('➜ 运行环境:')} ${c.yellow(viteConfig.mode)}
${c.cyan('➜ Vite版本:')} ${c.blue(`v${viteConfig.env.VERSION}`)}
${c.cyan('➜ Local:')} http://localhost:${server.config.server.port}
${c.cyan('➜ Network:')} ${c.yellow(`http://${serverInfo.config.server.host}:${serverInfo.config.server.port}`)}
${c.dim('💡 小贴士:')} ${c.italic(c.gray(tips[Math.floor(Math.random() * tips.length)]))}
                    `
                    info(artText)
                    // const blank = '\n'.repeat(1)     // 两个空行
                    // info(blank + artText + blank)
                })
            }
        },

        // 4. 构建开始钩子
        buildStart() {
            buildStartTime = Date.now()
            if (viteConfig.command === 'build') {
                console.log(c.cyan('\n⚡ 开始构建生产包...'))
            }
        },

        // 5. 代码转换钩子（示例：注入版本信息）
        transform(code, id) {
            if (id.endsWith('.vue') || id.endsWith('.ts')) {
                return code.replace(
                    /__APP_VERSION__/g,
                    JSON.stringify(process.env.npm_package_version)
                )
            }
        },

        // 6. 构建结束钩子
        closeBundle() {
            if (viteConfig.command === 'build') {
                const duration = (Date.now() - buildStartTime) / 1000
                console.log(
                    c.green(`\n✅ 构建完成！耗时 ${c.bold(duration.toFixed(2))}s`) +
                    c.dim(`\n   输出目录：${c.cyan(viteConfig.build.outDir)}`)
                )
            }
        },
    }
}