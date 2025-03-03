// .vitepress/config/shared.ts
import { defineConfig } from 'vitepress'

// 站点共享配置
// https://vitepress.dev/zh/reference/site-config
export const shared = defineConfig({
    // 配置站点元数据  https://vitepress.dev/zh/reference/site-config#site-metadata

    // 站点标题
    title: 'VitePress',
    // 重写规则
    // rewrites: {
    //     'pages/en-US/guide': 'en-US/guide',
    //     'pages/zh-CN/reference': 'zh-CN/reference'
    // },
    // 最后更新时间
    lastUpdated: true,
    // 清理链接
    cleanUrls: true,
    // 元数据分块
    metaChunk: true,
    // 头部信息
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'en' }],
        ['meta', { property: 'og:title', content: '文档标题' }],
        ['meta', { property: 'og:site_name', content: '文档标题' }],
        ['meta', { property: 'og:image', content: '/logo.png' }],
    ],
    // 主题配置
    // https://vitepress.dev/zh/reference/default-theme-config
    themeConfig: {
        // 站点logo
        logo: '/vite.svg',
        // 配置页头社交链接，参考 https://vitepress.dev/zh/reference/default-theme-config#sociallinks
        socialLinks: [
            {icon: 'github', link: 'https://github.com/llf2635?tab=repositories'},
            {icon: 'youtube', link: 'https://gitee.com/llf2635'},
            {icon: 'twitter', link: 'https://gitee.com/llf2635'},
            {
                icon: {
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-githu  b" width="24" height="24"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>`,
                },
                link: 'https://gitee.com/llf2635'
            }
        ],
        // 搜索
        search: {
            provider: 'local',
        },

        lastUpdated: {
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'medium'
            },
        },
    },
    // markdown主题
    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark',
        },
    },
})
