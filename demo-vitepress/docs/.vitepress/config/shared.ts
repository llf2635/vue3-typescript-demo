// .vitepress/config/shared.ts
import { defineConfig } from 'vitepress'

export const shared = defineConfig({
    title: '文档标题',
    rewrites: {
        'en/:rest*': ':rest*',
    },
    lastUpdated: true,
    cleanUrls: true,
    metaChunk: true,
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'en' }],
        ['meta', { property: 'og:title', content: '文档标题' }],
        ['meta', { property: 'og:site_name', content: '文档标题' }],
        ['meta', { property: 'og:image', content: '/logo.png' }],
    ],
    themeConfig: {
        logo: '/logo.png',
        socialLinks: [
            { icon: 'github', link: 'https://github.com/kieranwv' },
        ],
        search: {
            provider: 'local',
        },
    },
    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark',
        },
    },
})
