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
import { Switch } from "@/components/ui/switch"; // Import Switch
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUrl: string;
  currentFileUploadEnabled: boolean; // New prop for file upload state
  onSave: (newUrl: string, newFileUploadEnabled: boolean) => void; // Updated onSave signature
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  currentUrl,
  currentFileUploadEnabled,
  onSave,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [fileUploadEnabled, setFileUploadEnabled] = useState(currentFileUploadEnabled); // State for toggle
  const { toast } = useToast();

  useEffect(() => {
    setUrlInput(currentUrl);
    setFileUploadEnabled(currentFileUploadEnabled);
  }, [currentUrl, currentFileUploadEnabled, open]); // Sync input and toggle with props when dialog opens

  const handleSave = () => {
    if (urlInput.trim() === "") {
      toast({
        title: "Error",
        description: "N8N Webhook URL cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    onSave(urlInput, fileUploadEnabled); // Pass both settings
    onOpenChange(false);
    toast({
      title: "Success",
      description: "Settings saved successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your N8N Webhook URL and other preferences.
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-upload-toggle" className="text-right">
              Enable File Upload
            </Label>
            <Switch
              id="file-upload-toggle"
              checked={fileUploadEnabled}
              onCheckedChange={setFileUploadEnabled}
              className="col-span-3"
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