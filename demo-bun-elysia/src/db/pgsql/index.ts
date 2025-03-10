import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from "bun";
import {users} from "@/db/pgsql/schema/users";

// Bun的SQL客户端自动管理一个连接池，这是一个用于多个查询的数据库连接池。
// 这有助于减少为每个查询建立和关闭连接的开销，也有助于管理与数据库的并发连接数量。
// 参考 https://bun.sh/docs/api/sql#connection-pooling
const client = new SQL({
    // 必需
    // url: "postgres://user:pass@localhost:5432/dbname",
    url: process.env.DATABASE_PGSQL_URL!,

    // 默认连接池设置，参考 https://bun.sh/docs/api/sql#connection-pooling
    // Bun的SQL客户端自动管理一个连接池，一般无需自己配置这些内容
    max: 20, // 池中的最大连接数
    idleTimeout: 30, // 30 秒后关闭空闲连接
    maxLifetime: 3600, // 连接生存期（以秒为单位）（0 = 永远）
    connectionTimeout: 10, // 建立新连接时超时

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

const result = await db.select().from(users);
console.log(result)