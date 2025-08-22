import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Workflows from "./pages/Workflows";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import { ThemeToggle } from "./components/ThemeToggle"; // Import ThemeToggle

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* ThemeToggle positioned globally */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Routes>
          <Route path="/" element={<Workflows />} />
          <Route path="/chat/:workflowId" element={<ChatPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;