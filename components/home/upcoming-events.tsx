import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function UpcomingEvents() {
  const events = [
    { id: "1", title: "Meeting with John", time: "Today, 2 PM" },
    { id: "2", title: "Gym Session", time: "Tomorrow, 7 AM" },
    { id: "3", title: "Project Deadline", time: "Friday, 5 PM" },
  ]

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Upcoming Events</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/planner?tab=events" className="flex items-center">
            Explore More <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex justify-between items-center">
            <span>{event.title}</span>
            <span className="text-sm text-muted-foreground">{event.time}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

