"use client";
import { useState } from "react";
import { useNProgressRouter } from "../layout/link/CustomLink";
import { deleteAccount, logOut } from "@/lib/services/auth";
import { Button } from "../ui/button";
import { LogOut, Trash2 } from "lucide-react";
import DeleteConfirm from "../ui/delete-confirm";

const AccountActions = () => {
  const SIGN_IN_ROUTE = "/sign-in";

  const { routerPush } = useNProgressRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logOut();
      routerPush(SIGN_IN_ROUTE);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteAccount();
      routerPush(SIGN_IN_ROUTE);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button variant="outline" onClick={handleLogout}>
        <LogOut />
        <span>{isLoading ? "Logging out..." : "Log out"}</span>
      </Button>
      <DeleteConfirm
        handleDelete={handleDeleteAccount}
        itemName="account"
        trigger={
          <Button variant="outline" className="text-destructive">
            <Trash2 />
            <span>{isLoading ? "Deleting..." : "Delete account"}</span>
          </Button>
        }
        description="Are you sure you want to delete your account? This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      />
    </div>
  );
};

export default AccountActions;
