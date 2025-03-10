// drizzle.config.ts (基础配置)
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// bun add pg @types/pg
export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});


// 如果运行 bun run drizzle-kit generate 时没有使用 --config 手动指定配置文件，则默认会寻找 ./drizzle.config.ts 文件
// bun run drizzle-kit generate --config=./your-custom.config.ts