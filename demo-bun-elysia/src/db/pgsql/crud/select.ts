// select 选择查询参考 https://drizzle.zhcndoc.com/docs/select
// Drizzle 为您提供了从数据库中获取数据的最 SQL 风格的方法，同时保持类型安全和可组合性。
// 它原生支持几乎每种方言的所有查询特性和能力， 而其尚不支持的功能，可以通过强大的 sql 操作符由用户添加。
import {drizzle} from "drizzle-orm/bun-sql";

const db = drizzle(process.env.DATABASE_URL!);

import {integer, pgTable, serial, text} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    age: integer('age'),
});

// 从一个表中选择所有行，包括所有列：
// 相当于 select "id", "name", "age" from "users";
const result = await db.select().from(users);
// 注意结果类型是根据表的定义自动推断的，包括列的可空性。
// Drizzle 始终在 select 子句中明确列出列，而不是使用 select *。
// 这是内部要求的，以保证查询结果中的字段顺序，也是通常认为的良好实践。

// 相当于 select "id", "name" from "users";
const result1 = await db.select({
    field1: users.id,
    field2: users.name,
}).from(users);

const { field1, field2 } = result1[0];

import { eq, lt, gte, ne } from 'drizzle-orm';
import {posts} from "./schema";

await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(lt(users.id, 42));
await db.select().from(users).where(gte(users.id, 42));
await db.select().from(users).where(ne(users.id, 42));
// select "id", "name", "age" from "users" where "id" = 42;
// select "id", "name", "age" from "users" where "id" < 42;
// select "id", "name", "age" from "users" where "id" >= 42;
// select "id", "name", "age" from "users" where "id" <> 42;


// $count 参考 https://drizzle.zhcndoc.com/docs/query-utils
const count = await db.$count(users);
//    ^? number
const count = await db.$count(users, eq(users.name, "Dan")); // works with filters
// select count(*) from "users";
// select count(*) from "users" where "name" = 'Dan';


// 连接查询 https://drizzle.zhcndoc.com/docs/joins
// select ... from "users" left join "posts" on "users"."id" = "posts"."author_id"
const result = await db.select().from(users).leftJoin(posts, eq(users.id, posts.authorId))

