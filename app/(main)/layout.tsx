import { NavigationBar } from "@/components/layout/NavigationBar";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { OfflineIndicator } from "@/components/layout/OfflineIndicator";

export const metadata: Metadata = {
  title: "App",
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProtectedRoute>
      <OfflineIndicator />
      {children}
      <NavigationBar />
      <Toaster />
    </ProtectedRoute>
  );
};

export default Layout;
