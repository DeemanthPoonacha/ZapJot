import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useNProgressRouter } from "../layout/link/CustomLink";

export default function FloatingButton() {
  const pathname = usePathname();
  const { routerPush } = useNProgressRouter();

  let action: { label: string; href: string } | null = null;

  if (/^\/chapters\/[^/]+$/.test(pathname)) {
    // Extract chapterId and construct the correct href
    const chapterId = pathname.split("/")[2];
    if (chapterId !== "new")
      action = {
        label: "New Journal",
        href: `/chapters/${chapterId}/journals/new`,
      };
  } else if (pathname === "/chapters") {
    action = { label: "New Chapter", href: "/chapters/new" };
  } else if (pathname === "/characters") {
    action = { label: "New Character", href: "/characters/new" };
  }

  return (
    action && (
      <Button
        onClick={() => routerPush(action.href)}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all hover:bg-primary/90"
      >
        <Plus className="h-5 w-5" />
        {action.label}
      </Button>
    )
  );
}
