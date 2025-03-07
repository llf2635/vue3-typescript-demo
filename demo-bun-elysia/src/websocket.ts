import { Context } from 'elysia'

// 存储活跃连接
const activeConnections = new Set<WebSocket>()

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