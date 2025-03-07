// 用于数据库连接相关配置
import { Database } from "bun:sqlite";

// 没有使用 ORM ，直接使用 Bun 内置的原生 SQL
// 参考 Bun 的 SQLite 章节 https://bun.net.cn/docs/api/sqlite
// 打开内存数据库
const db = new Database(":memory:");
const query = db.query("select 'Hello world' as message;");
query.get(); // => { message: "Hello world" }


import { drizzle } from 'drizzle-orm/bun-sqlite';
// import { Database } from 'bun:sqlite';

function bunSqlite() {
    // 1. 打开数据库
    const sqlite = new Database('sqlite.db');
    const db = drizzle({ client: sqlite });
    // 2. 执行 SQL 语句
    db.query("select 'Hello world' as message;");
    // 3. 获取结果
    const result = db.query("select 'Hello world' as message;").get();
    // 4. 关闭数据库
    db.close();
    // 5. 输出结果
    console.log(result.message); // => "Hello world"


    const result = db.select().from(users).all();
    const result = db.select().from(users).get();
    const result = db.select().from(users).values();
    const result = db.select().from(users).run();

}

// 数据查询，https://orm.drizzle.team/docs/rqb