import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, Settings } from "lucide-react"; // Added Settings icon
import Message from "./Message";
import { showError } from "@/utils/toast";
import { ThemeToggle } from "./ThemeToggle";
import SettingsDialog from "./SettingsDialog"; // Import the new component

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

// Default N8N Webhook URL
const DEFAULT_N8N_WEBHOOK_URL = "http://localhost:5678/webhook/86a50552-8058-4896-bd7e-ab95eba073ce/chat";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>(
    localStorage.getItem("n8nWebhookUrl") || DEFAULT_N8N_WEBHOOK_URL
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate a simple session ID once per component mount
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSaveN8nUrl = (newUrl: string) => {
    setN8nWebhookUrl(newUrl);
    localStorage.setItem("n8nWebhookUrl", newUrl);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: ChatMessage = { sender: "user", text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const payload = {
        sessionId: sessionId,
        action: "sendMessage",
        chatInput: userMessage.text,
      };

      const response = await fetch(n8nWebhookUrl, { // Use the state variable here
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Webhook response data:", data);

      const aiMessage: ChatMessage = { sender: "ai", text: data?.output || "No response from AI." };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      showError("Failed to get a response from the AI agent. Please try again.");
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: "Sorry, I couldn't connect to the AI agent." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10 bg-transparent rounded-t-xl relative">
        {/* Centered Title and Icon */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
          <Brain className="h-10 w-10 text-purple-400" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Dall-E Llama
          </h1>
        </div>
        {/* Right-aligned controls */}
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Settings</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full w-full pr-4">
          <div className="flex flex-col space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-10">
                Start a conversation with your AI agent!
              </div>
            )}
            {messages.map((msg, index) => (
              <Message key={index} sender={msg.sender} text={msg.text} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-3 rounded-lg shadow-md bg-gray-700/30 text-foreground rounded-bl-none animate-pulse border border-gray-600/50">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-transparent flex items-center space-x-2 rounded-b-xl">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 bg-white/10 text-foreground border-white/20 placeholder:text-muted-foreground focus-visible:ring-offset-transparent focus-visible:ring-purple-500"
        />
        <Button onClick={handleSendMessage} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        currentUrl={n8nWebhookUrl}
        onSave={handleSaveN8nUrl}
      />
    </div>
  );
};

export default Chat;