// 数据更新参考 https://drizzle.zhcndoc.com/docs/update
import {drizzle} from "drizzle-orm/bun-sql";
import {users} from "./schema";
import {eq} from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// 更新用户名为 "Mr. Dan"
await db.update(users)
    .set({ name: 'Mr. Dan' })
    .where(eq(users.name, 'Dan'));

// 返回更新后的用户 ID
const updatedUserId: { updatedId: number }[] = await db.update(users)
    .set({ name: 'Mr. Dan' })
    .where(eq(users.name, 'Dan'))
    .returning({ updatedId: users.id });
