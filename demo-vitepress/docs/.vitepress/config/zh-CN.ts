// .vitepress/config/zh.ts
import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'

export const zhCN = defineConfig({
    lang: 'zh-CN',
    description: '文档描述',
    themeConfig: {
        // 配置首页头部导航菜单，参考 https://vitepress.dev/zh/reference/default-theme-nav
        nav: [
            {text: '指南', link: '/pages/zh-CN/guide/index', activeMatch: '/pages/zh-CN/guide/'},
            {text: '参考', link: '/pages/zh-CN/reference/index', activeMatch: '/pages/zh-CN/reference/'},
            {text: '前端', link: '/frontend/'},
            {
                text: '后端',
                items: [
                    {text: 'Spring', link: '/spring/'},
                    {text: 'SpringMVC', link: '/springmvc/'},
                    {text: 'SpringBoot', link: '/springboot/'}
                ]
            },
            {
                text: '数据库',
                items: [
                    {
                        text: 'MySQL',
                        items: [
                            {text: 'Markdown Examples', link: '/markdown-examples'},
                            {text: 'Runtime API Examples', link: '/api-examples'}
                        ]
                    },
                    {
                        text: 'PostgreSQL',
                        items: [
                            {text: 'Markdown Examples', link: '/markdown-examples'},
                            {text: 'Runtime API Examples', link: '/api-examples'}
                        ]
                    },
                    {
                        text: 'MongoDB',
                        items: [
                            {text: 'Markdown Examples', link: '/markdown-examples'},
                            {text: 'Runtime API Examples', link: '/api-examples'}
                        ]
                    },
                    {
                        text: 'Redis',
                        items: [
                            {text: 'Markdown Examples', link: '/markdown-examples'},
                            {text: 'Runtime API Examples', link: '/api-examples'}
                        ]
                    }
                ]
            },
            {
                text: `v${pkg.version}`,
                items: [
                    {
                        text: '更新日志',
                        link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md',
                    },
                ],
            }
        ],

        // 配置侧边栏，参考 https://vitepress.dev/zh/reference/default-theme-sidebar
        // 不是所有页面都需要侧边栏，以下指定页面会出现侧边栏，其他页面则没有
        sidebar: {
            // 当用户位于 `guide` 目录时，会显示此侧边栏
            '/pages/zh-CN/guide/': [
                {
                    text: '简介',
                    collapsed: false,
                    items: [
                        {text: '什么是 VitePress？', link: '/pages/zh-CN/guide/'},
                        {text: '快速开始', link: '/pages/zh-CN/guide/page-one'},
                        {text: '路由', link: '/pages/zh-CN/guide/page-two'}
                    ]
                },
                {
                    text: '写作',
                    collapsed: false,
                    items: [
                        {text: '什么是 VitePress？', link: '/guide/'},
                        {text: '快速开始', link: '/guide/page-one'},
                        {text: '路由', link: '/guide/page-two'}
                    ]
                },
                {
                    text: '自定义',
                    collapsed: false,
                    items: [
                        {text: '什么是 VitePress？', link: '/guide/'},
                        {text: '快速开始', link: '/guide/page-one'},
                        {text: '路由', link: '/guide/page-two'}
                    ]
                },
            ],

            // 当用户位于 `reference` 目录时，会显示此侧边栏
            '/pages/zh-CN/reference/': [
                {text: '站点配置',  link: '/pages/zh-CN/reference/'},
                {text: 'frontmatter 配置',  link: '/pages/zh-CN/reference/reference-one'},
                {text: '运行时 API',  link: '/pages/zh-CN/reference/reference-two'},
                {
                    text: '参考',
                    collapsed: false,
                    items: [
                        {text: 'Index', link: '/config/'},
                        {text: 'Three', link: '/config/three'},
                        {text: 'Four', link: '/config/four'}
                    ]
                }
            ],

        },

        footer: {
            message: '基于 MIT 许可证发布。',
            copyright: '版权 © 2024-present Kieran Wang',
        },

        outline: {
            label: "本页内容"
        },
        editLink: {
            pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页面'
        },
        lastUpdated: {
            text: "最后更新",
        },
        docFooter: {
            prev: "上一页",
            next: "下一页"
        },
    },
})
