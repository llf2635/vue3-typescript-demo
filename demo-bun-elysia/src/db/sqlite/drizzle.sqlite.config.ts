import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// 动态获取数据库类型（示例值，实际通过环境变量传递）
// 获取当前数据库类型（默认为 postgresql）
const dialect = process.env.DB_DIALECT as 'postgresql' | 'mysql' | 'sqlite';
console.log('dialect:', dialect);

// 参考 https://drizzle.zhcndoc.com/docs/get-started/bun-sqlite-new
export default defineConfig({
    out: `./drizzle/migrations/${dialect}`, // 按数据库类型分目录
    schema: `./src/db/${dialect}/schema.ts`, // 指向各数据库专用 schema
    dialect: dialect,
    dbCredentials: {
        url: process.env.DB_FILE_NAME!,
        // url: "sqlite.db", // 数据库文件会生成在项目根目录下的 sqlite.db 文件
        // url: "data/sqlite.db", // 数据库文件会生成在项目根目录下的 data/ 子目录中

        // # .env 文件
        // DATABASE_URL="./data/sqlite.db"
        // url: process.env.DATABASE_URL || "sqlite.db",  // 通过环境变量动态配置路径（避免硬编码）
    },
});


// 如果运行 bun run drizzle-kit generate 时没有使用 --config 手动指定配置文件，则默认会寻找 ./drizzle.config.ts 文件
// bun run drizzle-kit generate --config=./your-custom.config.ts

// TODO 使用 drizzle-kit 命令时，Drizzle 不会自动创建数据库本身 ，但会根据 schema.ts 自动创建表结构（如果数据库已存在）。建议 ：开发环境用 push，生产环境用迁移文件。
