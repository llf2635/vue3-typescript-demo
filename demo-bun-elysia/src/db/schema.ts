// 在PostgreSQL中，有一个名为 schema 模式的实体（我们认为应该称为文件夹）。它在PostgreSQL中用于创建了一个数据库的结构：
// 在PostgreSQL中，数据库 Database 和 Schema 两者不是等同的。Database -> Schema -> Table
// 参考 https://orm.drizzle.team/docs/sql-schema-declaration

import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});
