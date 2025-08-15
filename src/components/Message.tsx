import React from "react";
import { cn } from "@/lib/utils";

interface MessageProps {
  sender: "user" | "ai";
  text: string;
}

const Message: React.FC<MessageProps> = ({ sender, text }) => {
  return (
    <div
      className={cn(
        "flex w-full mb-2",
        sender === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[70%] p-3 rounded-lg shadow-md",
          sender === "user"
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-100",
        )}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;