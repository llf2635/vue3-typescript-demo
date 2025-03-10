// query 关系查询，参考 https://drizzle.zhcndoc.com/docs/rqb
// 关系查询旨在为您提供出色的开发者体验， 以便从 SQL 数据库中查询嵌套的关系数据，避免多个连接和复杂的数据映射。
// 关系查询是 Drizzle 原始 查询构建器 的一个扩展。
// 您需要在 drizzle() 初始化时提供来自您的模式文件/文件的所有 tables 和 relations ， 然后只需使用 db.query API。
import {drizzle} from "drizzle-orm/bun-sql";
import * as schema from './schema';

// @ts-ignore
const db = drizzle({ schema });


const result = await db.query.users.findMany({
    with: {
        posts: true
    },
});

[{
    id: 10,
    name: "Dan",
    posts: [
        {
            id: 1,
            content: "SQL 是很棒的",
            authorId: 10,
        },
        {
            id: 2,
            content: "但请检查关系查询",
            authorId: 10,
        }
    ]
}]

//
const posts = await db.query.posts.findMany({
    with: {
        comments: true,
    },
});


const post = await db.query.posts.findFirst({
    with: {
        comments: true,
    },
});
