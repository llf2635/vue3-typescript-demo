import {drizzle} from "drizzle-orm/bun-sql";
import {accounts, users} from "./schema";
import {eq} from "drizzle-orm";
import {sql} from "bun";

const db = drizzle(process.env.DATABASE_URL!);

// SQL 事务是一个或多个与数据库交互的 SQL 语句的组合。 一个事务可以作为一个单一的逻辑单元提交到数据库， 或者作为一个单一的逻辑单元回滚（撤销）。
await db.transaction(async (tx) => {
    await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
    await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
});

await db.transaction(async (tx) => {
    await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
    await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
    await tx.transaction(async (tx2) => {
        await tx2.update(users).set({ name: "Mr. Dan" }).where(eq(users.name, "Dan"));
    });
});

// 您可以将业务逻辑嵌入到事务中，并在需要时回滚
await db.transaction(async (tx) => {
    const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
    if (account.balance < 100) {
        // 这将抛出一个异常，从而回滚事务。
        tx.rollback()
    }
    await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
    await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
});

// 您可以返回一个值，该值将作为事务的结果返回给调用者。
const newBalance: number = await db.transaction(async (tx) => {
    await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
    await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));

    const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
    return account.balance;
});
