import { useState } from "react";
import ClockDisplay from "@/components/ClockDisplay";
import TimerDisplay from "@/components/TimerDisplay";
import PipButton from "@/components/PipButton";

const Index = () => {
  const [mode, setMode] = useState<"clock" | "timer">("clock");
  const [timerRemaining, setTimerRemaining] = useState(0);

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
      <div className="relative z-10 flex flex-col items-center gap-12 px-4">
        {/* Mode switcher */}
        <div className="flex gap-8 font-serif text-sm tracking-[0.4em] uppercase">
          <button
            onClick={() => setMode("clock")}
            className={`transition-all duration-500 border-b pb-1 ${
              mode === "clock"
                ? "text-foreground border-sand/50"
                : "text-muted-foreground border-transparent hover:text-sand"
            }`}
          >
            Clock
          </button>
          <button
            onClick={() => setMode("timer")}
            className={`transition-all duration-500 border-b pb-1 ${
              mode === "timer"
                ? "text-foreground border-sand/50"
                : "text-muted-foreground border-transparent hover:text-sand"
            }`}
          >
            Timer
          </button>
        </div>

        {/* Display */}
        <div className="min-h-[400px] flex items-center justify-center">
          {mode === "clock" ? <ClockDisplay /> : <TimerDisplay />}
        </div>

        {/* PiP button */}
        <PipButton mode={mode} timerRemaining={timerRemaining} />
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent via-sand/20 to-transparent" />

      {/* Hidden element for PiP to read timer state */}
      <div id="timer-remaining" data-remaining={timerRemaining} className="hidden" />
    </div>
  );
};

export default Index;
