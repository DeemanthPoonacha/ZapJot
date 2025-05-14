import { Card } from "@/components/ui/card";

export async function TodaysFocus() {
  // Simulate fetching data
  const [data] = (await fetch("https://zenquotes.io/api/today").then((res) =>
    res.json()
  )) as { q: string; a: string; h: string }[];

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 items-center">
      <h1 className="text-2xl text-center font-semibold max-w-[580px]">{`"${data?.q}"`}</h1>
      <p className="text-s opacity-90 pt-2">-{data?.a}</p>
    </Card>
  );
}
