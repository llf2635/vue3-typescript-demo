


# 在 Vite 中，**`mode` 参数**用于区分不同环境（如开发、生产、测试等），它直接对应构建或开发时通过 `--mode` 命令行参数指定的模式。结合 `.env` 文件和环境变量，可以实现高度灵活的配置。以下是具体用法和最佳实践：

---

### **1. `mode` 的核心作用**
- **默认行为**：
    - `vite dev` / `vite serve` → `mode` 默认为 `"development"`
    - `vite build` → `mode` 默认为 `"production"`
- **自定义模式**：通过 `vite build --mode staging` 指定自定义模式（如 `staging`）。
- **环境变量加载**：根据 `mode` 自动加载对应的 `.env.[mode]` 文件（如 `.env.staging`）。

---

### **2. 基础用法示例**
#### **场景**：根据 `mode` 动态设置 API 地址和资源路径
```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 加载环境变量：根据 mode 读取 .env.[mode] 文件
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_URL || '/', // 从环境变量读取 base 路径
    define: {
      // 将环境变量注入代码全局变量（如 API 地址）
      __API_ENDPOINT__: JSON.stringify(env.VITE_API_ENDPOINT),
    },
    build: {
      // 生产模式下启用高级压缩
      minify: mode === 'production' ? 'terser' : 'esbuild',
    }
  }
})
```

#### **`.env.staging` 文件示例**：
```ini
# .env.staging
VITE_BASE_URL = /staging/
VITE_API_ENDPOINT = https://staging.api.example.com
```

---

### **3. 高级用法与技巧**

#### **(1) 结合 `loadEnv` 精细控制环境变量**
```typescript
// 加载所有以 VITE_ 开头的环境变量
const env = loadEnv(mode, process.cwd(), 'VITE_')

// 示例：根据环境变量配置代理
const serverProxy = env.VITE_PROXY_TARGET 
  ? { '/api': { target: env.VITE_PROXY_TARGET, changeOrigin: true } }
  : {}
```

#### **(2) 模式与插件条件启用**
```typescript
import legacy from '@vitejs/plugin-legacy'

export default defineConfig(({ mode }) => ({
  plugins: [
    // 仅在生产模式启用传统浏览器支持
    mode === 'production' && legacy({
      targets: ['defaults', 'not IE 11']
    })
  ].filter(Boolean) // 过滤掉 false 值
}))
```

#### **(3) 多环境配置（如 staging、testing）**
```bash
# 命令行指定模式
vite build --mode staging
vite build --mode testing
```

```typescript
// 根据模式调整构建目录
export default defineConfig(({ mode }) => ({
  build: {
    outDir: `dist/${mode}`, // 输出到 dist/staging、dist/testing 等
  }
}))
```

---

### **4. 常见问题解决**

#### **问题 1：环境变量未生效**
- **原因**：未正确命名 `.env` 文件或环境变量前缀。Vite **默认只加载 `VITE_` 开头的变量**。
- **解决**：
    1. 确保文件名为 `.env.[mode]`（如 `.env.staging`）。
    2. 环境变量需以 `VITE_` 开头（例如 `VITE_API_KEY`）。
    3. 使用 `loadEnv` 时显式指定前缀：
       ```typescript
       const env = loadEnv(mode, process.cwd(), 'VITE_')
       ```

#### **问题 2：开发/生产模式判断混淆**
- **错误示例**：
  ```typescript
  // ❌ 错误！mode 可能为自定义值（如 staging），不能直接等同于开发/生产
  if (mode === 'development') { ... }
  ```
- **正确做法**：通过 `command` 参数判断开发或生产：
  ```typescript
  export default defineConfig(({ command, mode }) => {
    const isDev = command === 'serve'
    const isProd = command === 'build'
  })
  ```

---

### **5. 最佳实践总结**
1. **严格分离环境配置**：
    - 使用 `.env.development`、`.env.production`、`.env.staging` 等文件管理环境变量。
    - 敏感信息（如 API 密钥）存放到 `.env.local` 并添加到 `.gitignore`。

2. **优先使用环境变量**：
    - 避免在代码中硬编码环境相关值（如 API URL），通过 `import.meta.env.VITE_XXX` 动态获取。

3. **模式与命令的协作**：
    - 用 `command` 判断开发/生产行为，用 `mode` 处理环境差异（如测试、预发布）。

4. **安全注意事项**：
    - **不要在前端代码中暴露敏感变量**！以 `VITE_` 开头的变量会被打包到客户端代码中。

---

### **完整示例：多环境配置**
#### **项目结构**
```
.env.development     # 开发默认变量
.env.production      # 生产默认变量
.env.staging         # 预发布环境变量
vite.config.ts
```

#### **`vite.config.ts`**
```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const isProd = command === 'build'

  return {
    plugins: [vue()],
    base: env.VITE_BASE_URL,
    server: {
      proxy: {
        '/api': env.VITE_PROXY_TARGET || 'http://localhost:3000'
      }
    },
    build: {
      minify: isProd ? 'terser' : false,
      sourcemap: env.VITE_SOURCEMAP === 'true' // 通过环境变量控制是否生成 sourcemap
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION)
    }
  }
})
```

通过合理使用 `mode`，你可以轻松实现多环境配置的自动化管理，提升项目的灵活性和可维护性。