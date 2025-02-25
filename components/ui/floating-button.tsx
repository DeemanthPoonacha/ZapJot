import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const floatingActions: Record<string, { label: string; href: string }> = {
  "/characters": { label: "New Character", href: "/characters/new" },
  "/chapters": { label: "New Chapter", href: "/chapters/new" },
  // "/planner": { label: "New Plan", href: "/planner/new" },
};

export default function FloatingButton() {
  const pathname = usePathname();
  const router = useRouter();
  // Find relevant action based on current route
  const action = Object.entries(floatingActions).find(
    ([path]) => pathname === path
  )?.[1];

  return (
    action && (
      <Button
        onClick={() => router.push(action.href)}
        className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-white shadow-lg transition-all hover:bg-primary/90"
      >
        <Plus className="h-5 w-5" />
        {action.label}
      </Button>
    )
  );
}
