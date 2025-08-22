import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface WorkflowSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentN8nWorkflowsUrl: string;
  onSave: (newUrl: string) => void;
}

const WorkflowSettingsDialog: React.FC<WorkflowSettingsDialogProps> = ({
  open,
  onOpenChange,
  currentN8nWorkflowsUrl,
  onSave,
}) => {
  const [n8nWorkflowsUrlInput, setN8nWorkflowsUrlInput] = useState(currentN8nWorkflowsUrl);
  const { toast } = useToast();

  useEffect(() => {
    setN8nWorkflowsUrlInput(currentN8nWorkflowsUrl);
  }, [currentN8nWorkflowsUrl, open]);

  const handleSave = () => {
    if (!n8nWorkflowsUrlInput.trim()) {
      toast({
        title: "Error",
        description: "N8N Workflows URL cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    // Basic URL validation
    try {
      new URL(n8nWorkflowsUrlInput);
    } catch (e) {
      toast({
        title: "Error",
        description: "Please enter a valid URL for N8N Workflows.",
        variant: "destructive",
      });
      return;
    }

    onSave(n8nWorkflowsUrlInput);
    onOpenChange(false);
    toast({
      title: "Success",
      description: "N8N Workflows URL saved successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle>N8N Workflow Settings</DialogTitle>
          <DialogDescription>
            Configure the URL for fetching N8N AI agents.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="n8n-url" className="text-right">
              N8N URL
            </Label>
            <Input
              id="n8n-url"
              type="url"
              value={n8nWorkflowsUrlInput}
              onChange={(e) => setN8nWorkflowsUrlInput(e.target.value)}
              className="col-span-3 bg-input text-foreground border-border"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowSettingsDialog;