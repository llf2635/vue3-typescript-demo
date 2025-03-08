### 一、工具介绍

1. **drizzle-orm**  
   TypeScript 类型安全优先的 SQL 查询构建器，支持主流数据库，提供类型安全的数据库操作接口。

2. **drizzle-kit**  
   数据库迁移工具，用于生成和执行迁移文件，支持自动根据 Schema 变化生成 SQL 迁移脚本。

3. **drizzle-typebox**  
   用于将 Drizzle ORM 的 Schema 转换为 TypeBox 格式，方便在 Elysia 等框架中进行请求/响应数据验证。

---

### 二、项目初始化

安装通用依赖（Bun 环境）：
```bash
bun create elysia bun-elysia
cd bun-elysia
bun install
bun run dev

bun add drizzle-orm
bun add -D drizzle-kit @types/bun
```

---

### 三、数据库配置示例

#### 1. MySQL 配置

安装 MySQL 驱动：
```bash
参考 https://orm.drizzle.team/docs/get-started/mysql-new
bun add drizzle-orm mysql2 dotenv
bun add -D drizzle-kit
```

`src/db/schema.ts`（Schema 定义）：
```typescript
import { mysqlTable, varchar, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
});
```

`drizzle.config.ts`（迁移工具配置）：
```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "my_db",
  },
} satisfies Config;
```

`src/db/client.ts`（客户端初始化）：
```typescript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users } from './schema';

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'my_db',
  password: 'password',
  waitForConnections: true,
});

// 初始化 Drizzle ORM
export const db = drizzle(pool, { schema: { users }, mode: 'default' });
```

---

#### 2. PostgreSQL 配置

安装 PostgreSQL 驱动（Bun 内置支持无需安装）：
```bash
参考 drizzle 对应章节 https://orm.drizzle.team/docs/get-started/bun-sql-new
参考 Bun 对应章节 https://bun.sh/docs/api/sql
bun add drizzle-orm
bun add -D drizzle-kit @types/bun
```

`src/db/schema.ts`：
```typescript
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
});
```

`drizzle.config.ts`：
```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    host: "localhost",
    user: "postgres",
    password: "password",
    database: "my_db",
  },
} satisfies Config;
```

`src/db/client.ts`：
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './schema';

const client = postgres({
  host: 'localhost',
  database: 'my_db',
  user: 'postgres',
  password: 'password',
});

export const db = drizzle(client, { schema: { users } });
```

---

#### 3. SQLite 配置

安装 SQLite 驱动（Bun 内置支持无需安装）：
```bash
参考 https://orm.drizzle.team/docs/get-started/bun-sqlite-new
参考 Bun 对应章节 https://bun.sh/docs/api/sqlite
bun add drizzle-orm
bun add -D drizzle-kit @types/bun
```

`src/db/schema.ts`：
```typescript
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
});
```

`drizzle.config.ts`：
```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./sqlite.db"  // 数据库文件路径
  },
} satisfies Config;
```

`src/db/client.ts`（使用 better-sqlite3）：
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users } from './schema';

const sqlite = new Database('./sqlite.db');
export const db = drizzle(sqlite, { schema: { users } });
```

---

### 四、Elysia 集成

`src/index.ts`（入口文件）：
```typescript
import { Elysia } from 'elysia';
import { db } from './db/client';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const app = new Elysia()
  // 注入数据库实例到上下文
  .decorate('db', db)
  
  // 示例路由：查询所有用户
  .get("/users", async ({ db }) => {
    return await db.select().from(users);
  })
  
  // 示例路由：创建用户（使用 drizzle-typebox 验证）
  .post("/users", async ({ db, body }) => {
    const [newUser] = await db.insert(users).values(body).returning();
    return newUser;
  }, {
    // 使用 drizzle-typebox 生成验证 Schema
    body: createInsertSchema(users) 
  });

app.listen(3000);
```

---

### 五、使用 drizzle-typebox

安装依赖：
```bash
bun add @sinclair/typebox  # TypeBox 核心库
```

生成验证 Schema：
```typescript
import { createInsertSchema } from 'drizzle-typebox';
import { users } from './schema';

// 生成用户创建请求的验证 Schema
const userCreateSchema = createInsertSchema(users);
```

---

### 六、常用命令

1. 生成迁移文件：
```bash
bunx drizzle-kit generate:mysql  # 根据数据库类型替换为 pg/sqlite
```

2. 执行迁移：
```bash
bunx drizzle-kit migrate:up
```

---

### 七、注意事项

1. **Bun 兼容性**  
   SQLite 推荐使用 `better-sqlite3`，Bun 原生 SQLite 模块需自定义 Drizzle 驱动。

2. **类型安全**  
   所有数据库操作均通过 `drizzle-orm` 的查询构建器完成，确保编译时类型检查。

3. **环境变量**  
   生产环境建议通过 `process.env` 读取敏感配置。