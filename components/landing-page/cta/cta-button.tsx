"use client";
import { ArrowRight } from "lucide-react";
import { Link } from "../../layout/link/CustomLink";
import { useAuth } from "@/lib/context/AuthProvider";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

type CTAButtonProps = {
  className?: string;
  size?: "lg" | "default" | "sm" | "icon" | null | undefined;
  href?: string;
  text?: string;
  textWhenLoggedIn?: string;
  extraAfter?: React.ReactNode; // Optional prop for additional content after the button text
  extraBefore?: React.ReactNode; // Optional prop for additional content before the button text
};

export function CTAButton({
  className = "h-12 px-8 w-full sm:w-auto",
  size = "lg",
  href = "/home",
  text = "Get Started Free",
  textWhenLoggedIn = "Go to My Workspace",
  extraBefore,
  extraAfter = (
    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
  ),
}: CTAButtonProps) {
  const { user } = useAuth();

  // Determine final text
  const label = user ? textWhenLoggedIn : text;

  return (
    <Link href={href} className="w-full sm:w-auto">
      <Button
        size={size}
        className={cn(
          "relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group text-white font-semibold text-base",
          className
        )}
      >
        <span className="relative z-10 flex items-center gap-2">
          {extraBefore}
          {label}
          {extraAfter}
        </span>

        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
      </Button>
    </Link>
  );
}
