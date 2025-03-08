// 用于数据库连接相关配置
import { Database } from "bun:sqlite";

// 没有使用 ORM ，直接使用 Bun 内置的原生 SQL
// 参考 Bun 的 SQLite 章节 https://bun.net.cn/docs/api/sqlite


// 数据查询，https://orm.drizzle.team/docs/rqb