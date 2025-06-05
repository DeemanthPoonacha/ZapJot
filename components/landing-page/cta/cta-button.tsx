"use client";
import dynamic from "next/dynamic";

export type CTAButtonProps = {
  className?: string;
  size?: "lg" | "default" | "sm" | "icon" | null | undefined;
  href?: string;
  text?: string;
  textWhenLoggedIn?: string;
  extraAfter?: React.ReactNode; // Optional prop for additional content after the button text
  extraBefore?: React.ReactNode; // Optional prop for additional content before the button text
};

const CTAButtonBase = dynamic(() => import("./cta-button-base"), {
  ssr: false,
});

export function CTAButton(props: CTAButtonProps) {
  return <CTAButtonBase {...props} />;
}
