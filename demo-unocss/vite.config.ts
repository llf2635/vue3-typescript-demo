import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import cssnano from 'cssnano'
import postcssPresetEnv from 'postcss-preset-env'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // 配置参考 https://unocss.net/integrations/vite
        UnoCSS()
    ],
    css: {
        // 配置 PostCSS 选项，采用内嵌配置的方式，无需创建 postcss.config.js 两者效果相同
        // Vite 配置 PostCSS 官方说明 https://cn.vite.dev/config/shared-options.html#css-postcss
        // PostCSS 官方文档 https://github.com/postcss/postcss
        postcss: {
            // 配置 PostCSS 插件，包括 postcss-preset-env 和 cssnano。
            // autoprefixer 用于自动添加浏览器前缀，cssnano 用于压缩 CSS。
            plugins: [
                // cssnano 插件的配置选项为 preset 配置，默认为 default。
                // cssnano 压缩，参考 https://cssnano.github.io/cssnano/
                cssnano({
                    preset: 'default',
                }),

                // postcss-preset-env 插件配置参考 https://www.npmjs.com/package/postcss-preset-env
                // postcss-preset-env 插件内包含 autoprefixer ，因此无需再额外添加该依赖
                // 原文来自 https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#autoprefixer
                postcssPresetEnv({
                    /* 使用 Stage 3 特性 + CSS 嵌套规则 */
                    stage: 3,
                    features: {
                        "nesting-rules": true,
                    },
                    // 自动添加浏览器前缀
                    autoprefixer: {
                        grid: true,
                    },
                    // 浏览器支持
                    browsers: [
                        'last 2 versions',
                        'Firefox ESR',
                        '> 1%',
                        'ie >= 8',
                        'iOS >= 8',
                        'Android >= 4',
                    ],
                }),
                // 参考 https://tailwind.nodejs.cn/docs/optimizing-for-production
                // ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
            ],
        },
    },
    // 配置构建选项
    build: {
        // 配置 css 代码压缩
        cssMinify: 'lightningcss',
        // 配置 js 代码压缩
        minify: 'esbuild',
        // 配置 js 代码压缩
        // minify: 'terser',
        // 配置 js 代码压缩
        // minify: 'chalk',
    }

})
