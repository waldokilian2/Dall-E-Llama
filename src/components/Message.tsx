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
          "max-w-[70%] p-3 rounded-lg shadow-lg", // Increased shadow for more depth
          "backdrop-filter backdrop-blur-lg bg-opacity-20", // Glass effect
          sender === "user"
            ? "bg-purple-600/30 text-foreground rounded-br-none border border-purple-500/50" // User message: purple-ish glass, theme-aware text
            : "bg-gray-700/30 text-foreground rounded-bl-none border border-gray-600/50", // AI message: neutral glass, theme-aware text
        )}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;