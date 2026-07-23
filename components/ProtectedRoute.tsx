"use client";
import { useEffect } from "react";
import { useNProgressRouter } from "./layout/link/CustomLink";
import { useAuth } from "@/lib/context/AuthProvider";
import { CustomLoader } from "./layout/CustomLoader";
import { useSettings } from "@/lib/hooks/useSettings";
import { useTheme } from "next-themes";
import { DEFAULT_THEME } from "@/lib/constants";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  useSettings();
  const { user, loading } = useAuth();
  const { routerPush } = useNProgressRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!loading && !user) {
      routerPush("/auth/sign-in");
    }
  }, [user, loading, routerPush]);

  // // When leaving dashboard (unmounting ProtectedRoute), reset to default public theme
  // useEffect(() => {
  //   return () => {
  //     document.documentElement.className = "";
  //     setTheme(DEFAULT_THEME);
  //   };
  // }, [setTheme]);

  if (loading) {
    return <CustomLoader />;
  }

  return user ? <>{children}</> : null;
}
