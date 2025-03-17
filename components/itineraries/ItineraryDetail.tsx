"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Activity {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

interface Day {
  id: string;
  number: number;
  budget: number;
  activities: Activity[];
}

const itineraryData = {
  title: "Manali 2025",
  date: "Dec, 2025",
  duration: "02-12-2025 to 07-12-2025 (6 days)",
  budget: {
    total: 68000,
    spent: 0,
  },
  days: [
    {
      id: "1",
      number: 1,
      budget: 12000,
      activities: [
        {
          id: "1-1",
          title: "Touchdown; Collect car",
          time: "10:00 PM",
          completed: false,
        },
        {
          id: "1-2",
          title: "Hadimba Temple",
          time: "3:00 PM",
          completed: false,
        },
        {
          id: "1-3",
          title: "Mall Road for shopping and local cuisine",
          time: "6:00 PM",
          completed: false,
        },
      ],
    },
    {
      id: "2",
      number: 2,
      budget: 18000,
      activities: [
        {
          id: "2-1",
          title: "Solang Valley",
          time: "8:00 AM",
          completed: false,
        },
        {
          id: "2-2",
          title: "Rohtang Pass (check for permits)",
          time: "3:00 PM",
          completed: false,
        },
      ],
    },
    // Add more days as needed
  ],
};

export default function ItineraryDetailPage({ id }: { id: string }) {
  const [isEditing, setIsEditing] = useState(false);

  const [days, setDays] = useState<Day[]>(itineraryData.days);

  const toggleActivity = (dayId: string, activityId: string) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.map((activity) => {
              if (activity.id === activityId) {
                return { ...activity, completed: !activity.completed };
              }
              return activity;
            }),
          };
        }
        return day;
      })
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/10">
        <h2 className="text-xl font-bold">{itineraryData.title}</h2>
        <p className="text-sm text-muted-foreground">
          {itineraryData.duration}
        </p>
        <div className="mt-2 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="text-lg font-semibold">
              ₹{itineraryData.budget.total}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-lg font-semibold">
              ₹{itineraryData.budget.spent}
            </p>
          </div>
        </div>
      </Card>

      {days.map((day) => (
        <Card key={day.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Day {day.number}</h3>
              <p className="text-sm text-muted-foreground">
                Budget: ₹{day.budget}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Day</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Day
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-3">
            {day.activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={activity.completed}
                    onCheckedChange={() => toggleActivity(day.id, activity.id)}
                  />
                  <span
                    className={
                      activity.completed
                        ? "line-through text-muted-foreground"
                        : ""
                    }
                  >
                    {activity.title}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Button className="w-full bg-gradient-to-r from-primary to-primary/90">
        <Plus className="mr-2 h-4 w-4" /> Add Day
      </Button>
    </div>
  );
}
