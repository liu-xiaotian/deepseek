import { getChats } from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chats = await getChats(userId);

    return new Response(JSON.stringify(chats), { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/chats:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
