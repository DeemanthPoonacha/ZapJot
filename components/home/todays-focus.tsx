import { Card } from "@/components/ui/card";

const FALLBACK_QUOTE = {
  q: "The secret of getting ahead is getting started.",
  a: "Mark Twain",
};

async function getTodaysQuote() {
  try {
    const res = await fetch("https://zenquotes.io/api/today", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("API non-OK");
    const [data] = (await res.json()) as { q: string; a: string; h: string }[];
    return data ?? FALLBACK_QUOTE;
  } catch {
    return FALLBACK_QUOTE;
  }
}

export async function TodaysFocus() {
  const data = await getTodaysQuote();

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
