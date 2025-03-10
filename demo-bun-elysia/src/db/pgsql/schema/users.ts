// schema/users.ts
import {pgTable, integer, varchar, timestamp} from "drizzle-orm/pg-core";
import {commonColumns} from "@/db/pgsql/schema/common.columns";


export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});


export const usersTable = pgTable('usersTable', {
    id: integer(),
    // 如果您想在TypeScript代码和数据库中使用不同的名称，您可以使用列别名.下面两种形式等效
    // first_name: varchar(),
    firstName: varchar('first_name'),
    ...commonColumns
})

function createId() {
    return "";
}

export const user = pgTable('user',
    {
        id: varchar('id')
            .$defaultFn(() => createId())
            .primaryKey(),
        username: varchar('username').notNull().unique(),
        password: varchar('password').notNull(),
        email: varchar('email').notNull().unique(),
        salt: varchar('salt', { length: 64 }).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    }
)

// query.ts
// const result = await db.select().from(users);
// SELECT "id", "first_name" from users;

