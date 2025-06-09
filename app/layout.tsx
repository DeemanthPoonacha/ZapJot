import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppProviders from "@/lib/context/AppProviders";
import { NProgressDone } from "@/components/layout/link/CustomLink";
import { Suspense } from "react";
import { CustomLoader } from "@/components/layout/CustomLoader";

export const viewport: Viewport = {
  themeColor: "#2e0f42",
};

export const metadata: Metadata = {
  title: { default: "ZapJot", template: "%s | ZapJot" },
  description:
    "A fast and intuitive personal journaling and planning app. Turn Moments Into Memories, Ideas Into Actions.",
  keywords: [
    "ZapJot",
    "journal",
    "planner",
    "ZapJot",
    "diary",
    "goal tracker",
    "journal app",
    "planner app",
    "personal organizer",
    "diary app",
    "daily journal",
    "productivity app",
  ],
  metadataBase: new URL("https://zap-jot.netlify.app/"),
  openGraph: {
    title: "ZapJot",
    description:
      "A fast and intuitive personal journaling and planning app. Turn Moments Into Memories, Ideas Into Actions.",
    url: "https://zap-jot.netlify.app/",
    siteName: "ZapJot",
    images: [
      { url: "https://zap-jot.netlify.app/logo.webp", alt: "ZapJot Preview" },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ZapJot",
    description: "The fast & intuitive digital journal and planner.",
    images: ["https://zap-jot.netlify.app/logo.webp"],
  },
  other: {
    "google-site-verification": "LUEt2oCJr6eaA_LHQsrMzE-6tKVF1yT-zH0oMqonmQQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="purple">
      <body className={` antialiased`}>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ZapJot",
              url: "https://zap-jot.netlify.app/",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              description:
                "Fast and intuitive personal journal and planner app.",
            }),
          }}
        />
        <AppProviders>
          <main className="min-h-screen flex flex-col items-center">
            {children}

            <Suspense fallback={<CustomLoader />}>
              <NProgressDone />
            </Suspense>
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
