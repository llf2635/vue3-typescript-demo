// columns.helpers.ts
import {timestamp} from "drizzle-orm/pg-core";

// 我们可以在一个单独的文件中定义这些每个数据表都有的公共列，然后将它们导入并扩展到您拥有的所有表对象中
export const commonColumns = {
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
}
