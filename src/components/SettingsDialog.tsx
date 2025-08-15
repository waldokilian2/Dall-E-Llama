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

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUrl: string;
  onSave: (newUrl: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  currentUrl,
  onSave,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const { toast } = useToast();

  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl, open]); // Sync input with currentUrl when dialog opens

  const handleSave = () => {
    if (urlInput.trim() === "") {
      toast({
        title: "Error",
        description: "N8N Webhook URL cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    onSave(urlInput);
    onOpenChange(false);
    toast({
      title: "Success",
      description: "N8N Webhook URL saved successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your N8N Webhook URL here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="n8n-url" className="text-right">
              N8N URL
            </Label>
            <Input
              id="n8n-url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
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

export default SettingsDialog;