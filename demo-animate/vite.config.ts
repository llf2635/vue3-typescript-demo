import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        // 配置 PostCSS 选项
        postcss: {
            plugins: [
                // cssnano 压缩
                cssnano({}),
                // 配置 PostCSS 插件，包括 autoprefixer 和 cssnano。
                // autoprefixer 用于自动添加浏览器前缀，cssnano 用于压缩 CSS。
                // autoprefixer 插件的配置选项为 browserslist 配置，默认为 last 2 versions。
                // cssnano 插件的配置选项为 preset 配置，默认为 default。
                // postcss-preset-env 插件内包含 autoprefixer ，因此无需再额外添加该依赖，参考 https://www.npmjs.com/package/postcss-preset-env
                postcssPresetEnv({
                    /* 使用 Stage 3 特性 + CSS 嵌套规则 */
                    stage: 3,
                    features: {
                        "nesting-rules": true,
                    },
                    // 自动添加浏览器前缀
                    autoprefixer: {},
                }),
                // 参考 https://tailwind.nodejs.cn/docs/optimizing-for-production
                // ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
            ],
        },
    }
})