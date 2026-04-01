import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Globe } from "lucide-react";

const POPULAR_TIMEZONES = [
  { label: "New York", tz: "America/New_York" },
  { label: "London", tz: "Europe/London" },
  { label: "Paris", tz: "Europe/Paris" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "Sydney", tz: "Australia/Sydney" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Los Angeles", tz: "America/Los_Angeles" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "Mumbai", tz: "Asia/Kolkata" },
  { label: "São Paulo", tz: "America/Sao_Paulo" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "Hong Kong", tz: "Asia/Hong_Kong" },
];

interface WorldClock {
  label: string;
  tz: string;
}

const WorldClocksDisplay = () => {
  const [clocks, setClocks] = useState<WorldClock[]>([
    { label: "London", tz: "Europe/London" },
    { label: "New York", tz: "America/New_York" },
    { label: "Tokyo", tz: "Asia/Tokyo" },
  ]);
  const [time, setTime] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addClock = (clock: WorldClock) => {
    if (!clocks.find((c) => c.tz === clock.tz)) {
      setClocks([...clocks, clock]);
    }
    setShowAdd(false);
  };

  const removeClock = (tz: string) => {
    setClocks(clocks.filter((c) => c.tz !== tz));
  };

  const getTimeInTZ = (tz: string) => {
    return time.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getOffsetLabel = (tz: string) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(time);
    const offset = parts.find((p) => p.type === "timeZoneName");
    return offset?.value || "";
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      <Globe className="w-8 h-8 text-sand-dim opacity-40" />

      <div className="w-full space-y-4">
        {clocks.map((clock) => {
          const timeStr = getTimeInTZ(clock.tz);
          const [hrs, mins, secs] = timeStr.split(":");
          return (
            <div key={clock.tz} className="flex items-center justify-between border-b border-border/30 pb-3 group">
              <div className="flex flex-col">
                <span className="font-serif text-sm tracking-[0.2em] uppercase text-muted-foreground">
                  {clock.label}
                </span>
                <span className="font-mono text-xs text-sand-dim">{getOffsetLabel(clock.tz)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-mono flex items-baseline">
                  <span className="text-3xl md:text-4xl font-light text-foreground">{hrs}</span>
                  <span className="text-xl text-sand-dim animate-pulse">:</span>
                  <span className="text-3xl md:text-4xl font-light text-foreground">{mins}</span>
                  <span className="text-lg text-muted-foreground ml-1">{secs}</span>
                </div>
                <button
                  onClick={() => removeClock(clock.tz)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd ? (
        <div className="w-full max-h-48 overflow-y-auto space-y-1">
          {POPULAR_TIMEZONES.filter((tz) => !clocks.find((c) => c.tz === tz.tz)).map((tz) => (
            <button
              key={tz.tz}
              onClick={() => addClock(tz)}
              className="w-full text-left px-3 py-2 font-serif text-sm tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded transition-colors"
            >
              {tz.label}
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)} className="w-full font-serif tracking-widest text-muted-foreground text-xs mt-2">
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setShowAdd(true)} className="font-serif tracking-widest text-muted-foreground hover:text-foreground text-xs">
          <Plus className="w-3 h-3 mr-1" /> Add City
        </Button>
      )}
    </div>
  );
};

export default WorldClocksDisplay;
