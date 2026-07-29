import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Theme } from "@/types/themes";
import { ThemePreview } from "./ThemePreview";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeSelect: (themeId: string) => void;
}

export function ThemePreviewModal({
  isOpen,
  onClose,
  theme,
  onThemeSelect,
}: ThemePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Eye className="w-5 h-5 text-primary" />
            Theme Preview: {theme.name}
          </DialogTitle>
          <DialogDescription>
            Preview how ZapJot UI components and color swatches render with the
            &ldquo;{theme.name}&rdquo; theme.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <ThemePreview colors={theme.colors} />
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={() => onThemeSelect(theme.id)}>
            Select Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
