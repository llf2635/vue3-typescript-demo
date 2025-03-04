在 Vite 中可以通过自定义插件实现控制台艺术字输出，以下是完整的配置示例和效果展示：

```typescript
// vite.config.ts
import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import c from 'picocolors'

// 自定义控制台艺术字插件
const consoleArtPlugin = (): Plugin => {
  return {
    name: 'vite-console-art',
    apply: 'serve', // 仅开发模式生效
    configureServer(server) {
      return () => {
        server.httpServer?.once('listening', () => {
          const info = server.config.logger.info
          const blank = '\n'.repeat(2)
          
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
${c.cyan('➜ 本地地址:')} ${c.white(
            c.underline(`http://localhost:${server.config.server.port}`)
          )}
${c.cyan('➜ 网络地址:')} ${c.white(
            c.underline(`http://${getNetworkIp()}:${server.config.server.port}`)
          )}
${c.cyan('➜ 运行环境:')} ${c.yellow(process.env.NODE_ENV)}
${c.cyan('➜ Vite 版本:')} ${c.blue(`v${require('vite/package.json').version}`)}
${c.dim('──────────────────────────────')}
${c.gray('按')} ${c.red('q')} ${c.gray('退出监控')}
          `
          
          info(blank + artText + blank)
        })
      }
    }
  }
}

// 获取本机网络IP地址
function getNetworkIp(): string {
  const interfaces = require('os').networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (const alias of iface) {
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
  return '0.0.0.0'
}

export default defineConfig({
  plugins: [
    vue(),
    consoleArtPlugin() // 启用自定义插件
  ],
  server: {
    port: 5173,
    open: false // 禁用自动打开浏览器
  }
})
```

**实现效果：**

![控制台艺术字效果](https://cdn.jsdelivr.net/gh/fantastic-admin/webapp@main/public/demo-console-art.png)

**功能说明：**

1. **动态网络IP显示**
    - 自动检测并显示本机局域网IP，方便移动端调试
    - 支持多网卡环境（WiFi/有线同时连接）

2. **环境信息展示**
    - 当前运行环境 (development/production)
    - Vite 版本号
    - 本地和网络访问地址

3. **视觉增强**
    - 使用 `picocolors` 进行彩色输出
    - ASCII 艺术字生成（使用在线工具自定义样式）
    - 醒目的分割线和图标符号

4. **智能适配**
    - 自动读取服务器实际端口
    - 仅开发环境生效，不影响生产构建

**扩展建议：**

1. **自定义艺术字**  
   访问 [ASCII 艺术字生成器](https://patorjk.com/software/taag) 生成个性化文字：
   ```text
   可用字体推荐：
   - "Big" 
   - "ANSI Shadow"
   - "3D-ASCII"
   ```

2. **添加项目信息**  
   在输出中显示 package.json 信息：
   ```typescript
   const pkg = require('./package.json')
   
   // 在输出模板中添加：
   ${c.cyan('➜ 项目名称:')} ${c.magenta(pkg.name)}
   ${c.cyan('➜ 当前版本:')} ${c.cyan(`v${pkg.version}`)}
   ```

3. **添加随机提示**  
   创建有趣的随机启动语录：
   ```typescript
   const tips = [
     "你知道吗？按住 Alt 点击浏览器刷新可以强制清除缓存",
     "尝试 Ctrl+Shift+R 进行硬刷新",
     "使用 .env.local 文件保存本地敏感配置",
     "Vite 的热更新延迟通常在 50ms 以内"
   ]

   // 在输出中添加：
   ${c.dim('💡 小贴士:')} ${c.italic(c.gray(tips[Math.floor(Math.random() * tips.length)]))}
   ```

4. **添加安全警告**  
   当检测到敏感信息时提示：
   ```typescript
   if (process.env.VITE_API_KEY) {
     info(c.red('⚠️ 警告：检测到敏感环境变量 VITE_API_KEY 被前端使用！'))
   }
   ```

**注意事项：**

1. **依赖安装**  
   需要安装颜色库：
   ```bash
   npm install picocolors
   ```

2. **TypeScript 支持**  
   在 env.d.ts 中添加类型声明：
   ```typescript
   declare module 'os' {
     interface NetworkInterfaceInfo {
       address: string
       family: string
       internal: boolean
     }
   }
   ```

3. **兼容性处理**  
   旧版本 Windows 可能需要设置：
   ```typescript
   // 在插件配置中添加
   process.env.FORCE_COLOR = 'true'
   ```

这种增强型控制台输出不仅能提升开发体验，还能帮助团队新成员快速了解项目状态，推荐作为现代前端项目的标准配置。