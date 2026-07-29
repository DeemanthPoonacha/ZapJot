import { Plus, CircleOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export default function Empty({
  handleCreateClick,
  title = "Nothing here yet",
  subtitle = "Let's add some data to get started",
  buttonTitle = "Create new",
  showButton = true,
  customAction,
  icon = <CircleOff className="emptyIcon" />,
  templates,
}: {
  handleCreateClick: () => void;
  title?: string;
  subtitle?: string;
  buttonTitle?: string;
  showButton?: boolean;
  customAction?: ReactNode;
  icon?: ReactNode;
  templates?: { label: string; action: () => void }[];
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card/40 rounded-3xl border border-border/50">
      {icon}
      <h3 className="text-xl font-bold mb-1 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{subtitle}</p>
      
      {customAction ||
        (showButton && (
          <Button type="button" onClick={handleCreateClick} className="gap-1.5 shadow-md">
            <Plus className="h-4 w-4" />
            {buttonTitle}
          </Button>
        ))}

      {templates && templates.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border/60 flex flex-col items-center gap-2.5 w-full">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Or start with a preset template:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {templates.map((tmpl) => (
              <Badge
                key={tmpl.label}
                variant="secondary"
                onClick={tmpl.action}
                className="cursor-pointer bg-background hover:bg-primary/10 hover:text-primary border border-border/80 transition-all px-3 py-1.5 rounded-full text-xs font-semibold gap-1.5 shadow-sm"
              >
                <Sparkles className="h-3 w-3 text-primary" /> {tmpl.label}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
