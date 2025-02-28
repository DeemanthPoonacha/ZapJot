import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface FloatingButtonProps {
  label: string;
  onClick?: () => void;
}

export default function FloatingButton({
  label,
  onClick,
}: FloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all hover:bg-primary/90"
    >
      <Plus className="h-5 w-5" />
      {label}
    </Button>
  );
}
