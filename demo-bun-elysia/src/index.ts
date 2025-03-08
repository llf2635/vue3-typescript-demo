import {Elysia, t} from "elysia";
import swagger from "@elysiajs/swagger";
import {note} from "./router/note";
import {user} from "./router/user";

// Elysia 关键核心概念 https://elysiajs.com/key-concept.html
// 在 Elysia 中，一切都是一个组件，// 每个 Elysia 实例都是一个组件。组件是一个可以插入其他实例的插件。它可以是 router/路由器、store/存储、service/服务或其他任何东西。https://elysiajs.com/key-concept.html
// 这迫使您将应用程序分解成小块，从而轻松添加或删除功能。
// 默认情况下，每个 Elysia 实例中的 event/life-cycle 时间循环都是彼此隔离的。

// Elysia 官网 https://elysiajs.com
// 关于 Elysia 的内部配置，参考 https://elysiajs.com/patterns/configuration.html#config 例如：添加全局路由前缀 /api
const app = new Elysia()  // 在这里添加了一个全局路由前缀 /api
    // 错误处理，参考 https://elysiajs.com/tutorial.html#error-handling
    // API 最重要的方面之一是确保没有问题，如果出错，我们需要正确处理它。
    // 我们使用 onError 生命周期来捕获服务器中抛出的任何错误。
    // 请注意，onError 是在 use（note） 之前使用的。这很重要，因为 Elysia 从上到下应用该方法。侦听器必须在路由之前应用。
    // 由于 onError 应用于根实例，因此它不需要定义范围，因为它将应用于所有子实例。
    .onError(({ error, code }) => {
        // 我们添加了一个错误侦听器，它将捕获服务器中引发的任何错误（不包括 404 Not Found）并将其记录到控制台。
        if (code === 'NOT_FOUND') return
        console.error(error)
    })
    // 应用 swagger 插件，访问 http://localhost:3000/swagger ，现在需要加上全局路由前缀 /api 访问 http://localhost:3000/api/swagger
    // 可以将 swagger 插件配置单独抽离到单独的文件中，比如 swagger.ts 使他成为一个 Elysia 组件/插件实例，然后在 app.use(swagger()) 中使用它。
    .use(swagger({
        // 选择您的提供商 Scalar 或 Swagger UI
        // 默认情况下，Elysia 默认使用 OpenAPI V3 架构和Scalar UI
        provider: "scalar",
        // 自定义 Swagger 配置, 参考 Swagger 2.0 配置
        documentation: {
            info: {
                title: 'API 文档',
                description: '使用基于 Bun 的 Web 框架 Elysia 搭建后端服务，🦔 API 文档',
                termsOfService: 'https://elysiajs.com',
                contact: {
                    name: 'Elysia',
                    url: 'https://elysiajs.com',
                    email: '<EMAIL>'
                },
                license: {
                    name: 'MIT',
                    url: 'https://elysiajs.com'
                },
                version: '1.0.0'
            },
        },
        // Version to use for swagger cdn bundle
        // version: '1.0.0',
    }))
    .use(httpRouter)
    .use(websocketRouter)
    .listen(3000)

// 处理程序是一个响应每个路由请求的功能。接受请求信息并向客户返回响应。
// 另外，在其他框架中，处理程序也被称为控制器。 https://elysiajs.com/essential/handler.html#context


// bun add -D picocolors figlet @types/figlet
import c from "picocolors";
import figlet from 'figlet'
import {httpRouter} from "@/http";
import {websocketRouter} from "@/websocket";

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

artPrint().then(success => {
    console.log(`${c.green('🦊 Elysia 正在运行 ➜ 本地:')} ${c.underline(`http://${app.server?.hostname}:${app.server?.port}${app.config.prefix}`)} \n`)
    console.log(`🦊 HTTP 服务运行在 http://${app.server?.hostname}:${app.server?.port}${app.config.prefix}`)
    console.log(`🦊 WebSocket 服务运行在 ws://${app.server?.hostname}:${app.server?.port}/ws`)
}).catch(error => { console.error(error) })

