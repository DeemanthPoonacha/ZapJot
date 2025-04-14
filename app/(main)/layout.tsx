import { NavigationBar } from "@/components/layout/NavigationBar";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <ProtectedRoute>
        {children}
        <NavigationBar />
      </ProtectedRoute>
    </div>
  );
};

export default Layout;
