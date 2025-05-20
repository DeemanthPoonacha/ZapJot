import { Footer } from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Header />
      <div className="prose">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
