import { Card } from "@/components/ui/card"

export function HomeHeader() {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
      <h1 className="text-xl font-semibold">Good morning, Jane</h1>
      <p className="text-sm opacity-90">Here's what's happening today at a glance.</p>
      <div className="mt-4 space-y-2">
        <p className="text-sm">📝 3 tasks pending</p>
        <p className="text-sm">🎯 2 goals in progress</p>
        <p className="text-sm">🎉 It's Paulo's Birthday today!</p>
      </div>
    </Card>
  )
}

