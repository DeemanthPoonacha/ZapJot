"use client";
import { useEffect } from "react";
import { useNProgressRouter } from "./layout/link/CustomLink";
import { useAuth } from "@/lib/context/AuthProvider";
import { CustomLoader } from "./layout/CustomLoader";
import { useSettings } from "@/lib/hooks/useSettings";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  useSettings();
  const { user, loading } = useAuth();
  const { routerPush } = useNProgressRouter();

  useEffect(() => {
    if (!loading && !user) {
      routerPush("/auth/sign-in");
    }
  }, [user, loading]);

  if (loading) {
    return <CustomLoader />;
  }

  return user ? <>{children}</> : null;
}
