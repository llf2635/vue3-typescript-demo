// .vitepress/config/index.ts
import { defineConfig } from 'vitepress'
import { shared } from './shared'
import { enUS } from './en-US'
import { zhCN } from './zh-CN'

export default defineConfig({
    ...shared,
    locales: {
        root: { label: '中文', ...zhCN },
        english: { label: 'English', ...enUS },
    },
})
