import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import Hourglass from "./Hourglass";
import { addFocusSession } from "@/lib/focusStats";

type Phase = "work" | "break";

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const PomodoroDisplay = () => {
  const [phase, setPhase] = useState<Phase>("work");
  const [remaining, setRemaining] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const totalForPhase = phase === "work" ? WORK_DURATION : BREAK_DURATION;
  const progress = 1 - remaining / totalForPhase;

  const playChime = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 600;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {}
  }, []);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playChime();
            // Auto-switch phase
            if (phase === "work") {
              addFocusSession(WORK_DURATION);
              setCompletedCycles((c) => c + 1);
              setPhase("break");
              return BREAK_DURATION;
            } else {
              setPhase("work");
              return WORK_DURATION;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining, phase, playChime]);

  // Sync to DOM for PiP
  useEffect(() => {
    const el = document.getElementById("pomodoro-remaining");
    if (el) {
      el.dataset.remaining = String(remaining);
      el.dataset.phase = phase;
    }
  }, [remaining, phase]);

  const toggle = () => setIsRunning(!isRunning);
  const skip = () => {
    setIsRunning(false);
    if (phase === "work") {
      setPhase("break");
      setRemaining(BREAK_DURATION);
    } else {
      setPhase("work");
      setRemaining(WORK_DURATION);
    }
  };
  const reset = () => {
    setIsRunning(false);
    setPhase("work");
    setRemaining(WORK_DURATION);
    setCompletedCycles(0);
  };

  const displayMins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const displaySecs = (remaining % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Phase indicator */}
      <div className="flex items-center gap-4">
        <span className={`font-serif text-sm tracking-[0.3em] uppercase transition-colors ${phase === "work" ? "text-foreground" : "text-muted-foreground"}`}>
          Work
        </span>
        <div className="w-8 h-px bg-border" />
        <span className={`font-serif text-sm tracking-[0.3em] uppercase transition-colors ${phase === "break" ? "text-foreground" : "text-muted-foreground"}`}>
          Break
        </span>
      </div>

      <Hourglass progress={progress} isRunning={isRunning} />

      <div className="font-mono flex items-baseline">
        <span className="text-7xl md:text-9xl font-light text-foreground">{displayMins}</span>
        <span className="text-5xl md:text-7xl text-sand-dim animate-pulse mx-1">:</span>
        <span className="text-7xl md:text-9xl font-light text-foreground">{displaySecs}</span>
      </div>

      {/* Cycle dots */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < completedCycles ? "bg-sand" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={toggle} className="font-serif tracking-widest border-sand/30 text-sand hover:bg-sand/10 hover:text-foreground">
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="ghost" size="lg" onClick={skip} className="font-serif tracking-widest text-muted-foreground hover:text-foreground">
          <SkipForward className="w-4 h-4 mr-2" /> Skip
        </Button>
        <Button variant="ghost" size="lg" onClick={reset} className="font-serif tracking-widest text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
      </div>

      <div id="pomodoro-remaining" data-remaining={remaining} data-phase={phase} className="hidden" />
    </div>
  );
};

export default PomodoroDisplay;
