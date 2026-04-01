import { useState, useEffect } from "react";
import { getLast7Days } from "@/lib/focusStats";
import { BarChart3 } from "lucide-react";

const FocusStatsDisplay = () => {
  const [stats, setStats] = useState(getLast7Days());

  useEffect(() => {
    const interval = setInterval(() => setStats(getLast7Days()), 5000);
    return () => clearInterval(interval);
  }, []);

  const maxMinutes = Math.max(...stats.map((s) => s.minutes), 1);

  const totalToday = stats[stats.length - 1]?.minutes || 0;
  const totalWeek = stats.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <BarChart3 className="w-8 h-8 text-sand-dim opacity-40" />

      <div className="text-center">
        <p className="font-serif text-sm tracking-[0.3em] uppercase text-muted-foreground">
          Focus Time
        </p>
      </div>

      {/* Summary cards */}
      <div className="flex gap-8">
        <div className="text-center">
          <p className="font-mono text-3xl text-foreground">{totalToday}</p>
          <p className="font-serif text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
            Minutes Today
          </p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="font-mono text-3xl text-foreground">{totalWeek}</p>
          <p className="font-serif text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
            This Week
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="w-full flex items-end justify-between gap-2 h-32 px-4">
        {stats.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full flex items-end justify-center h-24">
              <div
                className="w-full max-w-[28px] bg-sand/20 rounded-t transition-all duration-500 relative overflow-hidden"
                style={{ height: `${Math.max((day.minutes / maxMinutes) * 100, 4)}%` }}
              >
                <div className="absolute inset-0 bg-sand/30" />
              </div>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{day.label}</span>
          </div>
        ))}
      </div>

      {totalWeek === 0 && (
        <p className="font-serif text-sm text-muted-foreground tracking-wider italic">
          Complete a Pomodoro or timer session to start tracking
        </p>
      )}
    </div>
  );
};

export default FocusStatsDisplay;
