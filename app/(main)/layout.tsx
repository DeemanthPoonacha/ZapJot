import { NavigationBar } from "@/components/NavigationBar";
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
