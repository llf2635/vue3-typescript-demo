// 数据删除参考 https://drizzle.zhcndoc.com/docs/delete
import {drizzle} from "drizzle-orm/bun-sql";
import {users} from "./schema";
import {eq} from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

await db.delete(users);

await db.delete(users).where(eq(users.name, 'Dan'));

// 删除数据后，返回删除的数据
const deletedUser = await db.delete(users)
    .where(eq(users.name, 'Dan'))
    .returning();

// 删除数据后，返回删除的部分数据
const deletedUserIds: { deletedId: number }[] = await db.delete(users)
    .where(eq(users.name, 'Dan'))
    .returning({ deletedId: users.id });
