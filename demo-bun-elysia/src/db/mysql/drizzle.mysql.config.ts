import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// 动态获取数据库类型（示例值，实际通过环境变量传递）
// 获取当前数据库类型（默认为 postgresql）
const dialect = process.env.DB_DIALECT as 'postgresql' | 'mysql' | 'sqlite';
console.log('dialect:', dialect);

// 只有 mysql 数据库需要手动安装 mysql2 数据库驱动，而 postgresql、sqlite 数据库不需要
// bun add drizzle-orm mysql2 dotenv
// bun add -D drizzle-kit
// 参考 https://drizzle.zhcndoc.com/docs/get-started/mysql-new
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
    mysql -u root -p    # 登录 MySQL（使用 root 用户）需要输入 root 用户密码
    CREATE DATABASE database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;     -- 创建数据库
    CREATE USER 'my_user'@'localhost' IDENTIFIED BY 'my_password';  -- 创建一个新用户（替换 `username` 和 `password`）
    ALTER USER 'my_user'@'%' IDENTIFIED BY 'new_password';      -- 允许远程访问的 my_user 用户
    DROP USER 'root'@'%'; -- 删除允许远程访问的 root 用户
    GRANT ALL PRIVILEGES ON my_database.* TO 'my_user'@'localhost';     -- 授予用户对特定数据库的所有权限
    FLUSH PRIVILEGES;   -- 刷新权限（使配置立即生效）
    SHOW GRANTS FOR 'my_user'@'localhost';      -- 查看用户权限

    # .env
    DATABASE_URL="mysql://my_user:my_password@localhost:3306/my_database"
*/