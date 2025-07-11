import { LoaderPinwheel } from "lucide-react";

export const CustomLoader = () => (
  <div className="flex items-center justify-center h-svh">
    <LoaderPinwheel className="animate-spin h-12 w-12 text-primary" />
  </div>
);
