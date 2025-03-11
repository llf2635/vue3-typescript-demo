import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// 动态获取数据库类型（示例值，实际通过环境变量传递）
// 获取当前数据库类型（默认为 postgresql）
const dialect = process.env.DB_DIALECT as 'postgresql' | 'mysql' | 'sqlite';
console.log('dialect:', dialect);

// 参考 https://drizzle.zhcndoc.com/docs/get-started/bun-sql-new
export default defineConfig({
    out: `./drizzle/migrations/${dialect}`, // 按数据库类型分目录
    schema: `./src/db/${dialect}/schema.ts`, // 指向各数据库专用 schema
    dialect: dialect,
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});


// 如果运行 bun run drizzle-kit generate 时没有使用 --config 手动指定配置文件，则默认会寻找 ./drizzle.config.ts 文件
// bun run drizzle-kit generate --config=./your-custom.config.ts

// TODO 使用 drizzle-kit 命令时，Drizzle 不会自动创建数据库本身 ，但会根据 schema.ts 自动创建表结构（如果数据库已存在）。建议 ：开发环境用 push，生产环境用迁移文件。
/*
    CREATE DATABASE dbname;     -- 创建数据库。默认创建为当前用户并使用默认配置参数
    CREATE USER username WITH PASSWORD '479368';    -- 创建新用户
    DROP DATABASE IF EXISTS dbname;
    CREATE DATABASE dbname
        WITH
        OWNER = username                -- 数据库所有者
        ENCODING = 'UTF8'           -- 字符编码
        LC_COLLATE = 'zh_CN.UTF-8'  -- 排序规则
        LC_CTYPE = 'zh_CN.UTF-8'    -- 字符分类
        CONNECTION LIMIT = -1;      -- 连接数限制, -1表示无限制
    GRANT ALL PRIVILEGES ON DATABASE dbname TO username;    -- 授权

    DATABASE_URL="postgres://username:password@localhost/dbname"
*/