import {Elysia} from 'elysia'

// 创建 WebSocket 相关 Elysia 组件/插件实例
// 关于 WebSocket 的相关配置，参考 https://elysiajs.com/patterns/websocket.html


// 存储活跃连接，也就是当前在线的连接数
const activeConnections = new Set<any>()

export const wsHandler = {
    // 连接建立时
    open(ws: WebSocket) {
        activeConnections.add(ws)
        ws.send('连接已建立')
        broadcast(`新用户加入，当前在线: ${activeConnections.size}`)
    },

    // 收到消息时
    message(ws: WebSocket, message: MessageEvent) {
        const data = message.data.toString()
        console.log('收到消息:', data)

        // 广播消息给所有客户端
        broadcast(`[用户消息] ${data}`)
    },

    // 连接关闭时
    close(ws: WebSocket) {
        activeConnections.delete(ws)
        broadcast(`用户离开，剩余在线: ${activeConnections.size}`)
    }
}

// 广播消息工具函数
function broadcast(message: string) {
    activeConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message)
        }
    })
}

export const wsServer = new Elysia()
    // WebSocket 参考 https://elysiajs.com/patterns/websocket.html
    // 使用 WebSocket 服务，访问 ws://localhost:3000/ws 在线测试网站 http://wstool.js.org
    .ws('/ws', {
        open: (ws) => {
            activeConnections.add(ws)
            ws.send('连接已建立')
            broadcast(`${ws.id} 新用户加入，当前在线: ${activeConnections.size}`)
        },
        message: (ws, message) => {
            console.log('收到消息:', message)
            const { id } = ws.data.query
            // 广播消息给所有客户端
            broadcast(`${ws.id} [用户消息] ${message}`)
        },
        close: (ws) => {
            activeConnections.delete(ws)
            broadcast(`${ws.id} 用户离开，剩余在线: ${activeConnections.size}`)
            console.log(activeConnections.size)
        },
    })




