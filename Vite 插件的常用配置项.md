以下是 Vite 插件的常用配置项及其作用的综合性示例，包含详细注释说明：

```typescript
// plugins/consoleArt.ts
import type { Plugin, ResolvedConfig } from 'vite'
import c from 'picocolors'

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
  let viteConfig: ResolvedConfig
  let buildStartTime: number

  return {
    // ==================== 核心配置项 ====================
    name: 'vite-plugin-console-art', // 插件唯一标识（必填）
    apply: 'serve',                 // 应用场景：serve|build|both（默认：both）
    enforce: 'post',                // 执行顺序：pre|post（影响插件执行顺序）

    // ==================== 生命周期钩子 ====================
    // 1. 配置解析钩子（修改 Vite 配置）
    config(config, env) {
      return {
        // 合并配置（这里示例关闭默认的 clearScreen 行为）
        clearScreen: false
      }
    },

    // 2. 配置解析完成钩子（获取最终配置）
    configResolved(config) {
      viteConfig = config
    },

    // 3. 开发服务器配置钩子
    configureServer(server) {
      return () => {
        server.httpServer?.once('listening', () => {
          this.printArt()
          this.printServerInfo(server)
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

    // ==================== 自定义方法 ====================
    // 打印艺术字
    printArt() {
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
    },

    // 打印服务器信息
    printServerInfo(server: ViteDevServer) {
      const info = server.config.logger.info
      const isDev = viteConfig.command === 'serve'
      
      info(c.dim('──────────────────────────────'))
      info(`${c.cyan('➜ 运行环境:')} ${c.yellow(viteConfig.mode)}`)
      info(`${c.cyan('➜ Vite版本:')} ${c.blue(`v${viteConfig.version}`)}`)
      
      if (isDev && options?.showNetwork !== false) {
        info(`${c.cyan('➜ 网络地址:')} ${this.getNetworkUrl(server)}`)
      }
      
      info(c.dim('──────────────────────────────'))
    },

    // 获取网络地址
    getNetworkUrl(server: ViteDevServer) {
      const address = server.httpServer?.address()
      if (!address || typeof address === 'string') return ''
      
      const host = address.address === '::' ? 'localhost' : address.address
      return c.underline(`http://${host}:${address.port}`)
    }
  }
}
```

### 核心配置项说明

| 配置项       | 类型              | 作用说明                                                                 |
|--------------|-------------------|------------------------------------------------------------------------|
| `name`       | `string`          | **必须** 插件唯一标识，用于调试和错误追踪                                |
| `apply`      | `'serve'｜'build'` | 控制插件应用场景：<br>- `serve`：仅开发模式<br>- `build`：仅生产构建<br>- 默认：两者 |
| `enforce`    | `'pre'｜'post'`    | 控制插件执行顺序：<br>- `pre`：Vite 核心插件之前执行<br>- `post`：Vite 核心插件之后执行 |

### 生命周期钩子说明

| 钩子名称          | 触发时机                          | 典型应用场景                                                                 |
|-------------------|-----------------------------------|----------------------------------------------------------------------------|
| `config`          | 解析 Vite 配置前                  | 修改或扩展 Vite 配置                                                       |
| `configResolved`  | Vite 配置解析完成后               | 获取最终配置结果                                                           |
| `configureServer` | 开发服务器创建时                  | 添加中间件、监听服务器事件                                                  |
| `buildStart`      | 生产构建开始时                    | 初始化构建相关资源                                                         |
| `transform`       | 每个模块转换时                    | 修改源代码内容（如注入变量）                                               |
| `closeBundle`     | 构建完成时                        | 输出构建报告、清理临时文件                                                 |

### 使用示例

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import consoleArt from './plugins/consoleArt'

export default defineConfig({
  plugins: [
    consoleArt({
      showNetwork: true,
      artText: '自定义艺术字内容',
      showBuildInfo: true
    })
  ]
})
```

### 功能扩展建议

1. **性能监控**  
   在 `buildStart` 和 `closeBundle` 之间添加性能追踪：
   ```typescript
   buildStart() {
     performance.mark('build-start')
   },
   closeBundle() {
     const measure = performance.measure('build', 'build-start')
     console.log(`构建耗时：${measure.duration.toFixed(2)}ms`)
   }
   ```

2. **环境检测**  
   添加 Node.js 版本检查：
   ```typescript
   configResolved() {
     const nodeVersion = process.versions.node.split('.')[0]
     if (Number(nodeVersion) < 16) {
       throw new Error('需要 Node.js 16 或更高版本')
     }
   }
   ```

3. **交互式命令**  
   监听键盘输入实现快捷操作：
   ```typescript
   configureServer(server) {
     process.stdin.on('data', data => {
       if (data.toString() === 'r') {
         server.restart()
       }
     })
   }
   ```

该插件模板提供了完整的生命周期管理能力，既可用于简单的信息展示，也可扩展实现复杂的构建流程控制。建议根据实际项目需求选择适当的钩子和配置项进行组合。