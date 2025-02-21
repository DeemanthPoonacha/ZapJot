import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <h1 className="text-xl font-semibold">{title}</h1>
      <Button variant="ghost" size="icon">
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}
