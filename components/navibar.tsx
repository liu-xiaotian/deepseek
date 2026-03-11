"use client";
import { ChatModel } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

const Navibar = () => {
  const { user } = useUser();
  const router = useRouter();

  // 使用 React Query 的 useQuery 来获取聊天列表
  const { data: chats } = useQuery({
    // queryKey 是缓存标识，React Query 会用它来缓存数据和刷新
    queryKey: ["chats"],

    // queryFn 定义获取数据的函数
    // 这里是向后端接口发送请求，获取用户的聊天记录
    queryFn: async () => {
      const response = await axios.post("/api/get-chats"); // POST 请求，返回聊天数据
      console.log("API 响应:", response.data); // 添加日志
      return response.data; // 直接返回数据
    },

    // enabled 控制是否执行查询
    // 当 user.id 存在时才执行，否则不会发送请求
    enabled: !!user?.id,
  });
  const pathname = usePathname();
  return (
    <div className="h-screen bg-gray-50">
      <div className="flex items-center justify-center">
        <p className="font-bold text-2xl">Deepseek</p>
      </div>

      <div
        className="h-10 flex items-center justify-center mt-4 cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        <p className="h-full w-2/3 bg-blue-100 rounded-lg flex items-center justify-center font-thin">
          创建新会话
        </p>
      </div>

      {/* 目录 */}
      <div className="flex flex-col items-center justify-center gap-2 p-6 ">
        {chats?.map((chat: ChatModel) => (
          <div
            className="w-full h-10"
            key={chat.id}
            onClick={() => {
              router.push(`/chat/${chat.id}`);
            }}
          >
            <p
              className={`font-extralight text-sm line-clamp-1 ${pathname === `/chat/${chat.id}` ? "text-blue-700" : ""} `}
            >
              {chat?.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navibar;
