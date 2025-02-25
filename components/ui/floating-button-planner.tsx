import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function FloatingButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-white shadow-lg transition-all hover:bg-primary/90"
    >
      <Plus className="h-5 w-5" />
      {label}
    </Button>
  );
}
