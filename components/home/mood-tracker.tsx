"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function MoodTracker() {
  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">How is it going?</h2>
      <div className="flex justify-between mb-4">
        <Button variant="ghost" className="hover:bg-accent">
          😃
        </Button>
        <Button variant="ghost" className="hover:bg-accent">
          🙂
        </Button>
        <Button variant="ghost" className="hover:bg-accent">
          😐
        </Button>
        <Button variant="ghost" className="hover:bg-accent">
          😢
        </Button>
        <Button variant="ghost" className="hover:bg-accent">
          😠
        </Button>
      </div>
      <div className="space-y-4">
        <Textarea placeholder="Tell us more:" />
        <Button className="w-full">Save</Button>
      </div>
    </Card>
  )
}

