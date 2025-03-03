import { defineConfig } from 'vitepress'

// 站点配置文件
// https://vitepress.dev/zh/reference/site-config
export default defineConfig({
  // 配置站点元数据  https://vitepress.dev/zh/reference/site-config#site-metadata
  title: "龙茶清欢",
  description: "vitepress测试",

  // 站点主题
  themeConfig: {
    // https://vitepress.dev/zh/reference/default-theme-config

    // 站点图标
    logo: '/public/vite.svg',
    // 导航栏中的自定义站点标题
    siteTitle: '龙茶清欢666',

    // 搜索配置,参考 https://vitepress.dev/zh/reference/default-theme-search
    search: {
      provider: 'local'
    },

    // 配置首页头部导航菜单，参考 https://vitepress.dev/zh/reference/default-theme-nav
    nav: [
      {text: '参考', link: '/guide/'},
      {text: '示例', link: '/markdown-examples'},
      {text: '前端', link: '/frontend/'},
      {
        text: '后端',
        items: [
          {text: 'Spring', link: '/spring/'},
          {text: 'SpringMVC', link: '/springmvc/'},
          {text: 'SpringBoot', link: '/springboot/'}
        ]
      },
      {text: '指南', link: '/guide/'},
      {
        text: '组件',
        items: [
          {
            text: 'Vue',
            items: [
              {text: 'Markdown Examples', link: '/markdown-examples'},
              {text: 'Runtime API Examples', link: '/api-examples'}
            ]
          },
          {
            text: 'TypeScript',
            items: [
              {text: 'Markdown Examples', link: '/markdown-examples'},
              {text: 'Runtime API Examples', link: '/api-examples'}
            ]
          }
        ]
      },
      {text: 'Github', link: 'https://github.com/llf2635'},
      {text: 'Gitee', link: 'https://gitee.com/llf2635'}
    ],

    // 配置侧边栏，参考 https://vitepress.dev/zh/reference/default-theme-sidebar
    // 不是所有页面都需要侧边栏，以下指定页面会出现侧边栏，其他页面则没有
    sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      '/guide/': [
        {
          text: '简介',
          collapsed: true,
          items: [
            {text: '什么是 VitePress？', link: '/guide/'},
            {text: '快速开始', link: '/guide/page-one'},
            {text: '路由', link: '/guide/page-two'}
          ]
        },
        {
          text: '写作',
          collapsed: true,
          items: [
            {text: '什么是 VitePress？', link: '/guide/'},
            {text: '快速开始', link: '/guide/page-one'},
            {text: '路由', link: '/guide/page-two'}
          ]
        },
        {
          text: '自定义',
          collapsed: true,
          items: [
            {text: '什么是 VitePress？', link: '/guide/'},
            {text: '快速开始', link: '/guide/page-one'},
            {text: '路由', link: '/guide/page-two'}
          ]
        },
      ],

      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/config/': [
        {
          text: 'Config',
          collapsed: true,
          items: [
            {text: 'Index', link: '/config/'},
            {text: 'Three', link: '/config/three'},
            {text: 'Four', link: '/config/four'}
          ]
        }
      ]
    },

    // 配置页头社交链接
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

    // 页脚配置，参考 https://vitepress.dev/zh/reference/default-theme-footer
    footer: {
      message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2019-present <a href="https://github.com/yyx990803">Evan You</a>'
    },

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    lastUpdated: {
      text: "最后更新",
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      },
    }

  }
})
