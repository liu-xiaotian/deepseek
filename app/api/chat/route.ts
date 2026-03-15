import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { auth } from "@clerk/nextjs/server";
import { createMessage } from "@/db";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: process.env.DEEPSEEK_BASE_URL ?? "",
});
export async function POST(req: Request) {
  const { messages, model, chat_id, chat_user_id } = await req.json();

  const { userId } = await auth();
  if (!userId || userId !== chat_user_id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // 存入用户消息
  const lastMessage = messages[messages.length - 1];
  await createMessage(chat_id, lastMessage.content, lastMessage.role);

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: "You are a helpful assistant.",
    messages,
    onFinish: async (result) => {
      // 存入助手消息
      await createMessage(chat_id, result.text, "assistant");
    },
  });

  return result.toUIMessageStreamResponse();
}
