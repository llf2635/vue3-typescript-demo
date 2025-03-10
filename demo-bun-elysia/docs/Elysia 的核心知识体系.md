以下是 **Elysia.js** 的核心知识体系及其实战应用指南，包含 **10 个关键模块**的详细说明和代码示例：

---

### 一、路由系统 (Routing)
**作用**：定义 API 端点与请求方法的映射关系
```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
  // 基础 GET 路由
  .get('/', () => 'Hello World')
  
  // 动态路径参数
  .get('/user/:id', ({ params }) => `用户ID: ${params.id}`)
  
  // POST 请求体处理
  .post('/login', ({ body }) => login(body))
```

---

### 二、上下文处理 (Context)
**作用**：访问请求上下文信息
```typescript
app.get('/profile', ({ 
  query,   // URL 查询参数 ?name=Alice
  params,  // 路径参数 /:id
  body,    // 请求体数据
  headers, // 请求头
  set      // 响应控制
}) => {
  set.status = 200
  set.headers['X-Powered-By'] = 'Elysia'
  return { data: '用户资料' }
})
```

---

### 三、中间件 (Middleware)
**作用**：全局或路由级的预处理
```typescript
// 全局中间件
app.use(async (ctx) => {
  console.log(`[${new Date()}] ${ctx.request.method} ${ctx.request.url}`)
  await ctx.next() // 继续处理后续中间件
})

// 路由级中间件
app.guard(
  { beforeHandle: ({ headers }) => {
    if (!headers.authorization) throw new Error('未授权')
  }}, 
  (app) => app.get('/secret', () => '机密数据')
)
```

---

### 四、状态管理 (State)
**作用**：共享全局状态
```typescript
// 设置全局状态
app.state('version', '1.0.0')

// 在路由中访问
app.get('/version', ({ store }) => {
  return { version: store.version }
})
```

---

### 五、数据验证 (Validation)
**作用**：请求参数校验
```typescript
import { t } from 'elysia'

app.post('/register', ({ body }) => register(body), {
  // 定义校验规则
  body: t.Object({
    username: t.String({ minLength: 3 }),
    email: t.String({ format: 'email' }),
    age: t.Number({ minimum: 18 })
  })
})
```

---

### 六、错误处理 (Error Handling)
**作用**：统一错误响应
```typescript
// 全局错误处理器
app.onError(({ code, error }) => {
  return new Response(error.toString(), { 
    status: code === 'NOT_FOUND' ? 404 : 500 
  })
})

// 主动抛出错误
app.get('/error', () => {
  throw new Error('测试错误')
})
```

---

### 七、插件系统 (Plugins)
**作用**：扩展框架功能
```typescript
import { swagger } from '@elysiajs/swagger'

// 使用 Swagger 文档插件
app.use(swagger({
  documentation: {
    info: { title: 'API 文档', version: '1.0.0' }
  }
}))

// 使用静态文件服务
import { staticPlugin } from '@elysiajs/static'
app.use(staticPlugin({ assets: 'public' }))
```

---

### 八、WebSocket 支持
**作用**：实现实时双向通信
```typescript
import { websocket } from '@elysiajs/websocket'

app.use(websocket())
  .ws('/chat', {
    message(ws, message) {
      ws.send(`收到: ${message}`)
    }
  })
```

---

### 九、响应处理 (Response)
**作用**：定制不同格式的响应
```typescript
// JSON 响应
app.get('/json', () => ({ data: 'json' }))

// 文件下载
app.get('/download', () => 
  Bun.file('report.pdf')
)

// 重定向
app.get('/old', ({ set }) => {
  set.redirect = '/new'
})
```

---

### 十、依赖注入 (Dependency Injection)
**作用**：解耦业务逻辑
```typescript
// 定义服务类
class UserService {
  getUsers() { return ['Alice', 'Bob'] }
}

// 注入依赖
app.decorate('userService', new UserService())
  .get('/users', ({ userService }) => userService.getUsers())
```

以下是 **Elysia.js** 的 **进阶功能与实战技巧**，补充了更多高级用法和实际开发中的关键知识：

---

### 十一、生命周期钩子 (Lifecycle Hooks)
**作用**：监听应用生命周期事件
```typescript
const app = new Elysia()
  // 应用启动时
  .onStart(() => {
    console.log('🚀 服务已启动')
    connectDatabase() // 初始化数据库连接
  })
  // 应用关闭时
  .onStop(() => {
    console.log('🛑 服务正在关闭')
    closeDatabase() // 关闭数据库连接
  })
  // 每个请求前
  .onRequest(({ request }) => {
    console.log('📨 收到请求:', request.url)
  })
  // 每个响应后
  .onResponse(({ request, response }) => {
    console.log('📤 发送响应:', response.status)
  })
```

---

### 十二、请求/响应转换 (Transform)
**作用**：修改请求或响应数据
```typescript
// 修改请求上下文
app.post('/transform', ({ body }) => body, {
  transform({ body }) {
    if (typeof body.name === 'string') {
      body.name = body.name.trim() // 自动去除空格
    }
  }
})

// 修改响应
app.get('/modified', () => '原始数据', {
  afterHandle({ response }) {
    return `修改后的数据: ${response}`
  }
})
```

---

### 十三、流处理 (Streaming)
**作用**：处理大文件或实时数据流
```typescript
// 服务端推送事件 (SSE)
app.get('/sse', ({ set }) => {
  set.headers['Content-Type'] = 'text/event-stream'

  return new Response(
    new ReadableStream({
      async start(controller) {
        let count = 0
        while (true) {
          controller.enqueue(`data: ${count++}\n\n`)
          await Bun.sleep(1000)
        }
      }
    })
  )
})
```

---

### 十四、文件上传处理
**作用**：接收并处理 multipart/form-data
```typescript
app.post('/upload', async ({ body: { file } }) => {
  // 保存上传文件
  await Bun.write(`./uploads/${file.name}`, file)
  return { 
    success: true,
    path: `/uploads/${file.name}`
  }
}, {
  // 启用文件上传支持
  type: 'multipart/form-data'
})
```

---

### 十五、配置管理
**作用**：统一管理环境配置
```typescript
// 使用 dotenv 加载配置
import 'dotenv/config'

const app = new Elysia()
  .state('config', {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL
  })
  .get('/config', ({ store }) => store.config)
```

---

### 十六、性能优化技巧
#### 1. 路由懒加载
```typescript
// 动态导入路由模块
const userRoutes = await import('./routes/users')
app.use(userRoutes)
```

#### 2. 缓存策略
```typescript
app.get('/heavy', ({ set }) => {
  set.headers['Cache-Control'] = 'public, max-age=3600'
  return computeExpensiveData()
})
```

#### 3. 编译优化
```bash
# 编译为单文件可执行程序
bun build --compile src/index.ts
```

---

### 十七、安全最佳实践
#### 1. 限流防护
```typescript
import { rateLimit } from '@elysiajs/rate-limit'

app.use(rateLimit({ 
  max: 100, // 每 IP 每分钟最多 100 次请求
  generator: ({ request }) => request.headers.get('CF-Connecting-IP') // Cloudflare 用户
}))
```

#### 2. CORS 配置
```typescript
import { cors } from '@elysiajs/cors'

app.use(cors({
  origin: ['https://example.com'], // 允许的域名
  methods: ['GET', 'POST']        // 允许的 HTTP 方法
}))
```

#### 3. 请求体大小限制
```typescript
new Elysia()
  .post('/upload', ({ body }) => {...}, {
    maxBodySize: 1024 * 1024 * 10 // 限制为 10MB
  })
```

---

### 十八、测试策略
**作用**：编写端到端测试
```typescript
// 安装测试框架
bun add -D bun-test

// 测试用例示例
import { test, expect } from 'bun:test'
import { app } from '../src/index'

test('GET /api/users', async () => {
  const res = await app.handle(
    new Request('http://localhost/api/users')
  )
  expect(res.status).toBe(200)
  
  const data = await res.json()
  expect(data).toBeArray()
})
```

---

### 十九、数据库集成
#### 使用 Prisma ORM
```typescript
// 安装依赖
bun add @prisma/client
bun add -D prisma

// 初始化 Prisma
npx prisma init

// 定义模型
// prisma/schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}

// 使用 Prisma Client
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

app.get('/users', async () => {
  return prisma.user.findMany()
})
```

---

### 二十、部署指南
#### 1. Docker 部署

```dockerfile
# Dockerfile
FROM oven/bun:1.1.8

WORKDIR /app
COPY ../package.json .
COPY bun.lockb .
RUN bun install

COPY .. .
RUN bun build --compile src/index.ts

CMD ["./index"]
```

#### 2. PM2 进程管理
```bash
# 启动生产环境
pm2 start index.js -i max
```

#### 3. 静态资源托管
```typescript
import { staticPlugin } from '@elysiajs/static'

app.use(staticPlugin({ 
  assets: 'dist', // 前端构建目录
  prefix: '/'     // 托管到根路径
}))
```

---

### 二十一、监控与日志
```typescript
// 使用 Pino 日志库
import pino from 'pino'

const logger = pino()
app.onRequest(({ request }) => {
  logger.info(`${request.method} ${request.url}`)
})

app.onError(({ error }) => {
  logger.error(error)
})
```

---

### 二十二、与前端框架集成
#### 1. 共享类型定义
```typescript
// shared/types.ts
export interface User {
  id: number
  name: string
}

// 前端代码引用
import type { User } from '../shared/types'
```

#### 2. 生成 API 客户端
```bash
# 使用 openapi-generator
npx openapi-generator-cli generate -i http://localhost:3000/swagger.json -g typescript-axios -o ./src/api
```

---

通过这些进阶功能，您可以将 Elysia 应用到以下场景：
- **实时应用**：聊天系统、协作编辑
- **数据流处理**：日志分析、实时监控
- **企业级 API**：身份验证、权限管理、微服务架构
- **全栈开发**：前后端类型共享、高效协作

建议根据项目需求选择合适的功能组合，Elysia 的灵活性和性能使其能胜任从简单 API 到复杂实时系统的各类场景。

---

### 综合示例：用户管理系统 API
```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(swagger())
  .state('users', new Map<string, User>())
  .group('/api', app => app
    .post('/users', ({ body, store }) => {
      store.users.set(body.id, body)
      return { success: true }
    }, {
      body: t.Object({
        id: t.String(),
        name: t.String(),
        email: t.String({ format: 'email' })
      })
    })
    .get('/users/:id', ({ params, store }) => 
      store.users.get(params.id)
    )
  )
  .listen(3000)
```

---

### 核心优势总结
1. **类型安全**：端到端 TypeScript 支持
2. **高性能**：基于 Bun 的 HTTP 引擎
3. **模块化**：插件系统扩展性强
4. **简洁 API**：开发者体验优秀
5. **实时能力**：原生 WebSocket 集成

建议通过实际项目实践这些功能，逐步掌握 Elysia 的完整生态能力。官方文档和社区插件库是深入学习的最佳资源。