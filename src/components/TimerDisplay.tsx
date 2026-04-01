import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import Hourglass from "./Hourglass";

const TimerDisplay = () => {
  const [totalSeconds, setTotalSeconds] = useState(300); // 5 min default
  const [remaining, setRemaining] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [inputMinutes, setInputMinutes] = useState("05");
  const [inputSeconds, setInputSeconds] = useState("00");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining]);

  // Sync remaining to DOM for PiP
  useLayoutEffect(() => {
    const el = document.getElementById("timer-remaining");
    if (el) el.dataset.remaining = String(remaining);
  }, [remaining]);

  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;

  const startTimer = useCallback(() => {
    const mins = parseInt(inputMinutes) || 0;
    const secs = parseInt(inputSeconds) || 0;
    const total = mins * 60 + secs;
    if (total <= 0) return;
    setTotalSeconds(total);
    setRemaining(total);
    setEditMode(false);
    setIsRunning(true);
  }, [inputMinutes, inputSeconds]);

  const togglePause = () => setIsRunning(!isRunning);

  const reset = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
    setEditMode(true);
  };

  const displayMins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const displaySecs = (remaining % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-8">
      <Hourglass progress={progress} isRunning={isRunning} />

      {editMode ? (
        <div className="flex items-center gap-2 font-mono">
          <input
            type="text"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value.replace(/\D/g, "").slice(0, 2))}
            className="w-20 text-center text-6xl md:text-7xl bg-transparent border-b border-border text-foreground focus:outline-none focus:border-sand"
            placeholder="00"
          />
          <span className="text-4xl text-sand-dim">:</span>
          <input
            type="text"
            value={inputSeconds}
            onChange={(e) => setInputSeconds(e.target.value.replace(/\D/g, "").slice(0, 2))}
            className="w-20 text-center text-6xl md:text-7xl bg-transparent border-b border-border text-foreground focus:outline-none focus:border-sand"
            placeholder="00"
          />
        </div>
      ) : (
        <div className="font-mono flex items-baseline">
          <span className="text-7xl md:text-9xl font-light text-foreground">
            {displayMins}
          </span>
          <span className="text-5xl md:text-7xl text-sand-dim animate-pulse mx-1">:</span>
          <span className="text-7xl md:text-9xl font-light text-foreground">
            {displaySecs}
          </span>
        </div>
      )}

      {remaining === 0 && !editMode && (
        <p className="text-sand font-serif text-lg tracking-widest animate-pulse">
          Time's up
        </p>
      )}

      <div className="flex gap-4">
        {editMode ? (
          <Button variant="outline" size="lg" onClick={startTimer} className="font-serif tracking-widest border-sand/30 text-sand hover:bg-sand/10 hover:text-foreground">
            <Play className="w-4 h-4 mr-2" /> Start
          </Button>
        ) : (
          <>
            <Button variant="outline" size="lg" onClick={togglePause} className="font-serif tracking-widest border-sand/30 text-sand hover:bg-sand/10 hover:text-foreground">
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? "Pause" : "Resume"}
            </Button>
            <Button variant="ghost" size="lg" onClick={reset} className="font-serif tracking-widest text-muted-foreground hover:text-foreground">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TimerDisplay;
