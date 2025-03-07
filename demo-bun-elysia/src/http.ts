import { Elysia } from 'elysia'

// 创建 HTTP 路由
export const httpRoutes = new Elysia({ prefix: '/api' })
    .get('/', () => '欢迎访问实时服务')
    .get('/api/data', () => ({
        timestamp: Date.now(),
        message: '来自 HTTP 接口的数据'
    }))
    .post('/api/notify', ({ body }) => {
        // 这里可以触发 WebSocket 广播
        return { success: true }
    })