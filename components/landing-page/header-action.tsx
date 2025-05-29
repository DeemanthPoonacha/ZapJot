"use client";
import { useAuth } from "@/lib/context/AuthProvider";
import { Link } from "../layout/link/CustomLink";
import { useEffect } from "react";
import { useSettings } from "@/lib/hooks/useSettings";
import { CTAButton } from "./cta-button";

export default function HeaderAction() {
  const { user } = useAuth();
  const { handleThemeChange } = useSettings();

  useEffect(() => {
    handleThemeChange("purple");
  }, []);

  return (
    <div className="flex items-center gap-4">
      {!user && (
        <Link
          href="/auth/sign-in"
          className="hidden md:inline-flex text-sm font-medium hover:text-primary transition-colors w-16"
        >
          Log in
        </Link>
      )}
      <CTAButton size="default" className="" withArrow={false} />
    </div>
  );
}
