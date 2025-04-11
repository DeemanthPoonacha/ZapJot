"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";

export default function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      // THIS LINE IS IMPORTANT
      forcedTheme={undefined}
      // attribute="class"
      // // defaultTheme="dark"
      // enableSystem
      // // disableTransitionOnChange
      // defaultTheme="system"
      // themes={["light", "dark", "purple", "green"]}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
