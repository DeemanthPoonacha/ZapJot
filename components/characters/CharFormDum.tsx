"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar } from "lucide-react";
import Image from "next/image";

export default function CharacterForm() {
  const [reminders, setReminders] = useState([
    { id: "1", title: "Birthday: 12th, July (12:00AM, repeats every year)" },
  ]);

  return (
    <main className="container pb-20 pt-4 max-w-md mx-auto">
      <PageHeader title="Edit Character" />

      <form className="p-4 space-y-6">
        <Card className="p-4 text-center">
          <div className="relative mx-auto h-32 w-32 mb-4">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="/placeholder.svg"
                alt="Profile picture"
                fill
                className="object-cover"
              />
            </div>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              defaultValue="Paulo Marconi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Title/Relationship</Label>
            <Input
              id="relationship"
              placeholder="Enter relationship"
              defaultValue="BFF"
            />
          </div>

          <div className="space-y-2">
            <Label>Special Dates/Reminders</Label>
            {reminders.map((reminder) => (
              <Card
                key={reminder.id}
                className="p-3 flex items-center justify-between"
              >
                <span className="text-sm">{reminder.title}</span>
                <Button variant="ghost" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </Card>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Special Date/Reminder
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a description..."
              defaultValue="My best friend who I tell everything to"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="w-full">
            Reset
          </Button>
          <Button className="w-full">Save</Button>
        </div>
      </form>
    </main>
  );
}
