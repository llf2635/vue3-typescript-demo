**前端 Biome 是什么？**

Biome 是一个新兴的前端工具链，专注于替代 ESLint 和 Prettier，提供**代码格式化（Formatting）**和**代码检查（Linting）**功能。它的核心优势在于：
- 使用 Rust 编写，性能极高（比 Prettier/ESLint 快 5-50 倍）
- 零配置开箱即用
- 统一格式化与 Linting 工作流
- 原生支持现代 JavaScript/TypeScript/JSX/TSX

---

**Biome 的作用**
1. **代码格式化**：替代 Prettier，支持自动格式化代码（如缩进、引号、分号等）。
2. **代码检查**：替代 ESLint，检查潜在错误、代码风格问题。
3. **性能优化**：极快的执行速度，适合大型项目。
4. **简化工具链**：减少项目对 ESLint + Prettier 组合的依赖。

---

**在 Vue 3 + TypeScript + Vite 项目中使用 Biome**

### 步骤 1：安装 Biome
```bash
npm install --save-dev @biomejs/biome
# 或
pnpm add -D @biomejs/biome
# 或
yarn add -D @biomejs/biome
```

### 步骤 2：初始化配置
```bash
npx @biomejs/biome init
```
这会生成 `biome.json` 配置文件，根据需求调整：
```json
{
  "$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  }
}
```

### 步骤 3：配置 Vue 支持
Biome 默认支持 Vue 单文件组件（SFC），无需额外配置。确保 `biome.json` 包含：
```json
{
  "files": {
    "include": ["**/*.vue"]
  }
}
```

### 步骤 4：集成到 Vite
安装 Vite 插件：
```bash
npm install --save-dev @biomejs/vite
```
在 `vite.config.ts` 中添加：
```typescript
import { defineConfig } from 'vite'
import biomePlugin from '@biomejs/vite'

export default defineConfig({
  plugins: [
    biomePlugin({
      mode: 'check', // 或 'fix' 自动修复问题
      files: ['src/**/*.{js,ts,vue}']
    })
  ]
})
```

### 步骤 5：添加脚本命令
在 `package.json` 中添加：
```json
{
  "scripts": {
    "lint": "biome check ./src",
    "format": "biome format --write ./src"
  }
}
```

### 步骤 6：VS Code 集成（可选）
1. 安装 [Biome VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
2. 配置 VS Code 设置（`.vscode/settings.json`）：
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "biome.linterDisabled": false
}
```

---

**常见问题解决**
1. **忽略文件/规则**：在 `biome.json` 中添加 `"ignore"` 字段或使用 `// biome-ignore` 注释。
2. **与 ESLint 共存**：建议逐步迁移，可先禁用 ESLint。
3. **自定义规则**：通过 `biome.json` 的 `linter.rules` 配置。

---

**优势总结**
- 🚀 超快速度：Rust 实现带来极速体验
- 🧩 简化配置：告别 `.eslintrc` + `.prettierrc` 的繁琐
- ⚡ 开箱即用：默认规则适合大多数项目
- 🌈 现代语法：完美支持 Vue 3 + TypeScript

通过上述步骤，Biome 可以无缝替代 ESLint + Prettier，显著提升 Vue 3 项目的开发体验。