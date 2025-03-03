// .vitepress/config/index.ts
import { defineConfig } from 'vitepress'
import { shared } from './shared'
import { enUS } from './en-US'
import { zhCN } from './zh-CN'

export default defineConfig({
    ...shared,
    locales: {
        root: { label: '简体中文', ...zhCN },
        en: { label: 'English', ...enUS },
    },
})
