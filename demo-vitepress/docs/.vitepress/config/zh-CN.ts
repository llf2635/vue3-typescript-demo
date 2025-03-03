// .vitepress/config/zh.ts
import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'

export const zhCN = defineConfig({
    lang: 'zh-CN',
    description: '文档描述',
    themeConfig: {
        editLink: {
            pattern: '',
            text: '在 GitHub 上编辑此页面',
        },
        nav: [
            { text: '顶部导航', link: '/zh/01/01', activeMatch: '/zh/01/' },
            { text: '顶部导航', link: '/zh/02/01', activeMatch: '/zh/02/' },
            {
                text: `v${pkg.version}`,
                items: [
                    {
                        text: 'Changelog',
                        link: '',
                    },
                ],
            },
        ],
        sidebar: [
            {
                text: '侧面导航',
                collapsed: false,
                items: [
                    { text: '标题', link: '/zh/01/01' },
                    { text: '标题', link: '/zh/01/02' },
                ],
            },
            {
                text: '侧面导航',
                collapsed: false,
                items: [
                    { text: '标题', link: '/zh/02/01' },
                ],
            },
        ],
        footer: {
            message: '基于 MIT 许可证发布。',
            copyright: '版权 © 2024-present Kieran Wang',
        },
    },
})
