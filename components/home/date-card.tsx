"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export function DateCard() {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const schedule = () => {
      const delay = 60_000 - (Date.now() % 60_000);

      const timeout = setTimeout(() => {
        setNow(dayjs());

        interval = setInterval(() => {
          setNow(dayjs());
        }, 60_000);
      }, delay);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    };

    return schedule();
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 rounded-xl border border-border/60 bg-card/5 px-5 py-3 shadow-md">
      <div className="flex flex-col items-center border-r border-border/40 pr-4">
        <span className="text-lg font-semibold tracking-[0.2em] text-muted-foreground">
          {now.format("YYYY")}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {now.format("ddd")}
        </span>

        <span className="text-6xl font-serif leading-none">
          {now.format("D")}
        </span>

        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {now.format("MMM")}
        </span>
      </div>

      <div className="flex flex-col items-center border-l border-border/40 pl-4">
        <span className="text-md font-semibold tracking-[0.2em] text-muted-foreground">
          {now.format("HH:mm")}
        </span>
      </div>
    </div>
  );
}
