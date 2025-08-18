import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown

interface MessageProps {
  sender: "user" | "ai";
  text: string;
}

const Message: React.FC<MessageProps> = ({ sender, text }) => {
  const isUser = sender === "user";
  const messageClasses = isUser
    ? "bg-blue-600/50 text-white rounded-br-none ml-auto"
    : "bg-gray-700/30 text-foreground rounded-bl-none mr-auto";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg shadow-md border ${
          isUser ? "border-blue-500/50" : "border-gray-600/50"
        } ${messageClasses}`}
      >
        <div className="prose prose-invert max-w-none"> {/* Apply prose styles here */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;