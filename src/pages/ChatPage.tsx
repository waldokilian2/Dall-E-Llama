import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Chat from "@/components/Chat";
import { showError } from "@/utils/toast";

const ChatPage = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const { workflowId } = useParams<{ workflowId: string }>();
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string | null>(null);

  useEffect(() => {
    setPageLoaded(true); // Set pageLoaded to true after the component mounts
    if (workflowId) {
      try {
        // Decode the workflowId which is the full URL
        const decodedWorkflowId = decodeURIComponent(workflowId);
        setN8nWebhookUrl(decodedWorkflowId);
      } catch (error) {
        console.error("Error decoding workflowId:", error);
        showError("Invalid workflow URL provided.");
        setN8nWebhookUrl(null); // Invalidate URL if decoding fails
      }
    } else {
      showError("No AI agent selected. Please go back and select one.");
      setN8nWebhookUrl(null);
    }
  }, [workflowId]);

  if (!n8nWebhookUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading or invalid workflow selected. Please return to the <a href="/" className="text-blue-500 hover:underline">workflow selection page</a>.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${pageLoaded ? 'animate-blob' : ''}`}></div>
        <div className={`absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${pageLoaded ? 'animate-blob animation-delay-2000' : ''}`}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${pageLoaded ? 'animate-blob animation-delay-4000' : ''}`}></div>
      </div>
      {/* Main chat container with glass effect */}
      <div className="relative z-10 w-full max-w-3xl h-[90vh] rounded-xl overflow-hidden backdrop-filter backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        <Chat n8nWebhookUrl={n8nWebhookUrl} />
      </div>
    </div>
  );
};

export default ChatPage;