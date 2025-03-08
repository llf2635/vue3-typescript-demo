import {Elysia, t} from "elysia";
import swagger from "@elysiajs/swagger";
import {httpRouter} from "@/http";
import {websocketRouter} from "@/websocket";
import {artConsole} from "@/plugins/artConsole";

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
    .use(artConsole)
    .use(httpRouter)
    .use(websocketRouter)
    .listen(3000)

// 处理程序是一个响应每个路由请求的功能。接受请求信息并向客户返回响应。
// 另外，在其他框架中，处理程序也被称为控制器。 https://elysiajs.com/essential/handler.html#context

