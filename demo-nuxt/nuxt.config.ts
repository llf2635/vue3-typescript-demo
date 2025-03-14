import { defineNuxtConfig } from 'nuxt/config'

import gsap from "gsap";

// nuxt 配置参考 https://nuxt.zhcndoc.com/docs/getting-started/configuration#nuxt-配置
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  // 项目基础路径（部署到子路径时使用）
  app: {
    baseURL: '/my-app/',
    buildAssetsDir: '/_nuxt/', // 静态资源路径
    // 全局页面头信息（SEO 和元标签）
    // 参考 https://nuxt.zhcndoc.com/docs/getting-started/seo-meta
    head: {
      title: 'Nuxt3 Demo',
      meta: [
        { name: 'description', content: 'Nuxt3 Demo' },
        { name: 'keywords', content: 'Nuxt3 Demo' },
        { name: 'author', content: 'Nuxt3 Demo' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    // 页面切换动画
    // 参考 https://nuxt.zhcndoc.com/docs/getting-started/transitions
    pageTransition: {
      // 如果您更改了 name 属性，则还必须相应地重命名 CSS 类。
      name: 'page', // 自定义动画名称，还需要在添加 .page-enter-active 和 .page-leave-active 两个类名
      mode: 'out-in', // 默认
      type: "animation",
      css: false,
    },
    // 布局切换动画
    layoutTransition: {
      name: 'layout',  // 自定义动画名称，需要在添加 .layout-enter-active 和 .layout-leave-active 两个类名
      mode: 'out-in', // 默认
    },

  },
  devServer: {
    port: 3000,  // 自定义端口
    host: 'localhost' // 允许外部访问
  },
  components: [
    // 自动导入 components/ 目录下的组件
    { path: '~/components', pathPrefix: false }
  ],
  // modules: [
  //   '@nuxtjs/tailwindcss', // 集成 Tailwind CSS
  //   '@pinia/nuxt',         // 状态管理 Pinia
  //   '@nuxtjs/i18n'         // 国际化
  // ],
  vite: {

  }
})
