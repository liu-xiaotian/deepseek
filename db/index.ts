import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function main() {
  // const db = drizzle("postgres-js", process.env.DATABASE_URL);
  //在 drizzle-orm 的最新版本中，drizzle 函数的用法已经更新。
  // 如果你使用的是 postgres-js 驱动，不能直接把字符串 "postgres-js" 传给 drizzle 函数。

  // 1. 创建底层连接查询器
  const queryClient = postgres(process.env.DATABASE_URL!);

  // 2. 初始化 Drizzle 实例 (直接传入 client)
  const db = drizzle(queryClient);
}

main();
