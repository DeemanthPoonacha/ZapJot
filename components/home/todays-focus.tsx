import { Card } from "@/components/ui/card";

export async function TodaysFocus() {
  let quote = {
    q: "The secret of getting ahead is getting started.",
    a: "Mark Twain",
  };

  try {
    const response = await fetch("https://zenquotes.io/api/today", {
      next: { revalidate: 3600 }, // Cache for 1 hour to prevent API rate-limiting
    });
    if (response.ok) {
      const data = await response.json();
      if (data?.[0]?.q) {
        quote = {
          q: data[0].q,
          a: data[0].a || "Unknown",
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch today's focus quote:", error);
  }

  return (
    <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-accent/60 to-accent/20 items-center text-center">
      <span
        aria-hidden
        className="absolute -top-2 left-4 font-serif text-7xl text-primary/15 select-none"
      >
        &ldquo;
      </span>
      <h1 className="relative text-xl sm:text-2xl font-serif italic font-medium max-w-[580px] leading-snug">
        {quote.q}
      </h1>
      <p className="text-xs uppercase tracking-widest text-muted-foreground pt-3">
        — {quote.a}
      </p>
    </Card>
  );
}
