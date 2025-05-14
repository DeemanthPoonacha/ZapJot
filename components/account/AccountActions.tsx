"use client";
import { useState } from "react";
import { useNProgressRouter } from "../layout/link/CustomLink";
import { logOut } from "@/lib/services/auth";
import { Button } from "../ui/button";
import { LogOut, Trash2 } from "lucide-react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import { toast } from "../ui/sonner";
import { Separator } from "../ui/separator";

const AccountActions = () => {
  const SIGN_IN_ROUTE = "/sign-in";

  const { routerPush } = useNProgressRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logOut();
      routerPush(SIGN_IN_ROUTE);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between rounded-lg transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <div className="text-base font-semibold">Logout</div>
            <div className="text-sm">Sign out of your account.</div>
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
            <LogOut />
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between rounded-lg transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <div className="text-base font-semibold text-destructive">
              Delete Account
            </div>
            <div className="text-sm">
              Permanently delete your account. This action cannot be undone.
            </div>
          </div>
        </div>
        <div>
          <Button
            variant="outline"
            className="text-destructive border-destructive"
            onClick={() => setIsOpen(true)}
            disabled={isLoading}
          >
            <Trash2 /> Delete account
          </Button>
        </div>
      </div>
      <DeleteAccountDialog open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default AccountActions;
