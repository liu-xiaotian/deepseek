import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: process.env.DEEPSEEK_BASE_URL ?? "",
});
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: "You are a helpful assistant.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
