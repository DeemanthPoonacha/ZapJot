import { Footer } from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header/header";
import { PublicThemeReset } from "@/components/layout/PublicThemeReset";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <PublicThemeReset />
      <Header />
      <main className="flex-1 container pb-24 md:pb-32 px-4 md:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
