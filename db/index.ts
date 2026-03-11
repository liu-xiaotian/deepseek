import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chatsTable, messagesTable } from "./schema";
import { and, desc, eq } from "drizzle-orm";

// const db = drizzle("postgres-js", process.env.DATABASE_URL);
//在 drizzle-orm 的最新版本中，drizzle 函数的用法已经更新。
// 如果你使用的是 postgres-js 驱动，不能直接把字符串 "postgres-js" 传给 drizzle 函数。

// 1. 创建底层连接查询器
const queryClient = postgres(process.env.DATABASE_URL!);

// 2. 初始化 Drizzle 实例 (直接传入 client)
const db = drizzle(queryClient);

// chats
export const createChat = async (
  userId: string,
  title: string,
  model: string,
) => {
  try {
    const [newChat] = await db
      .insert(chatsTable)
      .values({
        title,
        userId,
        model,
      })
      .returning();
    return newChat;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const getChat = async (chatId: number, userId: string) => {
  try {
    const chat = await db
      .select()
      .from(chatsTable)
      .where(and(eq(chatsTable.userId, userId), eq(chatsTable.id, chatId)));
    if (chat.length === 0) {
      return null;
    }
    return chat[0];
  } catch (error) {
    console.error("Error getting chat:", error);
    return null;
  }
};
export const getChats = async (userId: string) => {
  try {
    const chats = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.userId, userId))
      .orderBy(desc(chatsTable.id));
    return chats;
  } catch (error) {
    console.error("Error getting chats:", error);
    return null;
  }
};

//message
export const createMessage = async (
  chat_id: number,
  content: string,
  role: string,
) => {
  try {
    const [newMessage] = await db
      .insert(messagesTable)
      .values({
        chatId: chat_id,
        role,
        content,
      })
      .returning();
    return newMessage;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

export const getMessageByChatId = async (chat_id: number) => {
  try {
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.chatId, chat_id));
    return messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    return null;
  }
};
