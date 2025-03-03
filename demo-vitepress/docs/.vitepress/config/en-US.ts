// .vitepress/config/zh.ts
import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'

export const enUS = defineConfig({
    lang: 'zh-CN',
    description: '文档描述',
    themeConfig: {
        editLink: {
            pattern: '',
            text: '在 GitHub 上编辑此页面',
        },
        // 配置首页头部导航菜单，参考 https://vitepress.dev/zh/reference/default-theme-nav
        nav: [
            {text: 'Guide', link: '/guide/'},
            {text: 'Examples', link: '/markdown-examples'},
            {text: 'Frontend', link: '/frontend/'},
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
            {text: 'friendChains', link: 'https://github.com/llf2635'},
        ],

        // 配置侧边栏，参考 https://vitepress.dev/zh/reference/default-theme-sidebar
        // 不是所有页面都需要侧边栏，以下指定页面会出现侧边栏，其他页面则没有
        sidebar: {
            // 当用户位于 `guide` 目录时，会显示此侧边栏
            '/guide/': [
                {
                    text: 'Guide',
                    collapsed: true,
                    items: [
                        {text: '什么是 VitePress？', link: '/pages/en-US/guide/'},
                        {text: '快速开始', link: '/pages/en-US/guide/page-one'},
                        {text: '路由', link: '/pages/en-US/guide/page-two'}
                    ]
                }
            ],
            // 当用户位于 `frontend` 目录时，会显示此侧边栏
            '/frontend/': [
                {
                    text: 'Frontend',
                    collapsed: true,
                    items: [
                        {text: 'Index', link: '/config/'},
                        {text: 'Three', link: '/config/three'},
                        {text: 'Four', link: '/config/four'}
                    ]
                }
            ],
            // 当用户位于 `backend` 目录时，会显示此侧边栏
            '/backend/': [
                {
                    text: 'Backend',
                    collapsed: true,
                    items: [
                        {text: 'Index', link: '/config/'},
                        {text: 'Three', link: '/config/three'},
                        {text: 'Four', link: '/config/four'}
                    ]
                }
            ],
            // 当用户位于 `database` 目录时，会显示此侧边栏
            '/database/': [
                {
                    text: 'Database',
                    collapsed: true,
                    items: [
                        {text: 'Index', link: '/config/'},
                        {text: 'Three', link: '/config/three'},
                        {text: 'Four', link: '/config/four'}
                    ]
                }
            ]
        },
        footer: {
            message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
            copyright: 'Copyright © 2019-present <a href="https://github.com/yyx990803">Evan You</a>'
        },
    },
})
