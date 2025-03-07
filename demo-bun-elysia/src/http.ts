import { Elysia } from 'elysia'
import swagger from "@elysiajs/swagger";

// 创建 HTTP 路由，所有的其他 Elysia 路由组件都将在这里注册，然后将本组件挂载到 app 上
// Elysia 官网 https://elysiajs.com
// 关于 Elysia 的内部配置，参考 https://elysiajs.com/patterns/configuration.html#config 例如：添加全局路由前缀 /api
// 关于 Elysia 的路由，参考 https://elysiajs.com/essential/route
export const httpRoutes = new Elysia({ prefix: '/api' })    // 在这里添加了一个全局路由前缀 /api
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
    .get('/', () => '欢迎访问实时服务')
    .get('/data', () => ({
        timestamp: Date.now(),
        message: '来自 HTTP 接口的数据'
    }))
    .post('/notify', ({ body }) => {
        // 这里可以触发 WebSocket 广播
        return { success: true }
    })