// 在PostgreSQL中，有一个名为 schema 模式的实体（我们认为应该称为文件夹）。它在PostgreSQL中用于创建了一个数据库的结构：
// 在PostgreSQL中，数据库 Database 和 Schema 两者不是等同的。Database -> Schema -> Table
// 参考 https://orm.drizzle.team/docs/sql-schema-declaration

import {AnyPgColumn, pgEnum, pgTable as table} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"]);

// 此处使用的是
export const users = table(
    "users",
    {
        id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
        firstName: t.varchar("first_name", { length: 256 }),
        lastName: t.varchar("last_name", { length: 256 }),
        email: t.varchar().notNull(),
        invitee: t.integer().references((): AnyPgColumn => users.id),
        role: rolesEnum().default("guest"),
    },
    (table) => [
        t.uniqueIndex("email_idx").on(table.email)
    ]
);

export const posts = table(
    "posts",
    {
        id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
        slug: t.varchar().$default(() => generateUniqueString(16)),
        title: t.varchar({ length: 256 }),
        ownerId: t.integer("owner_id").references(() => users.id),
    },
    (table) => [
        t.uniqueIndex("slug_idx").on(table.slug),
        t.index("title_idx").on(table.title),
    ]
);

export const comments = table("comments", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    text: t.varchar({ length: 256 }),
    postId: t.integer("post_id").references(() => posts.id),
    ownerId: t.integer("owner_id").references(() => users.id),
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
