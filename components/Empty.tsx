import { UserCircle, Plus, CircleOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactElement, ReactNode } from "react";

export default function Empty({
  handleCreateClick,
  title = "Nothing here yet",
  subtitle = "Let's add some data to get started",
  buttonTitle = "Create new",
  showButton = true,
  customAction,
  icon = <CircleOff className="emptyIcon" />,
}: {
  handleCreateClick: () => void;
  title?: string;
  subtitle?: string;
  buttonTitle?: string;
  showButton?: boolean;
  customAction?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon}
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{subtitle}</p>
      {customAction ||
        (showButton && (
          <Button type="button" onClick={handleCreateClick}>
            <Plus className="h-4 w-4" />
            {buttonTitle}
          </Button>
        ))}
    </div>
  );
}
