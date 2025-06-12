"use client";

import { useState } from "react";
import { Link, useNProgressRouter } from "@/components/layout/link/CustomLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/context/AuthProvider";
import { logOut } from "@/lib/services/auth";
import { Button } from "../ui/button";

export default function UserAvatarDropdown() {
  const { user } = useAuth();

  const { routerPush } = useNProgressRouter();
  const [isLoading, setIsLoading] = useState(false);
  const SIGN_IN_ROUTE = "/sign-in";

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

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <Link href={SIGN_IN_ROUTE}>
        <Button className="">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-11 w-11 cursor-pointer">
          <AvatarImage
            key={user.photoURL} // Force re-render when photoURL changes
            src={user.photoURL || ""}
            alt={user.displayName || "User"}
          />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => routerPush("/account")}>
          <User />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => routerPush("/settings")}>
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
          <LogOut />
          <span>{isLoading ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
