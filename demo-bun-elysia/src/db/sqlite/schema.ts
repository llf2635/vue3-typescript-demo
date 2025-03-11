// 您可以使用drizzle-orm定义它们并在查询中使用它们，但它们不会被drizzle-kit检测到或包含在迁移流程中
// 在MySQL中，数据库 Database 和 Schema 两者是等同的。Database(Schema) -> Table
// 参考 https://drizzle.zhcndoc.com/docs/get-started/bun-sqlite-new

import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    age: int().notNull(),
    email: text().notNull().unique(),
});
