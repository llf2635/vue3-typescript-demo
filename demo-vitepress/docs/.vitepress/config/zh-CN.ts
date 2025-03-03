// .vitepress/config/zh.ts
import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'

export const zhCN = defineConfig({
    lang: 'zh-CN',
    description: '文档描述',
    themeConfig: {
        // 配置首页头部导航菜单，参考 https://vitepress.dev/zh/reference/default-theme-nav
        nav: [
            {text: '指南', link: '/guide/what-is-vitepress'},
            {text: '参考', link: '/reference/site-config',},
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
        // 特别注意，由于 默认 root 中文国际化是不带任何前缀的，因此必须在 shared.ts 中，重写路径去掉 /zh 前缀，所以这里也不需要加 /zh
        sidebar: {
            // 当用户位于 `guide` 目录时，会显示此侧边栏
            '/guide/': [
                {
                    text: '简介',
                    collapsed: false,
                    items: [
                        {text: '什么是 VitePress？', link: '/guide/what-is-vitepress'},
                        {text: '快速开始', link: '/guide/getting-started'},
                        {text: '路由', link: '/zh/guide/routing'}
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
            '/reference/': [
                {text: '站点配置',  link: '/reference/site-config'},
                {text: 'frontmatter 配置',  link: '/reference/frontmatter-config'},
                {text: '运行时 API',  link: '/reference/runtime-api'},
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
