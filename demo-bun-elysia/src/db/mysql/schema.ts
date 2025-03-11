// 在MySQL中，有一个名为Schema的实体，但在MySQL中，这相当于一个数据库。
// 您可以使用drizzle-orm定义它们并在查询中使用它们，但它们不会被drizzle-kit检测到或包含在迁移流程中
// 在MySQL中，数据库 Database 和 Schema 两者是等同的。Database(Schema) -> Table
// 参考 https://orm.drizzle.team/docs/sql-schema-declaration

import {AnyMySqlColumn, mysqlTable} from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";

export const users = mysqlTable(
    "users",
    {
        id: t.int().primaryKey().autoincrement(),
        firstName: t.varchar("first_name", { length: 256 }),
        lastName: t.varchar("last_name", { length: 256 }),
        email: t.varchar({ length: 256 }).notNull(),
        invitee: t.int().references((): AnyMySqlColumn => users.id),
        role: t.mysqlEnum(["guest", "user", "admin"]).default("guest"),
    },
    (table) => [
        t.uniqueIndex("email_idx").on(table.email)
    ]
);

export const posts = mysqlTable(
    "posts",
    {
        id: t.int().primaryKey().autoincrement(),
        slug: t.varchar({ length: 256 }).$default(() => generateUniqueString(16)),
        title: t.varchar({ length: 256 }),
        ownerId: t.int("owner_id").references(() => users.id),
    },
    (table) => [
        t.uniqueIndex("slug_idx").on(table.slug),
        t.index("title_idx").on(table.title),
    ]
);

export const comments = mysqlTable("comments", {
    id: t.int().primaryKey().autoincrement(),
    text: t.varchar({ length: 256 }),
    postId: t.int("post_id").references(() => posts.id),
    ownerId: t.int("owner_id").references(() => users.id),
});


function generateUniqueString(length: number = 12): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueString = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueString += characters[randomIndex];
    }

    return uniqueString;
}