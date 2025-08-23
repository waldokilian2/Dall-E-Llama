import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown
import { Button } from "@/components/ui/button"; // Import Button component
import { Copy } from "lucide-react"; // Import Copy icon
import { useToast } from "@/hooks/use-toast"; // Import useToast hook

interface MessageProps {
  sender: "user" | "ai";
  text: string;
}

const Message: React.FC<MessageProps> = ({ sender, text }) => {
  const isUser = sender === "user";
  const { toast } = useToast();

  const messageClasses = isUser
    ? "bg-blue-600/50 text-white rounded-br-none ml-auto"
    : "bg-gray-700/30 text-foreground rounded-bl-none mr-auto";

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Message copied to clipboard.",
      });
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Error",
        description: "Failed to copy message.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[70%] p-3 rounded-lg shadow-md border ${
          isUser ? "border-blue-500/50" : "border-gray-600/50"
        } ${messageClasses}`}
      >
        <div className="prose prose-invert max-w-none"> {/* Apply prose styles here */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} className="text-purple-400 hover:underline break-words" target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
        {!isUser && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Copy message"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Message;