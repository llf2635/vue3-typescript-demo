import {Elysia, t} from "elysia";
import {httpRouter} from "@/http";
import {websocketRouter} from "@/websocket";
import {artConsole} from "@/plugins/artConsole";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
    .decorate('db', db) // 将数据库实例注入到 Elysia 上下文中
    .onError(({ error, code }) => {
        if (code === 'NOT_FOUND') return;
        console.error(error);
    })
    .use(swagger({
        provider: "scalar",
        documentation: {
            info: {
                title: 'API 文档',
                description: '使用基于 Bun 的 Web 框架 Elysia 搭建后端服务，API 文档',
                version: '1.0.0'
            },
        },
    }))
    .use(artConsole)
    .use(httpRouter)
    .use(websocketRouter)
    .listen(3000);