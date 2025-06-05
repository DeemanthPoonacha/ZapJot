"use client";
import { useAuth } from "@/lib/context/AuthProvider";
import { Link } from "../../layout/link/CustomLink";

export default function LoginButton() {
  const { user } = useAuth();

  return (
    !user && (
      <Link
        href="/auth/sign-in"
        className="hidden md:inline-flex text-sm font-medium hover:text-primary transition-colors w-16"
      >
        Log in
      </Link>
    )
  );
}
