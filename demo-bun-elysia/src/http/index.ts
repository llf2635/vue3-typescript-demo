import { Elysia } from 'elysia'
import {user} from "@/http/router/user";
import {note} from "@/http/router/note";

// 创建 HTTP 路由，所有的其他 Elysia 路由组件都将在这里注册，然后将本组件挂载到 app 上
// Elysia 官网 https://elysiajs.com
// 关于 Elysia 的内部配置，参考 https://elysiajs.com/patterns/configuration.html#config 例如：添加全局路由前缀 /api
// 关于 Elysia 的路由，参考 https://elysiajs.com/essential/route
// 每个 Elysia 实例都是一个组件。组件是一个可以插入其他实例的插件。它可以是 router/路由器、store/存储、service/服务或其他任何东西。https://elysiajs.com/key-concept.html
export const httpRouter = new Elysia({ prefix: '/api' })    // 在这里添加了一个全局路由前缀 /api
    .use(user)
    .use(note)
    // Elysia 路由接受值和函数作为响应。参考 https://elysia.zhcndoc.com/tutorial.html#%E8%B7%AF%E7%94%B1
    .get('/demo', 'demo')
    .get('/', () => '欢迎访问实时服务')
    // 可以使用函数来访问上下文 (Context)（路由和实例信息）例如：path、body、query、params、headers、cookies、session、store、request、response、context、error、next 等
    // 同时，我们又可以从这些内容中解构出我们需要的内容，例如 { body: { username, password } 这里存在两次解构，一次是从上下文 (Context) 中解构出 body，一次是从 body 中解构出 username 和 password
    // 此处，我们使用它来获取当前路由的路径。返回 /api/test
    .get('/test', ({ path }) => path)
    .get('/data', () => ({
        timestamp: Date.now(),
        message: '来自 HTTP 接口的数据'
    }))
    .post('/notify', ({ body }) => {
        // 这里可以触发 WebSocket 广播
        return { success: true }
    })