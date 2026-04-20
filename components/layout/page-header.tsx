import { ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/layout/link/CustomLink";
import { cn } from "@/lib/utils";
import UserAvatarDropdown from "./UserAvatar";

export interface PageHeaderProps {
  icon?: React.ReactNode;
  title?: string;
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
  showSearch = false,
  onSearchClick,
}: PageHeaderProps) {
  return (
    <div className={cn("sticky top-0 z-30 flex flex-col gap-1.5 py-4 bg-background/80 backdrop-blur-xl mb-4 mx-[-1rem] px-[1rem] md:mx-[-2rem] md:px-[2rem] rounded-b-2xl border-b border-border/40 shadow-[0_4px_24px_rgba(0,0,0,0.02)]", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {backLink && (
            <Link href={backLink} className="mr-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2 min-w-0">
            {icon && <span className="text-primary">{icon}</span>}
            <h1 className="text-xl font-semibold truncate md:text-2xl">
              {title}
            </h1>
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
          <UserAvatarDropdown />
        </div>
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground ml-0 sm:ml-10 truncate md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
