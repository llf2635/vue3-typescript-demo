// drizzle.config.ts (基础配置)
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// 动态获取数据库类型（示例值，实际通过环境变量传递）
// 获取当前数据库类型（默认为 postgresql）
const dialect = process.env.DB_DIALECT as 'postgresql' | 'mysql' | 'sqlite';

// 关于 drizzle.config.ts 配置参考 https://drizzle.zhcndoc.com/docs/drizzle-config-file
export default defineConfig({
    // 如果采用多个 schema 文件的形式， 需要在drizzle.config.ts文件中，指定架构文件夹的路径。
    // 使用此配置，Drizzle将从架构文件夹中读取并递归地查找所有文件，并从那里获取所有drizzle表。
    out: `./drizzle/migrations/${dialect}`, // 按数据库类型分目录
    schema: `./src/db/${dialect}/schema.ts`, // 指向各数据库专用 schema
    dialect: dialect,
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});

// 如果运行 bun run drizzle-kit generate 时没有使用 --config 手动指定配置文件，则默认会寻找 ./drizzle.config.ts 文件
// bun run drizzle-kit generate --config=./your-custom.config.ts