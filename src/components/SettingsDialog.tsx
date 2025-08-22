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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFileUploadEnabled: boolean;
  currentResponseTimeout: number;
  onSave: (newFileUploadEnabled: boolean, newResponseTimeout: number) => void; // Updated onSave signature
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  currentFileUploadEnabled,
  currentResponseTimeout,
  onSave,
}) => {
  const [fileUploadEnabled, setFileUploadEnabled] = useState(currentFileUploadEnabled);
  const [responseTimeoutInput, setResponseTimeoutInput] = useState(String(currentResponseTimeout));
  const { toast } = useToast();

  useEffect(() => {
    setFileUploadEnabled(currentFileUploadEnabled);
    setResponseTimeoutInput(String(currentResponseTimeout));
  }, [currentFileUploadEnabled, currentResponseTimeout, open]);

  const handleSave = () => {
    const parsedTimeout = parseInt(responseTimeoutInput, 10);
    if (isNaN(parsedTimeout) || parsedTimeout <= 0) {
      toast({
        title: "Error",
        description: "Response Timeout must be a positive number.",
        variant: "destructive",
      });
      return;
    }

    onSave(fileUploadEnabled, parsedTimeout);
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
            Configure your chat preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="response-timeout" className="text-right">
              Response Timeout (s)
            </Label>
            <Input
              id="response-timeout"
              type="number"
              value={responseTimeoutInput}
              onChange={(e) => setResponseTimeoutInput(e.target.value)}
              className="col-span-3 bg-input text-foreground border-border"
              min="1"
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