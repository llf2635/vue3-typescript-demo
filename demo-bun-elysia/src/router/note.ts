import { Elysia, t } from 'elysia'

// 实体类
class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    // 实体类新增方法
    add(note: string) {
        this.data.push(note)
        return this.data
    }

    // 实体类删除方法
    remove(index: number) {
        return this.data.splice(index, 1)
    }

    // 实体类更新方法
    update(index: number, note: string) {
        return (this.data[index] = note)
    }
}

// Elysia 插件，参考 https://elysiajs.com/tutorial.html#plugin
// 如果我们将所有的路由处理程序都放在一个文件中，那么我们的主实例将变得非常臃肿。
// 我们可以将路由处理程序移动到一个单独的文件中，并将其作为插件导入。创建名为 note.ts 的新文件，并添加以下内容：
export const note = new Elysia({ prefix: '/note' })  // 为所有路由添加共同前缀，参考 https://elysiajs.com/tutorial.html#group
    // decorate 允许我们将单例类注入到 Elysia 实例中，从而允许我们在路由处理程序中访问它。相当于全局注册
    .decorate('note', new Note())
    // 为所有路由在访问时都需要加上 prefix: '/note' 配置的 note 统一前缀
    // 访问 http://localhost:3000/note
    .get('/', ({ note }) => note.data)
    // 路径参数，我们可以通过在 path 参数前加上冒号来定义它。访问 http://localhost:3000/note/0
    .get(
        '/:index',
        // 使用 params 参数获取路径参数
        // 定制响应状态代码。参考 https://elysiajs.com/tutorial.html#status-code
        // 默认情况下，Elysia 将为所有路由返回状态代码 200，即使响应是错误。
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        // Validation 数据校验，参考 https://elysiajs.com/tutorial.html#validation 。Elysia 为以下属性提供验证：
        // params - 路径参数
        // query - URL 查询字符串
        // body - 请求体
        // headers - 请求标头
        // cookie - cookie
        // response - 响应 body
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    // 新增数据，访问 http://localhost:3000/note/insert
    .post(
        '/insert',
        ({ note, body: { data } }) => note.add(data),
        {
            body: t.Object({
                data: t.String()
            })
        }
    )
    // 更新数据，访问 http://localhost:3000/note/update/0
    .put(
        '/update/:index',
        ({ note, params: { index }, body: { data }, error }) => {
            if (index in note.data) return note.update(index, data)
            return error(422)
        },
        {
            params: t.Object({
                index: t.Number()
            }),
            body: t.Object({
                data: t.String()
            })
        }
    )
    // 删除数据，访问 http://localhost:3000/note/delete/0
    .delete(
        '/delete/:index',
        ({ note, params: { index }, error }) => {
            if (index in note.data) return note.remove(index)
            return error(422)
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .patch(
        '/note/:index',
        ({ note, params: { index }, body: { data }, error }) => {
            if (index in note.data) return note.update(index, data)
            return error(422)
        },
        {
            params: t.Object({
                index: t.Number()
            }),
            body: t.Object({
                data: t.String()
            })
        }
    )

// 每个插件都是 Elysia 的一个独立实例，它有自己的路由、中间件和装饰器，可以应用于其他实例。
