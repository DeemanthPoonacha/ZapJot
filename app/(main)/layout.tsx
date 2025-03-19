import { NavigationBar } from "@/components/NavigationBar";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      {children}
      <NavigationBar />
    </div>
  );
};

export default Layout;
