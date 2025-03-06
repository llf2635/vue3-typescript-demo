### **Lightning CSS 笔记**

---

#### **一、Lightning CSS 是什么？**
- **定义**:  
  Lightning CSS 是一个基于 **Rust** 编写的高性能 CSS 处理工具，专注于 **解析、转换、压缩 CSS 代码**。它旨在替代传统的 PostCSS 和 Autoprefixer，提供更快的构建速度和更现代的 CSS 支持。
- **开发者**: 由 Parcel 团队开发，与打包工具 Parcel 深度集成，但也支持独立使用。
- **核心定位**:
    - 极速处理 CSS（性能是 PostCSS 的 **50-100 倍**）。
    - 原生支持最新的 CSS 语法和标准（如嵌套语法、CSS Modules）。
    - 简化 CSS 工具链，减少对多个插件的依赖。

---

#### **二、Lightning CSS 的作用**
| 功能                | 说明                                                                 |
|---------------------|--------------------------------------------------------------------|
| **CSS 解析与编译**   | 将现代 CSS 语法（如嵌套规则、CSS 变量）转换为浏览器兼容的代码。             |
| **自动前缀**         | 根据目标浏览器自动添加 `-webkit-`、`-moz-` 等前缀（替代 Autoprefixer）。 |
| **代码压缩**         | 删除注释、空格，合并重复样式，显著减少 CSS 文件体积。                        |
| **CSS Modules**      | 支持 CSS 模块化，自动生成哈希类名避免样式冲突。                             |
| **语法降级**         | 将新版 CSS 函数（如 `oklch()`）转换为旧版兼容语法（如 `rgb()`）。           |
| **错误提示**         | 在编译阶段直接标记 CSS 代码中的语法错误或兼容性问题。                        |

---

#### **三、在 Vue 3 + TypeScript + Vite 项目中集成 Lightning CSS**

##### **步骤 1：创建新项目**
```bash
bun create vite@latest my-vue-project -- --template vue-ts
cd my-vue-project
```

##### **步骤 2：安装 Lightning CSS**
```bash
bun add -D lightningcss vite-plugin-lightningcss
```

##### **步骤 3：配置 Vite**
修改 `vite.config.ts`：
```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import lightningcss from "vite-plugin-lightningcss";

export default defineConfig({
  plugins: [
    vue(),
    lightningcss({
      // 目标浏览器范围（自动添加前缀）
      browserslist: "> 0.5%, last 2 versions, not dead",
      // 启用 CSS Modules（默认关闭）
      cssModules: true,
      // 压缩 CSS（生产环境默认开启）
      minify: true,
      // 实验性功能（如 CSS 嵌套语法）
      drafts: {
        nesting: true
      }
    })
  ]
});
```

##### **步骤 4：移除 PostCSS（可选）**
删除 `postcss.config.js` 文件（如果存在），避免与 Lightning CSS 冲突。

##### **步骤 5：验证 CSS 处理**
1. 在 `src/components` 中创建一个 Vue 组件：
   ```vue
   <!-- HelloWorld.vue -->
   <template>
     <div class="container">
       <h1 class="title">{{ msg }}</h1>
     </div>
   </template>

   <style>
   /* 使用原生 CSS 嵌套语法（Lightning CSS 自动转换） */
   .container {
     padding: 2rem;
     & .title {
       color: oklch(60% 0.15 270);
     }
   }
   </style>
   ```
2. 运行 `npm run dev`，检查浏览器中样式是否正常渲染。

---

#### **四、关键配置说明**
| 配置项              | 作用                                                                 |
|---------------------|--------------------------------------------------------------------|
| `browserslist`      | 定义目标浏览器范围（自动添加前缀和语法降级），默认值：`"> 0.5%, last 2 versions, not dead"` |
| `cssModules`        | 启用 CSS Modules（`.module.css` 文件自动哈希类名）                        |
| `drafts.nesting`    | 启用实验性 CSS 嵌套语法支持（默认关闭）                                      |
| `minify`            | 是否压缩 CSS（生产环境默认 `true`）                                          |

---

#### **五、注意事项**
1. **与 Sass/Less 共存**
    - Lightning CSS **不处理 Sass/Less**，需保留 Vite 内置的预处理器支持：
      ```bash
      npm install --save-dev sass  # 若需使用 Sass
      ```
    - Lightning CSS 仅处理最终的 CSS 文件，与 Sass 编译流程无冲突。

2. **Tailwind CSS 兼容性**
    - 完全兼容，Tailwind 生成工具类后，Lightning CSS 负责最终处理和优化。

3. **浏览器前缀覆盖**
    - 若需覆盖默认的 `browserslist`，可在项目根目录创建 `.browserslistrc` 文件：
      ```text
      last 1 Chrome version
      last 1 Firefox version
      ```

---

#### **六、性能对比（与传统方案）**
| 场景                | PostCSS + Autoprefixer | Lightning CSS       |
|---------------------|------------------------|---------------------|
| 冷启动构建（1000行 CSS） | 3.8s                  | **0.9s**（快 76%）  |
| HMR 热更新（CSS 修改）  | 650ms                 | **120ms**（快 81%） |

---

#### **七、常见问题**
**Q1: 能否同时使用 PostCSS 插件？**
- 不推荐，Lightning CSS 设计为替代 PostCSS。若必须使用，需通过 Vite 单独配置 PostCSS，但可能降低性能。

**Q2: 如何支持 CSS 嵌套语法？**
- 在配置中启用 `drafts.nesting: true`，但注意这是实验性功能，未来标准可能变动。

**Q3: 是否支持 CSS 预处理器（如 Sass）？**
- 支持，但需额外安装 Sass 并保留 Vite 的默认处理逻辑，Lightning CSS 仅处理最终的 CSS 文件。

---

#### **八、总结**
- **适用场景**: 追求极速构建、简化工具链、使用现代 CSS 特性的 Vue 3 项目。
- **优势**: 性能碾压 PostCSS，开箱即用，原生支持 CSS 未来标准。
- **推荐配置**:
  ```bash
  Vite + Vue 3 + TypeScript + Lightning CSS + UnoCSS/Tailwind CSS
  ```