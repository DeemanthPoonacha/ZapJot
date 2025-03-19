// app/signin/page.jsx (for App Router)
"use client";
import FirebaseAuthUI from "@/components/auth/FirebaseUI";
import { useAuth } from "@/lib/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{!user && <FirebaseAuthUI />}</div>;
}
