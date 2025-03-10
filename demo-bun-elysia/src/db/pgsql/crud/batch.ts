import {drizzle} from "drizzle-orm/bun-sql";
import {users} from "./schema";
import {eq} from "drizzle-orm";
import {BatchResponse} from "drizzle-orm/batch";
import * as schema from './schema';

const db = drizzle({ schema });

const batchResponse: BatchResponse = await db.batch([
    db.insert(users).values({ id: 1, name: 'John' }).returning({ id: users.id }),
    db.update(users).set({ name: 'Dan' }).where(eq(users.id, 1)),
    db.query.users.findMany({}),
    db.select().from(users).where(eq(users.id, 1)),
    db.select({ id: users.id, invitedBy: users.invitedBy }).from(users),
]);
