// 数据插入参考 https://drizzle.zhcndoc.com/docs/insert
import {drizzle} from "drizzle-orm/bun-sql";
import {users} from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

// insert into "users" ("name") values ("Andrew");
await db.insert(users).values({ name: 'Andrew' });

// 您可以在 PostgreSQL 和 SQLite 中插入一行并获得返回值，MySQL 本身并不原生支持在使用 INSERT 后使用 RETURNING。
// 全部返回
await db.insert(users).values({ name: "Dan" }).returning();
// 部分返回
await db.insert(users)
    .values({ name: "Partial Dan" })
    .returning({
        insertedId: users.id
    });

// onConflictDoNothing 会在发生冲突时取消插入
await db.insert(users)
    .values({ id: 1, name: 'John' })
    .onConflictDoNothing();

// 显式指定冲突目标
await db.insert(users)
    .values({ id: 1, name: 'John' })
    .onConflictDoNothing({ target: users.id });

// onConflictDoUpdate 会在发生冲突时更新该行
await db.insert(users)
    .values({ id: 1, name: 'Dan' })
    .onConflictDoUpdate({ target: users.id, set: { name: 'John' } });
