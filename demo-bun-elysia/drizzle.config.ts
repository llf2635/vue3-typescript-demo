// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';


// 配置参考 https://orm.drizzle.team/docs/sql-schema-declaration
export default defineConfig({
    out: './drizzle',
    // 如果采用多个 schema 文件的形式， 需要在drizzle.config.ts文件中，指定架构文件夹的路径。
    // 使用此配置，Drizzle将从架构文件夹中读取并递归地查找所有文件，并从那里获取所有drizzle表。
    schema: './src/db/schema.ts',
    dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
    dbCredentials: {
        url: process.env.DATABASE_PGSQL_URL!,
    },
});
