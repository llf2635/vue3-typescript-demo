// 用于数据库连接相关配置
import { Database } from "bun:sqlite";

// 没有使用 ORM ，直接使用 Bun 内置的原生 SQL
const db = new Database(":memory:");
const query = db.query("select 'Hello world' as message;");
query.get(); // => { message: "Hello world" }