import { Card } from "@/components/ui/card";
import { Camera, FileEdit } from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import { DEFAULT_CHAPTER_ID } from "@/lib/constants";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link
        href={`/chapters/${DEFAULT_CHAPTER_ID}/journals/new?isCamOpen=true`}
      >
        <Card className="group p-6 text-center items-center gap-2 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary p-3 group-hover:bg-primary/15 transition-colors">
            <Camera className="h-6 w-6" />
          </span>
          <span className="text-sm font-medium">Capture</span>
        </Card>
      </Link>
      <Link href={`/chapters/${DEFAULT_CHAPTER_ID}/journals/new`}>
        <Card className="group p-6 text-center items-center gap-2 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary p-3 group-hover:bg-primary/15 transition-colors">
            <FileEdit className="h-6 w-6" />
          </span>
          <span className="text-sm font-medium">New Journal</span>
        </Card>
      </Link>
    </div>
  );
}
