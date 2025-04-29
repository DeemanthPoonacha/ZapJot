// app/signin/page.jsx (for App Router)
"use client";
import FirebaseAuthUI from "@/components/auth/FirebaseUI";
import { CustomLoader } from "@/components/layout/CustomLoader";
import { useAuth } from "@/lib/context/AuthProvider";
import { useNProgressRouter } from "@/components/layout/link/CustomLink";
import { useEffect } from "react";

export default function SignInPage() {
  const { user, loading } = useAuth();
  const { routerPush } = useNProgressRouter();

  useEffect(() => {
    if (user && !loading) {
      routerPush("/");
    }
  }, [user, loading]);

  if (loading) {
    return <CustomLoader />;
  }

  return <div>{!user && <FirebaseAuthUI />}</div>;
}
