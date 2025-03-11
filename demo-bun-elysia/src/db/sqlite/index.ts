// 在SQLite中，没有 Schema模式的概念，因此您只能在单个SQLite文件上下文中定义表
// 参考 Bun 官方文档 https://bun.sh/docs/api/sqlite
// 参考 https://drizzle.zhcndoc.com/docs/get-started/bun-sqlite-new
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sqlite';

export const db = drizzle(process.env.DB_FILE_NAME!);

// SQLite ：如果数据库文件不存在，Drizzle 会自动创建该文件（但 SQLite 本身是文件型数据库，无需提前创建）。