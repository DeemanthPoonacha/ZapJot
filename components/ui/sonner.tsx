"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { toast } from "sonner";
import "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          border: "var(--border) solid 1px",
        },
        classNames: {
          toast:
            "group toast !bg-background !text-foreground !border-border !shadow-lg",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground font-medium",
          cancelButton: "!bg-muted !text-muted-foreground font-medium",
        },
      }}
      duration={30000}
      {...props}
    />
  );
};

export { Toaster, toast };
