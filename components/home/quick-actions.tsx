import { Card } from "@/components/ui/card";
import { Camera, FileEdit } from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import { DEFAULT_CHAPTER_ID } from "@/lib/constants";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link href={`/chapters/${DEFAULT_CHAPTER_ID}/journals/new?isCamOpen=true`}>
        <Card className="group p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.03)] glass-panel border-border/50 bg-background/50 cursor-pointer">
          <Camera className="h-8 w-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">Capture</span>
        </Card>
      </Link>
      <Link href={`/chapters/${DEFAULT_CHAPTER_ID}/journals/new`}>
        <Card className="group p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.03)] glass-panel border-border/50 bg-background/50 cursor-pointer">
          <FileEdit className="h-8 w-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">New Journal</span>
        </Card>
      </Link>
    </div>
  );
}
