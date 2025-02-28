import { ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  backLink?: string;
  className?: string;
  showSearch?: boolean;
  onSearchClick?: () => void;
}

export function PageHeader({
  backLink,
  title,
  subtitle,
  extra,
  icon,
  className,
  showSearch = true,
  onSearchClick,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 py-4 border-b mb-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {backLink && (
            <Link href={backLink} className="mr-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2 min-w-0">
            {icon && <span className="text-primary">{icon}</span>}
            <h1 className="text-xl font-semibold truncate">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {extra}
          {showSearch && !extra && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9"
              onClick={onSearchClick}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          )}
        </div>
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground ml-0 sm:ml-10 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
