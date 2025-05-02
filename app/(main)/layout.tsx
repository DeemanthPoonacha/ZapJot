import { NavigationBar } from "@/components/layout/NavigationBar";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProtectedRoute>
      {children}
      <NavigationBar />
    </ProtectedRoute>
  );
};

export default Layout;
