import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showError } from "@/utils/toast";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface SuggestedAction {
  label: string;
  value: string;
}

const DEFAULT_N8N_CHAT_URL = "http://localhost:5678/webhook/chat";

const Chat: React.FC = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [currentSuggestedActions, setCurrentSuggestedActions] = useState<SuggestedAction[]>([]);
  const [n8nChatUrl, setN8nChatUrl] = useState<string>(
    localStorage.getItem("n8nChatUrl") || DEFAULT_N8N_CHAT_URL
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New state to track if chat has started
  const [hasChatStarted, setHasChatStarted] = useState<boolean>(false);

  const { data: initialSuggestedActions, isLoading: isLoadingInitialActions } = useQuery<SuggestedAction[], Error>({
    queryKey: ["initialSuggestedActions", workflowId, n8nChatUrl],
    queryFn: async () => {
      const response = await fetch(`${n8nChatUrl}?workflowId=${workflowId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch initial suggested actions: ${response.statusText}`);
      }
      const data = await response.json();
      return data.suggestedActions || [];
    },
    enabled: !hasChatStarted, // Only fetch initial actions if chat hasn't started
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    if (!hasChatStarted) {
      if (initialSuggestedActions && initialSuggestedActions.length > 0) {
        setCurrentSuggestedActions(initialSuggestedActions);
      } else {
        // If no initial actions are returned, but chat hasn't started, show default "What can you do?"
        setCurrentSuggestedActions([{ label: "What can you do?", value: "What can you do?" }]);
      }
    }
  }, [initialSuggestedActions, hasChatStarted]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageMutation = useMutation<any, Error, string>({
    mutationFn: async (messageText: string) => {
      const response = await fetch(n8nChatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflowId,
          message: messageText,
          chatHistory: messages.map((msg) => ({ role: msg.sender === "user" ? "user" : "assistant", content: msg.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      return response.json();
    },
    onMutate: (messageText) => {
      // Add user message to state immediately
      const newUserMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newUserMessage]);
      setInputMessage("");
      setCurrentSuggestedActions([]); // Clear suggested actions when user sends a message
      setHasChatStarted(true); // Mark chat as started
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.response || "No response from AI.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setCurrentSuggestedActions(data.suggestedActions || []); // Update suggested actions from AI response
    },
    onError: (error) => {
      showError(`Error sending message: ${error.message}`);
      // Optionally, remove the last user message if sending failed
      setMessages((prev) => prev.slice(0, prev.length - 1));
    },
  });

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessageMutation.mutate(inputMessage.trim());
    }
  };

  const handleChipClick = (action: SuggestedAction) => {
    sendMessageMutation.mutate(action.value);
    setHasChatStarted(true); // Mark chat as started when a chip is clicked
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shadow-sm bg-card">
        <h1 className="text-xl font-semibold">Chat with {decodeURIComponent(workflowId || "AI Agent")}</h1>
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close Chat</span>
        </Button>
      </div>

      {/* Chat Messages Area */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="AI Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <Card
                className={`p-3 max-w-[70%] ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted rounded-bl-none"
                }`}
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={coldarkDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.text}
                </Markdown>
              </Card>
              {message.sender === "user" && (
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User Avatar" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Suggested Actions and Input */}
      <div className="p-4 border-t border-border bg-card">
        {currentSuggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 max-w-3xl mx-auto">
            {currentSuggestedActions.map((action, index) => (
              <Badge
                key={index}
                className="cursor-pointer text-foreground text-base px-4 py-2 rounded-full shadow-lg backdrop-filter backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors duration-200"
                onClick={() => handleChipClick(action)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {action.label}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            placeholder="Type your message..."
            className="flex-1 bg-muted focus-visible:ring-purple-500"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendMessageMutation.isPending}
          />
          <Button onClick={handleSendMessage} disabled={sendMessageMutation.isPending}>
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;