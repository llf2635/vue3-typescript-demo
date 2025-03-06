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
    let config: ResolvedConfig
    let serverInfo: ViteDevServer

    return {
        name: 'vite-plugin-vue-console-art',
        apply: 'serve', // 仅开发模式生效
        enforce: 'pre',

        // 获取最终配置，参考 Vite 官方文档 https://cn.vitejs.dev/guide/api-plugin#configresolved
        configResolved(resolvedConfig: ResolvedConfig)  {
            config = resolvedConfig
        },

        // 配置开发服务器
        configureServer(server: ViteDevServer) {
            serverInfo = server
            return () => {
                server.httpServer?.once('listening', () => {
                    const info = server.config.logger.info

                    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
                    pkg.name = pkg.name || '项目'


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
${c.bold('🚀 项目已启动！')}
${c.dim('──────────────────────────────')}
                    `
                    info(artText)
                    // const blank = '\n'.repeat(1)
                    // info(blank + artText + blank)
                })
            }
        },
    }

// ==================== 自定义方法 ====================
// 打印艺术字
function printArt(options?: ConsoleArtOptions) {
    const defaultArt = `
${c.green(`
 ██████╗ ██████╗ ████████╗██╗███╗   ██╗███████╗
██╔═══██╗██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝
██║   ██║██████╔╝   ██║   ██║██╔██╗ ██║█████╗  
██║   ██║██╔═══╝    ██║   ██║██║╚██╗██║██╔══╝  
╚██████╔╝██║        ██║   ██║██║ ╚████║███████╗
 ╚═════╝ ╚═╝        ╚═╝   ╚═╝╚═╝  ╚═══╝╚══════╝
`)}`
    console.log(options?.artText || defaultArt)
}

// 打印服务器信息
function printServerInfo(server: ViteDevServer) {
    const viteConfig = server.config

    const info = server.config.logger.info
    // const isDev = viteConfig.command === 'serve'

    info(c.dim('──────────────────────────────'))
    info(`${c.cyan('➜ 运行环境:')} ${c.yellow(viteConfig.mode)}`)
    info(`${c.cyan('➜ Vite版本:')} ${c.blue(`v${viteConfig.define?.VITE_VERSION}`)}`)

    info(c.dim('──────────────────────────────'))
}

// 获取网络地址
function getNetworkUrl(server: ViteDevServer) {
    const address = server.httpServer?.address()
    if (!address || typeof address === 'string') return ''

    const host = address.address === '::' ? 'localhost' : address.address
    return c.underline(`http://${host}:${address.port}`)
}
