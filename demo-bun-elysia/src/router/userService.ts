import { Elysia, t } from 'elysia'

// 插件去重，参考 https://elysiajs.com/tutorial.html#plugin-deduplication
// 由于我们要在多个模块（user 和 note）中重用这个钩子 (state 和 model)，让我们提取 service（实用程序）部分并将其应用于两个模块
// 这里的 name 属性非常重要，因为它是插件的唯一标识符，用于防止重复实例（如单例）。
export const userService = new Elysia({ name: 'user/service' })
    // 共享状态，参考 https://elysiajs.com/tutorial.html#state
    // 在该实例中，我们定义了一个内存存储用户和会话
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    // 参考模型，参考 https://elysiajs.com/tutorial.html#reference-model
    // 我们可以使用参考模型通过指定名称来重用模型，而不是到处复制粘贴模型。
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    // 宏，参考 https://elysiajs.com/tutorial.html#macro
    // Macro 允许我们定义一个具有自定义生命周期管理的自定义钩子。
    // 我们刚刚创建了一个新的宏名称 isSignIn，它接受一个布尔值，如果它是 true，那么我们添加一个 onBeforeHandle 事件，
    // 要使用宏，只需指定 isSignIn： true，
    // 该事件在验证之后但在主处理程序之前执行，允许我们在此处提取身份验证逻辑。
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
                beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

// 如果我们要定义没有插件的实例，那么每次使用插件时都会注册 hook/lifecycle 和 routes。
// 我们的目的是将这个插件（服务）应用到多个模块上，以提供实用功能，这使得去重非常重要，因为生命周期不应该注册两次。
// 例如，如果我们在 user 和 note 模块中都使用 userService，那么 userService 将注册两次生命周期钩子。
// 通过将 userService 作为插件注册到 Elysia 实例中，我们可以确保它只注册一次。 请注意，我们使用 name 属性来确保插件名称是唯一的。









