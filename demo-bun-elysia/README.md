使用 Bun 的各种工具和框架的指南集合 https://bun.net.cn/guides/ecosystem
将 Drizzle ORM 与 Bun 一起使用 https://bun.net.cn/guides/ecosystem/drizzle
使用 Elysia 和 Bun 构建 HTTP 服务器，来自 Bun 官方文档指南 https://bun.net.cn/guides/ecosystem/elysia
Elysia 插件官方文档，参考 https://elysiajs.com/plugins/overview.html

官方插件
bun add @elysiajs/jwt
bun add @elysiajs/cron
bun add @elysiajs/cors
bun add @elysiajs/bearer
bun add @elysiajs/opentelemetry
bun add @elysiajs/server-timing
bun add @elysiajs/static
bun add @elysiajs/swagger


Drizzle ORM 官网 https://orm.drizzle.team
bun add drizzle-orm pg
bun add -D drizzle-kit @types/pg

bun add drizzle-orm pg dotenv
bun add -D drizzle-kit tsx @types/pg



Bun提供原生绑定，用于使用基于Promise的现代API处理PostgreSQL数据库。
接口设计简单且高性能，使用标记的模板字面值进行查询，并提供连接池、事务和准备语句等功能。
https://bun.sh/docs/api/sql
https://orm.drizzle.team/docs/connect-bun-sql
如果我们使用的是 PostgreSQL 数据库，可以使用 Bun 官方的 方案，然后配合 Drizzle ORM。安装下面两个依赖即可
bun add drizzle-orm
bun add -D drizzle-kit
然后配置如下：

```typescript
// src/db/pgsql.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';

// 默认使用的是 drizzle 内置的 
const db = drizzle(process.env.DATABASE_URL);

const result = await db.select().from(...);
```
推荐使用 Bun 提供的驱动，如果您需要提供您现有的驱动程序：参考 https://orm.drizzle.team/docs/connect-bun-sql
```typescript
// src/db/pgsql.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from "bun";

// Bun的SQL客户端自动管理一个连接池，这是一个用于多个查询的数据库连接池。
// 这有助于减少为每个查询建立和关闭连接的开销，也有助于管理与数据库的并发连接数量。
// 参考 https://bun.sh/docs/api/sql#connection-pooling
const client = new SQL({
    // 必需
    // url: "postgres://user:pass@localhost:5432/dbname",
    url: process.env.DATABASE_URL!,

    // 默认连接池设置，参考 https://bun.sh/docs/api/sql#connection-pooling
    // Bun的SQL客户端自动管理一个连接池，一般无需自己配置这些内容
    max: 20, // 池中的最大连接数
    idleTimeout: 30, // 30 秒后关闭空闲连接
    maxLifetime: 3600, // 连接生存期（以秒为单位）（0 = 永远）
    connectionTimeout: 10, // 建立新连接时超时

    // SSL/TLS 选项
    tls: false,
    // tls: {
    //   rejectUnauthorized: true,
    //   requestCert: true,
    //   ca: "path/to/ca.pem",
    //   key: "path/to/key.pem",
    //   cert: "path/to/cert.pem",
    //   checkServerIdentity(hostname, cert) {
    //     ...
    //   },
    // },

    // 回调
    onconnect: client => {
        console.log("已连接到数据库");
    },
    onclose: client => {
        console.log("连接已关闭");
    },
});
// 如果是只配置连接地址的情况下，可以直接如下配置
// const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });

const result = await db.select().from(...);
```