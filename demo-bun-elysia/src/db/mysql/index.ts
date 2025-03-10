// 参考 https://drizzle.zhcndoc.com/docs/get-started-mysql
import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";

export const db = drizzle(process.env.DATABASE_URL!);
