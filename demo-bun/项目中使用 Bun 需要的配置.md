以下是一个使用 Bun 作为运行时的 Vue3 + TypeScript + Vite 项目配置示例，包含关键文件注释说明：

---

### **项目结构**
```bash
my-vue-app/
├── src/
│   ├── main.ts       # 入口文件
│   ├── App.vue
│   └── components/
├── index.html
├── package.json     # 核心配置
├── tsconfig.json    # TS 配置
├── vite.config.ts   # Vite 配置
└── bun.lockb        # Bun 自动生成的锁文件
```

---

### **1. package.json**
```json
{
  "name": "vue3-bun-demo",
  "private": true,
  "type": "module",  // 强制使用 ESM 模块规范（Bun 推荐）
  "scripts": {
    "dev": "bun run --bun vite",  // --bun 强制使用 Bun 运行时
    "build": "bun run --bun vite build",
    "preview": "bun run --bun vite preview",
    "typecheck": "vue-tsc --noEmit"  // TS 类型检查
  },
  "dependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "typescript": "^5.2.2",
    "vite": "^4.5.0",
    "vue-tsc": "^1.8.0",
    "bun-types": "^1.0.0"  // Bun 的类型声明
  }
}
```

---

### **2. vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true  // 启用 Vue 响应性语法糖
    })
  ],
  // Bun 特定优化
  server: {
    watch: {
      usePolling: true  // 建议在 Bun 中启用文件监听
    }
  },
  build: {
    target: 'esnext'  // 使用最新 ES 特性（Bun 支持良好）
  }
})
```

---

### **3. tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",  // 使用 Bun 的模块解析策略
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "types": [
      "bun-types",  // 关键！引入 Bun 类型声明
      "vite/client"
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.vue"
  ]
}
```

---

### **4. src/main.ts**（带 Bun API 示例）
```typescript
import { createApp } from 'vue'
import App from './App.vue'

// 使用 Bun 原生 API 的示例
if (import.meta.env.DEV) {
  const serverInfo = `Bun ${Bun.version} | PID: ${process.pid}`
  console.log(`🚀 ${serverInfo}`)  // 启动时显示 Bun 版本信息
}

// 使用 Node.js 兼容层 API
const env = process.env.NODE_ENV
console.log(`Running in ${env} mode`)

// 创建 Vue 应用
createApp(App).mount('#app')
```

---

### **5. 安装与运行**
```bash
# 安装依赖（使用 Bun 的极速安装）
bun install

# 开发模式（Bun 的热更新速度更快）
bun run dev

# 生产构建
bun run build

# 预览生产包
bun run preview
```

---

### **关键配置说明**
1. **`--bun` 标志**：强制使用 Bun 的 JavaScript 核心（替代 V8）
2. **Bun 类型声明**：通过 `bun-types` 提供 API 智能提示
3. **模块规范**：使用 `"type": "module"` 强制 ESM 规范
4. **文件监听**：Bun 需要 `usePolling: true` 来保证文件监听可靠性
5. **构建目标**：`esnext` 可充分利用 Bun 的现代 JS 支持

---

### **Bun 特性使用示例**
```typescript
// 使用 Bun 的快速文件读写 API
const pkg = await Bun.file('package.json').json()
console.log(`Project name: ${pkg.name}`)

// 使用 Bun 的原生 SQLite 支持
import { Database } from 'bun:sqlite'
const db = new Database('mydb.sqlite')
```

---

### **注意事项**
1. 如果遇到 Node.js 模块兼容性问题：
   ```bash
   # 尝试用 Bun 的兼容模式安装
   bun install --backend clonefile
   ```

2. 需要定期更新 Bun：
   ```bash
   bun upgrade
   ```

3. 调试时可使用 Bun 的调试模式：
   ```bash
   bun --inspect run dev
   ```

这个配置示例展示了如何在保留 Vue3 + Vite 工作流的同时，充分利用 Bun 的现代特性和性能优势。实际开发中 95% 的 Node.js 代码可以直接运行，针对特定优化场景再使用 Bun 原生 API。