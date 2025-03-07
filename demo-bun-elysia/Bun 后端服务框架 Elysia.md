以下是关于 Elysia.js 的详细介绍和使用指南：

### 一、Elysia 是什么？
Elysia 是一个专为 **Bun 运行时** 优化的现代 Web 框架，具有以下核心特性：

| **特性**          | **说明**                                                                 |
|-------------------|-------------------------------------------------------------------------|
| **性能**          | 基于 Bun 的 HTTP 引擎，每秒可处理 6.8 万请求 (比 Express 快 3 倍)        |
| **类型安全**      | 原生 TypeScript 支持，提供端到端类型推断                                |
| **轻量级**        | 核心包仅 2.5KB (gzip)                                                  |
| **插件系统**      | 官方插件生态覆盖 JWT、CORS、WebSocket 等常见需求                        |
| **开发者体验**    | 智能热重载、简洁 API 设计、内置测试工具                                |

---

### 二、核心功能作用

#### 1. 路由系统
```typescript
// 支持 RESTful 和动态路由
app
  .get('/users', () => getAllUsers())
  .get('/users/:id', ({ params }) => getUserById(params.id))
  .post('/users', ({ body }) => createUser(body))
```

#### 2. 中间件处理
```typescript
// 全局中间件
app.use(
  // 请求计时
  async (ctx) => {
    const start = Date.now()
    await ctx.next()
    console.log(`请求耗时: ${Date.now() - start}ms`)
  }
)
```

#### 3. 类型安全校验
```typescript
import { t } from 'elysia'

app.post('/login', ({ body }) => login(body), {
  body: t.Object({
    username: t.String(),
    password: t.String()
  })
})
```

#### 4. 插件扩展
```typescript
// 使用 Swagger 文档插件
import { swagger } from '@elysiajs/swagger'

app.use(swagger({
  documentation: {
    info: { title: 'API 文档', version: '1.0.0' }
  }
}))
```

---

### 三、快速上手教程

#### 步骤 1：安装
```bash
bun create elysia demo-bun-elysia && cd demo-bun-elysia
bun install
```
 
#### 步骤 2：基础服务器
```typescript
// src/index.ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .listen(3000)

console.log(
  `🦊 运行在 http://${app.server?.hostname}:${app.server?.port}`
)
```

#### 步骤 3：运行开发服务器
```bash
bun run dev
# 带热重载: bun --hot run src/index.ts
```

---

### 四、核心功能详解

#### 1. 上下文处理
```typescript
app.get('/user', ({ 
  query,    // URL 查询参数
  params,   // 路径参数
  body,     // 请求体
  headers,  // 请求头
  set       // 响应控制
}) => {
  set.status = 201
  return { data: 'created' }
})
```

#### 2. 状态管理
```typescript
// 共享状态
app.state('version', '1.0.0')

app.get('/version', ({ store }) => {
  return store.version // 输出 "1.0.0"
})
```

#### 3. 错误处理
```typescript
app
  .onError(({ code, error }) => {
    console.error(`错误 ${code}:`, error)
    return new Response(error.toString())
  })
  .get('/error', () => {
    throw new Error('测试错误')
  })
```

#### 4. 文件上传
```typescript
app.post('/upload', async ({ body: { file } }) => {
  await Bun.write(`./uploads/${file.name}`, file)
  return '上传成功'
})
```

---

### 五、插件生态系统

#### 常用官方插件
| **插件**              | **功能**                     | **安装命令**                     |
|-----------------------|-----------------------------|---------------------------------|
| @elysiajs/static      | 静态资源托管                | `bun add @elysiajs/static`     |
| @elysiajs/bearer      | Bearer Token 验证           | `bun add @elysiajs/bearer`     |
| @elysiajs/websocket   | WebSocket 支持              | `bun add @elysiajs/websocket`  |
| @elysiajs/cors        | CORS 跨域配置               | `bun add @elysiajs/cors`       |

#### 插件使用示例
```typescript
import { staticPlugin } from '@elysiajs/static'

app.use(staticPlugin({
  assets: 'public',
  prefix: '/assets'
}))
```

---

### 六、数据库集成示例

#### 使用 Drizzle ORM
```typescript
// 安装依赖
bun add drizzle-orm bun:sqlite

// 初始化数据库
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'

const sqlite = new Database('mydb.sqlite')
const db = drizzle(sqlite)

// 定义模型
const users = sqlite.table('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull()
})

// 查询使用
app.get('/users', async () => {
  return await db.select().from(users)
})
```

---

### 七、性能优化技巧

1. **编译为可执行文件**
   ```bash
   bun build --compile src/index.ts
   ```

2. **集群模式**
   ```typescript
   app.listen({
     port: 3000,
     hostname: '0.0.0.0',
     maxRequestBodySize: 1024 * 1024 * 100, // 100MB
     development: process.env.NODE_ENV !== 'production'
   })
   ```

3. **缓存策略**
   ```typescript
   app.get('/heavy', ({ set }) => {
     set.headers['Cache-Control'] = 'public, max-age=3600'
     return computeHeavyData()
   })
   ```

---

### 八、与 Express 的对比

| **维度**         | **Elysia**                          | **Express**                     |
|------------------|-------------------------------------|---------------------------------|
| 性能             | 🚀 60k+ req/sec                     | 🐢 15k req/sec                  |
| 类型安全         | 原生 TypeScript 支持                | 需额外 @types/express 支持      |
| 依赖体积         | 核心 2.5KB                         | 核心 208KB                     |
| 学习曲线         | 简洁 API 设计                       | 中间件概念需适应               |
| 生态系统         | 快速增长的插件生态                  | 成熟的中间件市场              |

---

### 九、适用场景推荐

1. **全栈 TypeScript 项目**
2. **高性能 API 服务**
3. **实时应用 (WebSocket)**
4. **Serverless 函数**
5. **需要快速迭代的原型开发**

---

通过以上指南，您可以快速掌握 Elysia 的核心用法，将其作为 Bun 生态下的高效后端解决方案。其出色的性能和类型安全特性，使其成为现代 Web 开发的优选框架。