"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import dynamic from "next/dynamic";

const AuthProvider = dynamic(
  () => import("./AuthProvider").then((mod) => mod.AuthProvider),
  {
    ssr: false,
  }
);

export default function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
