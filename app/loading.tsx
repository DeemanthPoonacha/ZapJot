// loading.tsx
import { LoaderPinwheel } from "lucide-react";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-svh bg-black/50">
      <LoaderPinwheel className="animate-spin h-12 w-12 text-primary" />
    </div>
  );
}
