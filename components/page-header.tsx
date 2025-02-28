import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  extra?: React.ReactNode;
}

export function PageHeader({ title, extra }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <h1 className="text-xl font-semibold">{title}</h1>
      {extra || (
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      )}
    </div>
  );
}
