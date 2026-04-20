import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary/20 selection:text-primary ring-ring/10 dark:ring-ring/20 outline-ring/50 aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-border/80 hover:bg-muted/10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
