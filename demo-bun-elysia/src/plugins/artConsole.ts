import {Elysia} from "elysia";
// bun add -D picocolors figlet @types/figlet
import c from "picocolors";
import figlet from 'figlet'
import {httpRouter} from "@/http";

// 自定义控制台打印组件
export const artConsole = new Elysia()
    .onStart(({ server }) => {
        artPrint().then(() => {
            console.log(`${c.green('🦊 Elysia 正在运行 ➜ 本地:')} ${c.underline(`http://${server?.hostname}:${server?.port}`)} \n`)
            console.log(`🦊 HTTP 服务运行在 http://${server?.hostname}:${server?.port}${httpRouter.config.prefix}`)
            console.log(`🦊 WebSocket 服务运行在 ws://${server?.hostname}:${server?.port}/ws`)
        }).catch(error => { console.error(error) })
    })

async function artPrint() {
    // 小贴士
    const tips = [
        "你知道吗？按住 Alt 点击浏览器刷新可以强制清除缓存",
        "尝试 Ctrl+Shift+R 进行硬刷新",
        "使用 .env.local 文件保存本地敏感配置",
        "Vite 的热更新延迟通常在 50ms 以内"
    ]

    // 使用 Bun.file 读取 package.json 并转为 JSON 对象
    // @ts-ignore
    const pkg = await Bun.file('package.json', {encoding: "utf-8"}).json();
    // 使用 figlet 生成 ASCII 艺术字
    const ascii = figlet.textSync(pkg.name.replace(/-/g,  ' '), {
        // 可选的字体参考官网 https://github.com/xero/figlet-fonts/tree/master
        // 或者直接去ASCII 艺术字生成工具推荐：https://patorjk.com/software/taag/#p=testall 去在线挑选
        font: "ANSI Shadow",
        horizontalLayout: 'default',
        verticalLayout: 'default',
        whitespaceBreak: true,
    })
    // 打印 ASCII 艺术字
    // ASCII 艺术字生成工具推荐：https://patorjk.com/software/taag
    console.log(c.green(ascii))

    const blank = '\n'.repeat(1)     // 一个空行
    console.log(`${c.green('➜ 作者:')} ${pkg.author.name}            ${c.green('➜ 邮箱:')} ${pkg.author.email} ${blank}`)

    // 打印项目基础信息
    console.log(`${c.bold('🚀 项目已启动!')}`)
    console.log(`${c.dim('──────────────────────────────')}`)
    console.log(`${c.green('➜ 项目名称:')} ${pkg.name}     ${c.green('➜ 版本:')} ${pkg.version}`)
    console.log(`${c.cyan('➜ Figlet版本:')} ${c.blue(`${pkg.devDependencies.figlet.replace('^', '')}`)}`)
    console.log(`${c.cyan('➜ Elysia版本:')} ${c.blue(`${pkg.dependencies.elysia.replace('^', '')}`)}`)
    console.log(`${c.cyan('➜ Bun运行时版本:')} ${c.blue(`${Bun.version}`)}`)
    console.log(`${c.dim('💡 小贴士:')} ${c.italic(c.gray(tips[Math.floor(Math.random() * tips.length)]))}`)
    console.log(`${c.dim('──────────────────────────────')}`)

    // 打印项目依赖
    console.log(`${c.bold('📦 项目依赖:')} ${blank}`)
    // Object.keys(pkg.dependencies).forEach((dep) => {
    //     console.log(`${c.green('➜')} ${dep}`)
    // })
    Object.entries(pkg.dependencies).forEach(([dep, version]) => {
        console.log(`${c.green('➜')} ${dep} ${c.dim(`(${version})`)}`)
    })
    console.log(`${c.dim('──────────────────────────────')}`)

    // 打印项目开发依赖
    console.log(`${c.bold('📦 项目开发依赖:')} ${blank}`)
    Object.entries(pkg.devDependencies).forEach(([dep, version]) => {
        console.log(`${c.green('➜')} ${dep} ${c.dim(`(${version})`)}`)
    })
    console.log(`${c.dim('──────────────────────────────')}`)

    // 打印项目脚本
    console.log(`${c.bold('📦 项目脚本:')} ${blank}`)
    Object.entries(pkg.scripts).forEach(([script, command]) => {
        console.log(`${c.green('➜')} ${script} ${c.dim(`(${command})`)}`)
    })
    console.log(`${c.dim('──────────────────────────────')}`)
}