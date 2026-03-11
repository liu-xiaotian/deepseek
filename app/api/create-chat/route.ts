import { createChat } from "@/db";
import { auth } from "@clerk/nextjs/server";

// 定义一个 POST 接口处理函数（Next.js API Route / Route Handler）
export async function POST(req: Request) {
  try {
    // 从请求体中解析 JSON 数据
    // 前端会发送类似：
    // { title: "聊天标题", model: "gpt-4" }
    const { title, model } = await req.json();

    // 获取当前登录用户信息（通常来自认证系统，例如 Clerk / Auth）
    // 返回对象里包含 userId
    const { userId } = await auth();
    console.log(111);

    console.log(userId);

    // 判断用户是否已经登录
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    // 调用数据库函数创建一条新的聊天记录
    // 参数：
    // userId -> 当前用户
    // title  -> 聊天标题
    // model  -> 使用的 AI 模型
    const newChat = await createChat(userId, title, model);

    // 返回 HTTP 响应
    // 将创建好的 chat id 返回给前端
    // 前端可以根据 id 跳转到聊天页面
    return new Response(
      JSON.stringify({ id: newChat?.id }), // 返回数据
      { status: 200 }, // HTTP 状态码 200 表示成功
    );
  } catch (err) {
    console.error("Create chat failed:", err); // 打印错误到终端
    return new Response("Internal Server Error", { status: 500 });
  }
}
