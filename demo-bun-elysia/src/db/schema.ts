// 在PostgreSQL中，有一个名为 schema 模式的实体（我们认为应该称为文件夹）。它在PostgreSQL中用于创建了一个数据库的结构：
// 在PostgreSQL中，数据库 Database 和 Schema 两者不是等同的。Database -> Schema -> Table
// 参考 https://orm.drizzle.team/docs/sql-schema-declaration

import { integer, pgTable, varchar, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
    id: serial('id').primaryKey(),
    // id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: integer('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});