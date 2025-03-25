import { Card } from "@/components/ui/card";
import { Camera, FileEdit } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link href="/">
        <Card className="p-6 text-center hover:bg-accent transition-colors">
          <Camera className="h-8 w-8 mx-auto mb-2" />
          <span className="text-sm font-medium">Capture</span>
        </Card>
      </Link>
      <Link href="/chapters">
        <Card className="p-6 text-center hover:bg-accent transition-colors">
          <FileEdit className="h-8 w-8 mx-auto mb-2" />
          <span className="text-sm font-medium">New Journal</span>
        </Card>
      </Link>
    </div>
  );
}
