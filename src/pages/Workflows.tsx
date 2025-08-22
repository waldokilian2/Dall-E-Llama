import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { showError } from "@/utils/toast";

interface Workflow {
  id: string;
  name: string;
  description: string;
}

const N8N_WORKFLOWS_URL = "http://localhost:5678/webhook/workflows";

const Workflows: React.FC = () => {
  const navigate = useNavigate();

  const { data: workflows, isLoading, isError, error } = useQuery<Workflow[], Error>({
    queryKey: ["n8nWorkflows"],
    queryFn: async () => {
      const response = await fetch(N8N_WORKFLOWS_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.statusText}`);
      }
      
      // Read response as text first for debugging
      const responseText = await response.text();
      console.log("Raw N8N Workflows Response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON from N8N Workflows response:", parseError);
        throw new Error(`Failed to parse JSON from N8N Workflows response: ${parseError instanceof Error ? parseError.message : String(parseError)}. Raw response: ${responseText.substring(0, 200)}...`);
      }

      // If the API returns a single object, wrap it in an array
      if (!Array.isArray(result)) {
        console.warn("API did not return an array for workflows, received a single object. Wrapping it in an array.", result);
        return [result]; 
      }
      return result;
    },
    // Refetch every 5 minutes to keep the list updated
    staleTime: 5 * 60 * 1000, 
  });

  React.useEffect(() => {
    if (isError) {
      showError(`Error loading workflows: ${error?.message || "Unknown error"}`);
    }
  }, [isError, error]);

  const handleSelectWorkflow = (workflowId: string) => {
    navigate(`/chat/${encodeURIComponent(workflowId)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-6 rounded-xl overflow-hidden backdrop-filter backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Dall-E Llama
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
          Select an AI Agent to Chat With
        </h2>

        {isLoading && (
          <div className="flex items-center justify-center text-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Loading workflows...
          </div>
        )}

        {isError && (
          <div className="text-red-500 text-center">
            Failed to load AI agents. Please check the N8N server and URL ({N8N_WORKFLOWS_URL}).
            <p className="text-sm text-red-400 mt-2">{error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && (!Array.isArray(workflows) || workflows.length === 0) && (
          <div className="text-muted-foreground text-center">
            No AI agents found. Please ensure your N8N server is running and has workflows exposed.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {Array.isArray(workflows) && workflows.map((workflow) => (
            <Card key={workflow.id} className="bg-white/20 border border-white/30 text-foreground shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-300">{workflow.name}</CardTitle>
                {/* Removed CardDescription displaying workflow.id */}
              </CardHeader>
              <CardContent>
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
    </div>
  );
};

export default Workflows;