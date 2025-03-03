// .vitepress/config/zh.ts
import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'

export const enUS = defineConfig({
    lang: 'en-US',
    description: '文档描述',
    themeConfig: {
        // 配置首页头部导航菜单，参考 https://vitepress.dev/zh/reference/default-theme-nav
        nav: [
            {text: 'Guide', link: '/pages/en-US/guide/index', activeMatch: '/pages/en-US/guide/'},
            {text: 'Reference', link: '/pages/en-US/reference/index', activeMatch: '/pages/en-US/reference/'},
            {text: 'Frontend', link: '/frontend/'},
            {
                text: 'Backend',
                items: [
                    {text: 'Spring', link: '/spring/'},
                    {text: 'SpringMVC', link: '/springmvc/'},
                    {text: 'SpringBoot', link: '/springboot/'}
                ]
            },
            {
                text: 'Database',
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
                        text: 'Changelog',
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
                    text: 'Introduction',
                    collapsed: false,
                    items: [
                        {text: '什么是 VitePress？', link: '/pages/zh-CN/guide/'},
                        {text: '快速开始', link: '/pages/zh-CN/guide/page-one'},
                        {text: '路由', link: '/pages/zh-CN/guide/page-two'}
                    ]
                },
                {
                    text: 'Writing',
                    collapsed: false,
                    items: [
                        {text: '什么是 VitePress？', link: '/guide/'},
                        {text: '快速开始', link: '/guide/page-one'},
                        {text: '路由', link: '/guide/page-two'}
                    ]
                },
                {
                    text: 'Customization',
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
                {text: 'Site Config',  link: '/pages/zh-CN/reference/'},
                {text: 'Frontmatter Config',  link: '/pages/zh-CN/reference/reference-one'},
                {text: 'Runtime API',  link: '/pages/zh-CN/reference/reference-two'},
                {
                    text: 'Reference',
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
            message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
            copyright: 'Copyright © 2019-present <a href="https://github.com/yyx990803">Evan You</a>'
        },

        outline: {
            label: "On this page"
        },
        editLink: {
            pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },
        lastUpdated: {
            text: "Last updated"
        },
        docFooter: {
            prev: "Previous page",
            next: "Next page"
        },
    },
})
