import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import { api } from "../api";
import { toast } from "sonner";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
}

export function LoginDialog({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset to login page when dialog opens
  useEffect(() => {
    if (open) {
      setIsSignUp(false);
    }
  }, [open]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      toast.success("Logged in successfully!");

      // console.log("WE JUST LOGGED IN BABY", res);
      onLoginSuccess();
      onOpenChange(false);
    } catch (error) {
      // console.log("LOGIN ERROR", error);
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.signUp({ email, password });
      toast.success("Account created successfully!");
      onLoginSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create an account" : "Welcome back"}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Sign up to create and vote on polls"
              : "Sign in to your account to create and vote on polls"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4" style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              isSignUp ? "Sign up" : "Log in"
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-4">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-sm text-foreground hover:underline cursor-pointer"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-sm text-foreground hover:underline cursor-pointer"
              >
                Sign up!
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}