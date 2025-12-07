import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { api } from "../api";
import { toast } from "sonner";

interface CreatePollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPollCreated?: () => void;
}

export function CreatePollDialog({ open, onOpenChange, onPollCreated }: CreatePollDialogProps) {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowSeeResults, setAllowSeeResults] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredOptions = options.filter(opt => opt.trim() !== "");

    if (filteredOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }

    setIsLoading(true);
    try {
      await api.createPoll({
        title: title,
        opt1: filteredOptions[0],
        opt2: filteredOptions[1],
        opt3: filteredOptions[2] || null,
        opt4: filteredOptions[3] || null,
      });

      toast.success("Poll created successfully!");

      // Reset form
      setTitle("");
      setOptions(["", ""]);
      setAllowSeeResults(true);
      onOpenChange(false);

      // Notify parent to refresh polls list
      onPollCreated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create poll";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new poll</DialogTitle>
          <DialogDescription>
            Ask a question and provide 2-4 options for people to vote on
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreatePoll} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Question</Label>
            <Input
              id="title"
              type="text"
              placeholder="What's your question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {options.map((option, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`option${index}`}>Option {index + 1}</Label>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Input
                id={`option${index}`}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                required
              />
            </div>
          ))}

          {options.length < 4 && (
            <button
              type="button"
              onClick={addOption}
              className="w-full px-4 py-2 rounded-lg border border-dashed border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          )}

          {/*
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowSeeResults"
              checked={allowSeeResults}
              onCheckedChange={(checked) => setAllowSeeResults(checked as boolean)}
            />
            <Label htmlFor="allowSeeResults">Allow users to peek results</Label>
          </div>
          */}

          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4" style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              "Post"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}