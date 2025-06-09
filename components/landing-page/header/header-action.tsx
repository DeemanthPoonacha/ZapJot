"use client";
import dynamic from "next/dynamic";
import { CTAButton } from "../cta/cta-button";

const LoginButton = dynamic(() => import("./login-button"), {
  ssr: false,
  loading: () => (
    <div className="hidden md:inline-flex animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-4"></div>
  ),
});

export default function HeaderAction() {
  return (
    <div className="flex items-center gap-4">
      <LoginButton />
      <CTAButton
        textWhenLoggedIn="My Workspace"
        size="default"
        className=""
        extraAfter={null}
      />
    </div>
  );
}
