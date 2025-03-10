以下是 **Elysia.js** 集成 **MySQL**、**PostgreSQL** 和 **Redis** 的完整实现方案，包含详细注释说明：

---

### 一、通用配置
#### 1. 安装依赖
```bash
# MySQL
bun add drizzle-orm mysql2 dotenv
bun add -d drizzle-kit @types/mysql2

# PostgreSQL
bun add drizzle-orm pg dotenv
bun add -D drizzle-kit @types/pg

# Redis
bun add ioredis

# 环境变量管理
bun add dotenv
```

#### 2. 环境文件 (`.env`)
```env
# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASS=secret
MYSQL_DB=elysia_db

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASS=secret
PG_DB=elysia_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

### 二、MySQL 集成
#### 1. 连接配置与模型定义
```typescript
// src/db/mysql.ts
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { users } from './schema'

// 创建连接池
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10
})

// 创建 Drizzle ORM 实例
export const db = drizzle(pool)

// 定义数据模型
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow()
})
```

#### 2. 业务逻辑使用
```typescript
// src/routes/users.ts
import { Elysia } from 'elysia'
import { db, users } from '../db/mysql'

export const userRoutes = new Elysia()
  .post('/users', async ({ body }) => {
    // 创建用户
    const [result] = await db.insert(users).values(body)
    return { id: result.insertId }
  })
  .get('/users/:id', async ({ params }) => {
    // 查询用户
    return db.select().from(users)
      .where(eq(users.id, params.id))
      .limit(1)
  })
```

---

### 三、PostgreSQL 集成
#### 1. 连接配置与模型定义
```typescript
// src/db/pg.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users } from './schema'

// 创建连接池
const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DB,
  max: 20
})

// 创建 Drizzle ORM 实例
export const db = drizzle(pool)

// 定义数据模型（与 MySQL 不同）
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  profile: jsonb('profile'),
  createdAt: timestamp('created_at').defaultNow()
})
```

#### 2. 业务逻辑使用
```typescript
// src/routes/posts.ts
import { Elysia } from 'elysia'
import { db, posts } from '../db/pg'

export const postRoutes = new Elysia()
  .post('/posts', async ({ body }) => {
    // 创建文章（支持 JSONB）
    const [result] = await db.insert(posts).values(body)
    return { id: result.id }
  })
  .get('/posts', async () => {
    // 分页查询
    return db.select().from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(10)
  })
```

---

### 四、Redis 集成
#### 1. 连接配置
```typescript
// src/cache/redis.ts
import Redis from 'ioredis'

// 创建 Redis 客户端
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null // 禁用重试限制
})

// 定义键前缀常量
export const CACHE_KEYS = {
  SESSION: (userId: string) => `session:${userId}`,
  RATE_LIMIT: (ip: string) => `rate_limit:${ip}`
}
```

#### 2. 缓存中间件
```typescript
// src/middlewares/cache.ts
import { redis, CACHE_KEYS } from '../cache/redis'

export const cacheMiddleware = (ttl: number) => 
  async ({ request, set }: Context) => {
    const cacheKey = request.url
    const cached = await redis.get(cacheKey)

    if (cached) {
      set.headers['X-Cache'] = 'HIT'
      return JSON.parse(cached)
    }

    set.headers['X-Cache'] = 'MISS'
    await next() // 继续处理请求

    // 缓存响应结果
    redis.setex(cacheKey, ttl, JSON.stringify(response))
  }
```

#### 3. 业务逻辑使用
```typescript
// src/routes/auth.ts
import { Elysia } from 'elysia'
import { redis, CACHE_KEYS } from '../cache/redis'

export const authRoutes = new Elysia()
  .post('/login', async ({ body, setCookie }) => {
    // ... 验证逻辑 ...
    
    // 存储会话
    await redis.set(
      CACHE_KEYS.SESSION(user.id),
      JSON.stringify(sessionData),
      'EX', 3600 // 1 小时过期
    )

    setCookie('session', token, {
      httpOnly: true,
      maxAge: 3600
    })
  })
  .get('/profile', 
    async ({ cookie: { session } }) => {
      // 获取会话数据
      const data = await redis.get(
        CACHE_KEYS.SESSION(session.value))
      return JSON.parse(data)
    }
  )
```

---

### 五、综合应用示例
```typescript
// src/index.ts
import { Elysia } from 'elysia'
import { userRoutes } from './routes/users'
import { postRoutes } from './routes/posts'
import { authRoutes } from './routes/auth'
import './db/mysql' // 初始化 MySQL
import './db/pg'    // 初始化 PostgreSQL
import './cache/redis' // 初始化 Redis

const app = new Elysia()
  .use(userRoutes)
  .use(postRoutes)
  .use(authRoutes)
  .listen(3000)
```

---

### 六、最佳实践建议
1. **连接池管理**
    - MySQL/PostgreSQL 设置合理的 `connectionLimit`
    - Redis 使用 `pipeline` 批量操作提升性能

2. **错误处理**
   ```typescript
   app.onError(({ code, error }) => {
     if (error instanceof DatabaseError) {
       return { code: 503, message: '数据库错误' }
     }
   })
   ```

3. **事务处理**
   ```typescript
   // MySQL 事务示例
   await db.transaction(async (tx) => {
     await tx.insert(users).values(userData)
     await tx.insert(logs).values(logData)
   })
   ```

4. **性能监控**
   ```typescript
   // 记录查询耗时
   app.onRequest(({ request }) => {
     const start = Date.now()
     request.startTime = start
   })

   app.onResponse(({ request }) => {
     console.log(`请求耗时: ${Date.now() - request.startTime}ms`)
   })
   ```

---

### 七、不同数据库适用场景
| **数据库**     | **适用场景**                     | **性能特点**               |
|----------------|--------------------------------|--------------------------|
| **MySQL**      | 关系型数据、复杂事务            | OLTP 优化、ACID 支持      |
| **PostgreSQL** | 地理数据、JSON 存储、复杂查询   | 扩展性强、支持高级数据类型 |
| **Redis**      | 缓存、会话存储、实时排行榜       | 超高性能、内存存储         |

通过合理组合使用这些数据库，可以构建出高性能、可扩展的全栈应用系统。建议根据业务需求选择合适的存储方案，必要时可结合多种数据库实现优势互补。