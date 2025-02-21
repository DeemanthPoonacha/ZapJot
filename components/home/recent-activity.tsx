import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function RecentActivity() {
  const activities = [
    { id: "1", text: "Added new journal entry", time: "Today" },
    { id: "2", text: "Updated 'Summer 2025' chapter", time: "Yesterday" },
    { id: "3", text: "Completed a goal: 'Run 5K'", time: "2 days ago" },
  ]

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Recent Activity</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/activity" className="flex items-center">
            Explore More <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex justify-between items-center">
            <span>{activity.text}</span>
            <span className="text-sm text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

