以下是 drizzle-kit 常用命令的详细说明及与 Bun 的配合使用方法：

---

### 一、核心命令列表

| 命令                        | 作用                                 | 典型应用场景                     |
|-----------------------------|--------------------------------------|----------------------------------|
| `generate`                  | 生成迁移文件                        | Schema 变更后生成迁移脚本        |
| `migrate:up`                | 执行未应用的迁移                    | 部署时同步数据库结构             |
| `migrate:down`              | 回滚最近一次迁移                    | 测试回滚功能/修复错误迁移        |
| `studio`                    | 启动网页版数据库管理界面            | 可视化数据操作/调试              |
| `check`                     | 验证 Schema 与数据库的同步状态      | CI/CD 流程中验证数据库一致性     |
| `introspect:generate`       | 从已有数据库生成 Schema 文件        | 存量项目接入 Drizzle ORM         |

---

### 二、命令详解与 Bun 配合使用

#### 1. 生成迁移文件
```bash
bunx drizzle-kit generate:<dialect> 
# 示例：
bunx drizzle-kit generate:mysql
bunx drizzle-kit generate:pg
bunx drizzle-kit generate:sqlite
```

**作用**：  
对比当前 Schema 与上次迁移状态的差异，生成包含 SQL 变更语句的迁移文件到 `drizzle.config.ts` 中配置的 `out` 目录

**配合 Bun 的最佳实践**：  
在 `package.json` 中添加快捷命令：
```json
{
  "scripts": {
    "generate:migrations": "drizzle-kit generate:mysql --config ./drizzle.config.ts"
  }
}
```
运行方式：
```bash
bun run generate:migrations
```

---

#### 2. 执行迁移
```bash
# 应用所有未执行迁移
bunx drizzle-kit migrate:up

# 应用指定数量迁移
bunx drizzle-kit migrate:up --steps 2

# 回滚最近一次迁移
bunx drizzle-kit migrate:down

# 回滚指定次数迁移
bunx drizzle-kit migrate:down --steps 2
```

**作用**：  
执行 `./drizzle/migrations` 目录中的迁移文件，通过 `_meta.json` 文件记录迁移状态

**生产环境建议**：  
使用编程方式执行迁移（在服务启动时自动运行）：
```typescript
import { migrate } from 'drizzle-orm/mysql2/migrator';

await migrate(db, {
  migrationsFolder: './drizzle/migrations'
});
```

---

#### 3. 启动数据库管理界面
```bash
bunx drizzle-kit studio --port 4000
```
**作用**：  
启动 Web 界面（默认 http://localhost:4000），提供以下功能：
- 可视化数据浏览/编辑
- 直接执行 SQL 查询
- 导出数据集
- 表结构分析

---

#### 4. 数据库状态校验
```bash
bunx drizzle-kit check:mysql
```
**作用**：  
验证当前 Schema 定义与实际数据库结构的一致性，输出差异报告，常用于：
- CI/CD 流程中的前置检查
- 本地开发时验证迁移正确性
- 团队协作时确保 Schema 同步

---

### 三、进阶配置技巧

#### 自定义迁移模板
在 `drizzle.config.ts` 中配置自定义模板：
```typescript
export default {
  // ...其他配置
  migrationTemplate: (props) => `// 自定义迁移模板
  import { sql } from 'drizzle-orm';
  
  export async function up(db) {
    ${props.upSQL}
  }
  
  export async function down(db) {
    ${props.downSQL}
  }`
} satisfies Config;
```

#### 多环境配置策略
使用环境变量动态配置：
```typescript
// drizzle.config.ts
export default {
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
} satisfies Config;
```
运行命令时注入环境变量：
```bash
DB_HOST=prod.example.com bunx drizzle-kit migrate:up
```

---

### 四、典型工作流示例

**场景**：添加新表后生成并应用迁移
```bash
# 1. 修改 Schema 文件
vim src/db/schema.ts

# 2. 生成迁移文件（使用 Bun 执行）
bunx drizzle-kit generate:mysql

# 3. 检查生成的 SQL
cat drizzle/migrations/0001_xxxxx.sql

# 4. 应用迁移到开发数据库
bunx drizzle-kit migrate:up

# 5. (可选) 验证生产环境一致性
DB_HOST=prod.db.example.com bunx drizzle-kit check:mysql
```

---

### 五、注意事项

1. **迁移文件命名**  
   自动生成的迁移文件名包含时间戳（如 `0001_<date>_<hash>.sql`），禁止手动修改文件名

2. **版本控制**  
   建议将 `drizzle/migrations` 目录提交到 Git 仓库，确保团队环境一致

3. **Bun 兼容性**  
   使用 `bunx` 代替 `npx` 执行命令时，需确保已安装 `drizzle-kit` 为开发依赖：
   ```bash
   bun add --dev drizzle-kit
   ```

4. **安全审计**  
   生产环境执行迁移前，建议通过 `bunx drizzle-kit check` 进行结构验证

# bunx drizzle-kit push

感谢您指出官方文档的更新！根据最新 Drizzle ORM 文档，确实新增了 `push` 命令。以下是关于该命令的详细说明及与 Bun 的配合使用方法：

---

### 一、`push` 命令详解

#### 1. 核心作用
```bash
bunx drizzle-kit push
```
**功能**：  
直接比对 Schema 定义与数据库的差异，**自动将变更同步到数据库**（无需生成迁移文件）

**典型场景**：
- 本地开发环境快速迭代
- 临时测试 Schema 变更
- 原型设计阶段快速验证

---

#### 2. 与传统迁移工作流的对比

| 特性                | `push` 命令                  | `generate` + `migrate`       |
|---------------------|------------------------------|------------------------------|
| 变更记录            | ❌ 无迁移文件                 | ✅ 生成可追踪的迁移文件       |
| 执行速度            | ⚡️ 更快（跳过生成步骤）       | ⚡ 需要两步操作               |
| 回滚能力            | ❌ 不可逆                     | ✅ 支持完整迁移历史回滚       |
| 适用环境            | 开发/测试环境                 | 所有环境（推荐生产环境使用）  |

---

### 二、Bun 环境使用指南

#### 1. 基础使用
```bash
# MySQL
bunx drizzle-kit push:mysql

# PostgreSQL
bunx drizzle-kit push:pg

# SQLite
bunx drizzle-kit push:sqlite
```

#### 2. 推荐配置（`package.json`）
```json
{
  "scripts": {
    "db:push": "drizzle-kit push:mysql --config ./drizzle.config.ts",
    "db:generate": "drizzle-kit generate:mysql",
    "db:migrate": "drizzle-kit migrate:up"
  }
}
```
运行示例：
```bash
# 开发环境快速同步
bun run db:push

# 生产环境标准流程
bun run db:generate && bun run db:migrate
```

---

### 三、多数据库配置示例

#### 1. MySQL 配置
`drizzle.config.ts`：
```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "dev_db",
  },
  // 开发模式允许直接推送
  push: {
    autoApprove: process.env.NODE_ENV === "development"
  }
} satisfies Config;
```

#### 2. PostgreSQL 配置
```typescript
export default {
  driver: "pg",
  dbCredentials: {
    connectionString: "postgres://user:pass@localhost:5432/db"
  },
  push: {
    verbose: true  // 显示详细变更信息
  }
} satisfies Config;
```

---

### 四、高级使用技巧

#### 1. 安全确认机制
默认需要人工确认变更：
```bash
$ bunx drizzle-kit push:mysql

Detected schema changes:
✔ Table `users` added column `age` (int)
Apply these changes to the database? (y/N)
```

#### 2. 强制自动执行
添加 `--yes` 参数自动确认：
```bash
bunx drizzle-kit push:mysql --yes
```

#### 3. 与迁移文件共存
混合使用场景示例：
```bash
# 1. 紧急修复使用 push
bunx drizzle-kit push:mysql

# 2. 生成对应迁移文件（用于后续环境）
bunx drizzle-kit generate:mysql --push-changes
```

---

### 五、生产环境注意事项

1. **禁用自动推送**  
   在 `drizzle.config.ts` 中配置环境检测：
```typescript
export default {
  push: {
    enabled: process.env.NODE_ENV !== "production"
  }
} satisfies Config;
```

2. **审计日志**  
   启用变更日志记录：
```bash
bunx drizzle-kit push:mysql --log-file=drizzle-push.log
```

---

### 六、典型错误处理

#### 1. 存在未应用的迁移文件
**现象**：
```bash
Error: Pushing changes requires clean migration history
```
**解决方案**：
```bash
# 先应用所有迁移
bunx drizzle-kit migrate:up

# 或清理迁移历史（仅开发环境）
rm -rf drizzle/migrations
```

#### 2. 数据库权限不足
**现象**：
```bash
Access denied for user 'dev'@'%' to database 'prod_db'
```
**解决方案**：  
确保配置中使用的数据库账号具有以下权限：
- MySQL: `ALTER`, `CREATE`, `DROP`
- PostgreSQL: `SUPERUSER` 或特定 Schema 权限
- SQLite: 文件写入权限

---

### 七、官方文档参考
- [Drizzle Kit Push 命令文档](https://orm.drizzle.team/kit-docs/commands#push)
- [迁移系统对比指南](https://orm.drizzle.team/kit-docs/overview#push-vs-migrations)

建议开发环境使用 `push` 快速迭代，生产环境仍推荐使用标准迁移流程确保变更可追溯。