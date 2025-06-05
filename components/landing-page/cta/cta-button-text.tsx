"use client";
import { useAuth } from "@/lib/context/AuthProvider";

export default function CTAButtonText({
  text,
  textWhenLoggedIn,
}: {
  text?: string;
  textWhenLoggedIn?: string;
}) {
  const { user } = useAuth();

  // Determine final text
  const label = user ? textWhenLoggedIn : text;
  return label;
}
