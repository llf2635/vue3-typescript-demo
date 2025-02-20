import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetWebFonts,
    presetWind3,
    transformerDirectives,
    transformerVariantGroup
} from 'unocss'

// 自定义配置内容参考 https://unocss.net/guide/config-file
// unocss 存在一些约定的默认配置，通常情况下，无需过多配置，但可以自定义。
export default defineConfig({
    // ...UnoCSS options

    // 自定义主题，参考 https://unocss.net/config/theme
    theme: {
        colors: {
            // ...
        }
    },
    // 配置预设，参考 https://unocss.net/presets/uno
    presets: [
        presetWind3(),
        presetAttributify(),
        presetIcons(),
        presetTypography(),
        // 参考 https://unocss.net/presets/web-fonts
        presetWebFonts({
            // 默认是 google 提供商，当网络不好改用 fontshare 官网 https://www.fontshare.com/
            // provider: 'fontshare',
            provider: 'google',
            // 这些将扩展默认主题
            fonts: {
                sans: 'Roboto',
                mono: ['Fira Code', 'Fira Mono:400,700']
            }
        })
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()]
})