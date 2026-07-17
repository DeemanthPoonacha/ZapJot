import { Card } from "@/components/ui/card";

export async function TodaysFocus() {
  // Simulate fetching data
  const [data] = (await fetch("https://zenquotes.io/api/today").then((res) =>
    res.json(),
  )) as { q: string; a: string; h: string }[];

  if (!data?.q) return null;

  return (
    <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-accent/60 to-accent/20 items-center text-center">
      <span
        aria-hidden
        className="absolute -top-2 left-4 font-serif text-7xl text-primary/15 select-none"
      >
        &ldquo;
      </span>
      <h1 className="relative text-xl sm:text-2xl font-serif italic font-medium max-w-[580px] leading-snug">
        {data.q}
      </h1>
      <p className="text-xs uppercase tracking-widest text-muted-foreground pt-3">
        — {data.a}
      </p>
    </Card>
  );
}
