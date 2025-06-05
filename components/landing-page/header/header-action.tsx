"use client";
import { useAuth } from "@/lib/context/AuthProvider";
import { Link } from "../../layout/link/CustomLink";
import { CTAButton } from "../cta/cta-button";

export default function HeaderAction() {
  const { user } = useAuth();

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
      <CTAButton
        textWhenLoggedIn="My Workspace"
        size="default"
        className=""
        extraAfter={null}
      />
    </div>
  );
}
