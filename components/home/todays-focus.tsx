import { Card } from "@/components/ui/card";

export async function TodaysFocus() {
  // Simulate fetching data
  const [data] = (await fetch("https://zenquotes.io/api/today").then((res) =>
    res.json()
  )) as { q: string; a: string; h: string }[];

  return (
    <Card className="p-8 relative overflow-hidden glass-panel border border-primary/20 bg-gradient-to-br from-primary/10 via-background/50 to-background/30 backdrop-blur-xl group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500">
      <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-xl md:text-2xl text-center font-medium max-w-[680px] leading-relaxed tracking-tight text-foreground/90">{`"${data?.q}"`}</h1>
        <p className="text-sm font-semibold opacity-70 pt-4 tracking-widest uppercase">~ {data?.a}</p>
      </div>
    </Card>
  );
}
