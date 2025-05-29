"use client";
import { ArrowRight } from "lucide-react";
import { Link } from "../layout/link/CustomLink";
import { useAuth } from "@/lib/context/AuthProvider";
import { Button } from "../ui/button";

export function CTAButton({
  className = "h-12 px-8 w-full sm:w-auto",
  size = "lg",
  withArrow = true,
}: {
  className?: string;
  size?: "lg" | "default" | "sm" | "icon" | null | undefined;
  withArrow?: boolean;
}) {
  const { user } = useAuth();
  return (
    <Link href="/home" className="w-full sm:w-auto">
      <Button
        size={size}
        className={`${className} relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group text-white font-semibold`}
      >
        <span className="relative z-10 flex items-center">
          {user ? "Go to Home" : "Get Started For Free"}
          {withArrow && (
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          )}
        </span>

        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
      </Button>
    </Link>
  );
}
