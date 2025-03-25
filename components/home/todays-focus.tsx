import { Card } from "@/components/ui/card";

export function TodaysFocus() {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10">
      <h2 className="font-semibold mb-2">{`Today's focus`}</h2>
      <h3 className="text-lg font-semibold mb-2">
        Your travel itinerary for Paris starts today! 🗼
      </h3>
      <p className="text-sm text-muted-foreground">
        {`Don't forget to pack your camera and passport!`}
      </p>
    </Card>
  );
}
