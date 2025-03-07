import { Elysia, t } from 'elysia'
import {userService} from "./userService";

// Resolve，参考 https://elysiajs.com/tutorial.html#resolve
// 我们的最后一个目标是从令牌中获取用户名 （id）。我们可以使用 resolve 将新属性定义到与 store 相同的上下文中，但只能按请求执行它。
// 与 decorate 和 store 不同，resolve 是在 beforeHandle 阶段定义的，或者该值在验证后可用。
export const getUserId = new Elysia()
    .use(userService)
    .guard({
        isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))
    // Scope https://elysiajs.com/tutorial.html#scope-1
    .as("plugin")

// Authentication 认证，参考 https://elysiajs.com/tutorial.html#authentication
// 现在我们可能想要为我们的路由添加限制，这样只有 note 的所有者才能更新或删除它。
// 我们创建一个 user.ts 文件来处理用户身份验证，并使用 /sign-up 和 /sign-in 路由来处理用户注册和登录。
export const user = new Elysia({ prefix: '/user' })
    .use(getUserId)
    // 在 /sign-up 中，我们插入一个用户名和带有 argon2id 的哈希密码
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })
            store.user[username] = await Bun.password.hash(password)
            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: "signIn"
        }
    )
    // 在 /sign-in 中，检查用户是否存在并验证密码，如果成功，如果密码匹配，那么我们在 session 中生成一个新的 session
    // 并设置 cookie token 的值为 session。我们在 cookie 中附加 secret 来添加哈希值并阻止攻击者篡改 cookie
    .post(
        '/sign-in',
        async ({
                   store: { user, session },
                   error,
                   body: { username, password },
                   cookie: { token }
               }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: "signIn",
            cookie: "session"
        }
    )
    // 在 /sign-out 中，我们删除 cookie token 并从 session 中删除用户
    .get(
        '/sign-out',
        ({ cookie: { token } }) => {
            token.remove()
            return {
                success: true,
                message: 'Signed out'
            }
        },
        {
            cookie: 'optionalSession'
        }
    )
    // 在 /profile 中，我们检查 cookie token 是否存在，如果存在，我们检查 session 中是否存在该用户
    .get(
        '/profile',
        ({ cookie: { token }, store: { session }, error }) => {
            const username = session[token.value]
            return {
                success: true,
                username
            }
        },
        {
            isSignIn: true,  // 要使用自定义 isSignIn 宏，只需指定 isSignIn： true，
            cookie: 'session',
        }
    )