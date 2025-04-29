"use client";

import { useTheme } from "next-themes";
import { useMediaQuery } from "react-responsive";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { toast } from "sonner";
import "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Adjust breakpoint as needed

  return (
    <Sonner
      position={isMobile ? "top-right" : "bottom-right"}
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
          closeButton:
            "!bg-muted !text-muted-foreground font-medium !left-auto !-right-4",
        },
      }}
      closeButton
      {...props}
    />
  );
};

export { Toaster, toast };
