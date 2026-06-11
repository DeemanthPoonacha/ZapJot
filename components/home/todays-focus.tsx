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
    <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 items-center">
      <h1 className="text-2xl text-center font-semibold max-w-[580px]">{`"${data?.q}"`}</h1>
      <p className="text-s opacity-90 pt-2">-{data?.a}</p>
    </Card>
  );
}
