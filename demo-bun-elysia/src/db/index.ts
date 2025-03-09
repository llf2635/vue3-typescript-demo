// 用于数据库连接相关配置
// 没有使用 ORM ，直接使用 Bun 内置的原生 SQL
// 参考 Bun 的 SQLite 章节 https://bun.net.cn/docs/api/sqlite
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });


// 数据查询，https://orm.drizzle.team/docs/rqb


// bunx drizzle-kit generate:mysql  # 根据数据库类型替换为 pg/sqlite
// bunx drizzle-kit migrate:up