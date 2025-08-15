import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, Settings, Paperclip, XCircle } from "lucide-react";
import Message from "./Message";
import { showError } from "@/utils/toast";
import { ThemeToggle } from "./ThemeToggle";
import SettingsDialog from "./SettingsDialog";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

// Default N8N Webhook URL
const DEFAULT_N8N_WEBHOOK_URL = "http://localhost:5678/webhook/86a50552-8058-4896-bd7e-ab95eba073ce/chat";
const DEFAULT_FILE_UPLOAD_ENABLED = false;
const DEFAULT_RESPONSE_TIMEOUT_SECONDS = 120; // 2 minutes

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>(
    localStorage.getItem("n8nWebhookUrl") || DEFAULT_N8N_WEBHOOK_URL
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [fileUploadEnabled, setFileUploadEnabled] = useState<boolean>(
    localStorage.getItem("fileUploadEnabled") === "true" || DEFAULT_FILE_UPLOAD_ENABLED
  );
  const [responseTimeoutSeconds, setResponseTimeoutSeconds] = useState<number>(
    parseInt(localStorage.getItem("responseTimeoutSeconds") || String(DEFAULT_RESPONSE_TIMEOUT_SECONDS), 10)
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSaveSettings = (newUrl: string, newFileUploadEnabled: boolean, newResponseTimeout: number) => {
    setN8nWebhookUrl(newUrl);
    localStorage.setItem("n8nWebhookUrl", newUrl);
    setFileUploadEnabled(newFileUploadEnabled);
    localStorage.setItem("fileUploadEnabled", String(newFileUploadEnabled));
    setResponseTimeoutSeconds(newResponseTimeout);
    localStorage.setItem("responseTimeoutSeconds", String(newResponseTimeout));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ["text/plain", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        showError("Unsupported file type. Please upload .txt, .pdf, .doc, or .docx files.");
        setSelectedFile(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" && !selectedFile) return;

    const userMessageText = input.trim();
    let fileContent: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    let fileType: string | undefined = undefined;

    if (selectedFile) {
      fileName = selectedFile.name;
      fileType = selectedFile.type;

      if (selectedFile.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          fileContent = e.target?.result as string;
          await sendPayload(userMessageText, fileContent, fileName, fileType);
        };
        reader.onerror = () => {
          showError("Failed to read text file.");
          setIsLoading(false);
        };
        reader.readAsText(selectedFile);
        return;
      } else {
        showError(`Note: For ${fileType} files, only the file name will be sent. Full content parsing is typically done server-side.`);
      }
    }

    await sendPayload(userMessageText, fileContent, fileName, fileType);
  };

  const sendPayload = async (chatInput: string, fileContent?: string, fileName?: string, fileType?: string) => {
    const userMessage: ChatMessage = {
      sender: "user",
      text: chatInput + (fileName ? ` (Attached: ${fileName})` : ""),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), responseTimeoutSeconds * 1000); // Convert seconds to milliseconds

    try {
      const payload: any = {
        sessionId: sessionId,
        action: "sendMessage",
        chatInput: chatInput,
      };

      if (fileName) {
        payload.file = {
          name: fileName,
          type: fileType,
          content: fileContent,
        };
      }

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal, // Attach the abort signal
      });

      clearTimeout(timeoutId); // Clear the timeout if the fetch completes

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Webhook response data:", data);

      const aiMessage: ChatMessage = { sender: "ai", text: data?.output || "No response from AI." };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error: any) {
      clearTimeout(timeoutId); // Ensure timeout is cleared even on error
      if (error.name === 'AbortError') {
        console.error("Request timed out:", error);
        showError(`Request timed out after ${responseTimeoutSeconds} seconds. Please try again or increase the timeout in settings.`);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "ai", text: "Sorry, the request timed out." },
        ]);
      } else {
        console.error("Error sending message:", error);
        showError("Failed to get a response from the AI agent. Please try again.");
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "ai", text: "Sorry, I couldn't connect to the AI agent." },
        ]);
      }
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
        {fileUploadEnabled && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.pdf,.doc,.docx"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
          </>
        )}
        <div className="flex-1 relative">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="w-full bg-white/10 text-foreground border-white/20 placeholder:text-muted-foreground focus-visible:ring-offset-transparent focus-visible:ring-purple-500 pr-10"
          />
          {selectedFile && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-sm text-muted-foreground bg-background/50 rounded-full px-2 py-1">
              <span>{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          )}
        </div>
        <Button onClick={handleSendMessage} disabled={isLoading || (input.trim() === "" && !selectedFile)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        currentUrl={n8nWebhookUrl}
        currentFileUploadEnabled={fileUploadEnabled}
        currentResponseTimeout={responseTimeoutSeconds}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default Chat;