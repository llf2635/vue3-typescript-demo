// 在SQLite中，没有 Schema模式的概念，因此您只能在单个SQLite文件上下文中定义表
// 参考 Bun 官方文档 https://bun.sh/docs/api/sqlite
// 参考 https://drizzle.zhcndoc.com/docs/get-started/bun-sqlite-new
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database(process.env.DB_FILE_NAME!);
export const db = drizzle({ client: sqlite });

