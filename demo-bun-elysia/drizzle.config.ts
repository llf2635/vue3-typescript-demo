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
    // casing: "snake_case",   // 默认为 camelCase，这里改为 snake_case
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});

// TODO 使用 drizzle-kit 命令时，Drizzle 不会自动创建数据库本身 ，但会根据 schema.ts 自动创建表结构（如果数据库已存在）。建议 ：开发环境用 push，生产环境用迁移文件。



// 对于 sqlite，采用 bun 官方的内置驱动，只有 mysql 和 pgsql 需要安装 mysql2 和 pg 作为驱动
// bun add drizzle-orm mysql2 dotenv
// bun add -D drizzle-kit

// 如果运行 bun run drizzle-kit generate 时没有使用 --config 手动指定配置文件，则默认会寻找 ./drizzle.config.ts 文件
// bun run drizzle-kit generate --config=./your-custom.config.ts

// bun run drizzle-kit help      这个命令会列出所有drizzle-kit支持的命令
// bun run drizzle-kit push     如果数据库和表都还没有创建，那么可以push一下，这会基于 schema.ts 创建数据库和表，此外当我们修改schema.ts文件后，也可以push一下，这会基于schema.ts更新数据库和表结构。
// bun run drizzle-kit generate     根据schema.ts生成迁移SQL文件，
// bun run drizzle-kit migrate       运行迁移SQL文件，将数据库表结构更新到最新。
// bun run drizzle-kit pull     如果数据库和表已经创建好了，那么可以pull一下，把表结构拉到本地生成schema.ts文件
// bun run drizzle-kit studio     运行一个可视化工具，可以查看数据库表结构，以及执行SQL语句。   需要安装 brew install mkcert    mkcert -install

// push：直接修改数据库结构（适合开发环境）。
// generate + migrate：生成迁移文件（适合生产环境）。