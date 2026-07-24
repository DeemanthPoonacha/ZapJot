"use client";
import { useAuth } from "@/lib/context/AuthProvider";
import { Link } from "../../layout/link/CustomLink";
import { LogIn } from "lucide-react";

export default function LoginButton() {
  const { user } = useAuth();

  return (
    !user && (
      <Link
        href="/auth/sign-in"
        className="hidden md:inline-flex text-sm font-medium transition-colors cursor-pointer px-4 py-2 rounded-md items-center gap-1 border border-primary text-primary hover:bg-secondary"
      >
        Log In
        <LogIn className="w-4 h-4" />
      </Link>
    )
  );
}
