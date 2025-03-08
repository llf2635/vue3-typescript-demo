import { Elysia } from 'elysia'
import {user} from "@/router/user";
import {note} from "@/router/note";

// 创建 HTTP 路由，所有的其他 Elysia 路由组件都将在这里注册，然后将本组件挂载到 app 上
// Elysia 官网 https://elysiajs.com
// 关于 Elysia 的内部配置，参考 https://elysiajs.com/patterns/configuration.html#config 例如：添加全局路由前缀 /api
// 关于 Elysia 的路由，参考 https://elysiajs.com/essential/route
// 每个 Elysia 实例都是一个组件。组件是一个可以插入其他实例的插件。它可以是 router/路由器、store/存储、service/服务或其他任何东西。https://elysiajs.com/key-concept.html
export const httpRouter = new Elysia({ prefix: '/api' })    // 在这里添加了一个全局路由前缀 /api
    .use(user)
    .use(note)
    .get('/', () => '欢迎访问实时服务')
    .get('/data', () => ({
        timestamp: Date.now(),
        message: '来自 HTTP 接口的数据'
    }))
    .post('/notify', ({ body }) => {
        // 这里可以触发 WebSocket 广播
        return { success: true }
    })
    .onStart(({ server }) => {
        console.log(`🦊 HTTP 服务运行在 http://${server?.hostname}:${server?.port}${httpRouter.config.prefix}`)
    })