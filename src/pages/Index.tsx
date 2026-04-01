import { useState, useEffect } from "react";
import ClockDisplay from "@/components/ClockDisplay";
import TimerDisplay from "@/components/TimerDisplay";
import StopwatchDisplay from "@/components/StopwatchDisplay";
import PomodoroDisplay from "@/components/PomodoroDisplay";
import WorldClocksDisplay from "@/components/WorldClocksDisplay";
import FocusStatsDisplay from "@/components/FocusStatsDisplay";
import PipButton from "@/components/PipButton";

type AppMode = "clock" | "timer" | "stopwatch" | "pomodoro" | "world" | "stats";

const modes: { key: AppMode; label: string }[] = [
  { key: "clock", label: "Clock" },
  { key: "timer", label: "Timer" },
  { key: "stopwatch", label: "Stopwatch" },
  { key: "pomodoro", label: "Pomodoro" },
  { key: "world", label: "World" },
  { key: "stats", label: "Stats" },
];

const Index = () => {
  const [mode, setMode] = useState<AppMode>("clock");

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        // Find the main action button and click it
        const btn = document.querySelector<HTMLButtonElement>("[data-action='toggle']");
        btn?.click();
      }
      if (e.code === "KeyR") {
        const btn = document.querySelector<HTMLButtonElement>("[data-action='reset']");
        btn?.click();
      }
      // Number keys 1-6 to switch modes
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6) {
        setMode(modes[num - 1].key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const renderMode = () => {
    switch (mode) {
      case "clock": return <ClockDisplay />;
      case "timer": return <TimerDisplay />;
      case "stopwatch": return <StopwatchDisplay />;
      case "pomodoro": return <PomodoroDisplay />;
      case "world": return <WorldClocksDisplay />;
      case "stats": return <FocusStatsDisplay />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle radial glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Top decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-sand/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-4 w-full max-w-2xl">
        {/* Mode switcher */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-serif text-xs md:text-sm tracking-[0.3em] uppercase">
          {modes.map((m, i) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`transition-all duration-500 border-b pb-1 relative ${
                mode === m.key
                  ? "text-foreground border-sand/50"
                  : "text-muted-foreground border-transparent hover:text-sand"
              }`}
            >
              {m.label}
              <span className="absolute -top-3 right-0 text-[8px] text-sand-dim font-mono opacity-40">
                {i + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Display */}
        <div className="min-h-[400px] flex items-center justify-center w-full">
          {renderMode()}
        </div>

        {/* PiP button */}
        <PipButton mode={mode} />

        {/* Keyboard hint */}
        <div className="flex gap-4 text-[10px] font-mono text-muted-foreground/40 tracking-wider">
          <span>SPACE — play/pause</span>
          <span>R — reset</span>
          <span>1-6 — switch mode</span>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent via-sand/20 to-transparent" />

      {/* Hidden elements for PiP to read state */}
      <div id="timer-remaining" data-remaining="0" className="hidden" />
    </div>
  );
};

export default Index;
