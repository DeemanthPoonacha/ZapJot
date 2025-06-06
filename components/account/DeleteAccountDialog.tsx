import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/context/AuthProvider";
import { toast } from "../ui/sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { deleteAccount } from "@/lib/services/auth";
import { initAnalytics } from "@/lib/services/firebase/analytics";
import { logEvent } from "firebase/analytics";

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

const DeleteAccountDialog = ({ open, onClose }: DeleteAccountDialogProps) => {
  const { user } = useAuth();
  const email = user?.email || "";
  const isPasswordProvider = user?.providerData[0]?.providerId === "password";

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const deletePrompt =
    "Are you sure you want to delete your account? This will permanently delete your account and remove your data from our servers. This action cannot be undone.";

  const reset = () => {
    setPassword("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setIsLoading(true);
      const data = isPasswordProvider ? { email, password } : undefined;
      await deleteAccount(data);

      const analytics = await initAnalytics();

      if (analytics) {
        logEvent(analytics, "delete_account", {
          method: isPasswordProvider ? "password" : "other",
        });
        console.log("Logged event for account deletion.");
      }

      toast.success("Account deleted successfully!");
      reset();
    } catch (e: unknown) {
      const err = e as { code: string; message: string };
      console.error("Account deletion failed:", err);
      if (err.code === "auth/wrong-password") setError("Incorrect password!");
      else if (err.code === "auth/too-many-requests")
        setError("Something went wrong. Please try again later.");
      else {
        setError(err.message);
      }
      toast.error("Error deleting account!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Account</DialogTitle>
        </DialogHeader>
        <p>{deletePrompt}</p>

        <div className="space-y-4">
          {isPasswordProvider && (
            <>
              <div>
                To confirm, please enter your password for{" "}
                <strong>{email}</strong>.
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                {error && (
                  <p className="text-destructive text-sm absolute">{error}</p>
                )}
              </div>
            </>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={reset} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isLoading || (isPasswordProvider && !password)}
            >
              <Trash2 />
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
