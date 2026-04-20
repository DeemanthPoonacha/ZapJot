import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";

export function RecentActivity() {
  const activities = [
    { id: "1", text: "Added new journal entry", time: "Today" },
    { id: "2", text: "Updated 'Summer 2025' chapter", time: "Yesterday" },
    { id: "3", text: "Completed a goal: 'Run 5K'", time: "2 days ago" },
  ];

  return (
    <Card className="p-5 glass-panel shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-lg tracking-tight">Recent Activity</h2>
        <Button variant="ghost" size="sm" asChild className="group text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center !gap-1">
            Explore <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
      <div className="space-y-1">
        {!activities?.length ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activities found
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="group flex justify-between items-center p-3 -mx-3 rounded-xl hover:bg-muted/40 transition-colors"
            >
              <span className="font-medium text-sm text-foreground/90">{activity.text}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {activity.time}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
