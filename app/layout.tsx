import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/lib/context/AppProviders";
import { Toaster } from "@/components/ui/sonner";
import { NProgressDone } from "@/components/layout/link/CustomLink";
import { Suspense } from "react";
import { CustomLoader } from "@/components/layout/CustomLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2e0f42",
};

export const metadata: Metadata = {
  title: { default: "ZapJot", template: "%s | ZapJot" },
  description:
    "A fast and intuitive personal journaling and planning app. Turn Moments Into Memories, Ideas Into Actions.",

  metadataBase: new URL("https://zap-jot.netlify.app/"),
  openGraph: {
    title: "ZapJot",
    description:
      "A fast and intuitive personal journaling and planning app. Turn Moments Into Memories, Ideas Into Actions.",
    url: "https://zap-jot.netlify.app/",
    siteName: "ZapJot",
    images: [{ url: "https://zap-jot.netlify.app/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <main className="min-h-screen flex flex-col items-center">
            {children}

            <Suspense fallback={<CustomLoader />}>
              <NProgressDone />
            </Suspense>
            <Toaster />
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
