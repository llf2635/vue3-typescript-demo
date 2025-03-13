// 用于暴露可以在构建时确定的公共变量。 与 runtimeConfig 选项相反，这些变量不能通过环境变量覆盖。
// 配置参考 https://nuxt.zhcndoc.com/docs/getting-started/configuration#应用程序配置
export default defineAppConfig({
    title: 'Hello Nuxt',
    theme: {
        dark: true,
        colors: {
            primary: '#ff0000'
        }
    }
})
