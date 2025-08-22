import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Loader2, Search, Settings } from "lucide-react";
import { showError } from "@/utils/toast";
import WorkflowSettingsDialog from "@/components/WorkflowSettingsDialog";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle

interface Workflow {
  id: string;
  name: string;
  description: string;
}

const DEFAULT_N8N_WORKFLOWS_URL = "http://localhost:5678/webhook/workflows";

const Workflows: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isWorkflowSettingsOpen, setIsWorkflowSettingsOpen] = useState<boolean>(false);
  const [n8nWorkflowsUrl, setN8nWorkflowsUrl] = useState<string>(
    localStorage.getItem("n8nWorkflowsUrl") || DEFAULT_N8N_WORKFLOWS_URL
  );

  const { data: workflows, isLoading, isError, error } = useQuery<Workflow[], Error>({
    queryKey: ["n8nWorkflows", n8nWorkflowsUrl],
    queryFn: async () => {
      const response = await fetch(n8nWorkflowsUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (!Array.isArray(result)) {
        console.warn("API did not return an array for workflows, received a single object. Wrapping it in an array.", result);
        return [result]; 
      }
      return result;
    },
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (isError) {
      showError(`Error loading workflows: ${error?.message || "Unknown error"}`);
    }
  }, [isError, error]);

  const handleSelectWorkflow = (workflowId: string) => {
    navigate(`/chat/${encodeURIComponent(workflowId)}`);
  };

  const handleSaveWorkflowSettings = (newUrl: string) => {
    setN8nWorkflowsUrl(newUrl);
    localStorage.setItem("n8nWorkflowsUrl", newUrl);
    queryClient.invalidateQueries({ queryKey: ["n8nWorkflows"] });
  };

  const filteredWorkflows = workflows?.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-background">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-6 rounded-xl backdrop-filter backdrop-blur-xl bg-gray-200/50 dark:bg-white/10 border border-white/20 shadow-2xl flex flex-col items-center max-h-[90vh] overflow-y-auto mx-auto">
        {/* Header with Title and Settings Button */}
        <div className="flex justify-between items-center w-full mb-6">
          <div className="flex items-center space-x-2 mx-auto">
            <Brain className="h-12 w-12 text-purple-400" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Dall-E Llama
            </h1>
          </div>
          <div className="absolute right-6 top-6 flex items-center space-x-2"> {/* Group settings and theme toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsWorkflowSettingsOpen(true)} 
            >
              <Settings className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Settings</span>
            </Button>
            <ThemeToggle /> {/* Theme toggle */}
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
          Select an AI Agent to Chat With
        </h2>

        {/* Search Input Field */}
        <div className="relative w-full max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search agents by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/20 dark:bg-black/20 border border-white/30 rounded-md text-foreground placeholder:text-muted-foreground focus-visible:ring-purple-500"
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center text-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Loading workflows...
          </div>
        )}

        {isError && (
          <div className="text-red-500 text-center">
            Failed to load AI agents. Please check the N8N server and URL ({n8nWorkflowsUrl}).
            <p className="text-sm text-red-400 mt-2">{error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && filteredWorkflows.length === 0 && (
          <div className="text-muted-foreground text-center">
            No AI agents found matching your search.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="bg-white/50 dark:bg-black/30 border border-white/30 text-foreground shadow-lg flex flex-col">
              <CardHeader>
                <CardTitle className="text-purple-300">{workflow.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{workflow.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectWorkflow(workflow.id)} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Select Agent
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <WorkflowSettingsDialog
        open={isWorkflowSettingsOpen}
        onOpenChange={setIsWorkflowSettingsOpen}
        currentN8nWorkflowsUrl={n8nWorkflowsUrl}
        onSave={handleSaveWorkflowSettings}
      />
    </div>
  );
};

export default Workflows;