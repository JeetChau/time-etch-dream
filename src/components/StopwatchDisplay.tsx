import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

export interface StopwatchHandle {
  isRunning: boolean;
  toggle: () => void;
  reset: () => void;
}

const StopwatchDisplay = () => {
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startTimeRef = useRef(0);
  const animRef = useRef<number>(0);

  const update = useCallback(() => {
    setElapsed(Date.now() - startTimeRef.current);
    animRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsed;
      animRef.current = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, update]);

  // Sync to DOM for PiP
  useEffect(() => {
    const el = document.getElementById("stopwatch-elapsed");
    if (el) el.dataset.elapsed = String(elapsed);
  }, [elapsed]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
  };
  const addLap = () => setLaps((prev) => [elapsed, ...prev]);

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, "0");
    const secs = (totalSecs % 60).toString().padStart(2, "0");
    const centis = Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
    return { mins, secs, centis };
  };

  const { mins, secs, centis } = formatTime(elapsed);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="font-mono flex items-baseline">
        <span className="text-7xl md:text-9xl font-light text-foreground">{mins}</span>
        <span className="text-5xl md:text-7xl text-sand-dim mx-1">:</span>
        <span className="text-7xl md:text-9xl font-light text-foreground">{secs}</span>
        <span className="text-3xl md:text-5xl text-muted-foreground ml-2">.{centis}</span>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={toggle} className="font-serif tracking-widest border-sand/30 text-sand hover:bg-sand/10 hover:text-foreground">
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
        </Button>
        {elapsed > 0 && isRunning && (
          <Button variant="outline" size="lg" onClick={addLap} className="font-serif tracking-widest border-sand/30 text-sand hover:bg-sand/10 hover:text-foreground">
            <Flag className="w-4 h-4 mr-2" /> Lap
          </Button>
        )}
        {elapsed > 0 && !isRunning && (
          <Button variant="ghost" size="lg" onClick={reset} className="font-serif tracking-widest text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        )}
      </div>

      {laps.length > 0 && (
        <div className="w-full max-w-xs max-h-48 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {laps.map((lapTime, i) => {
              const lt = formatTime(lapTime);
              const prevLap = laps[i + 1] || 0;
              const diff = formatTime(lapTime - prevLap);
              return (
                <div key={i} className="flex justify-between font-mono text-sm text-muted-foreground border-b border-border/30 py-1.5">
                  <span className="text-sand-dim">Lap {laps.length - i}</span>
                  <span className="text-sand">+{diff.mins}:{diff.secs}.{diff.centis}</span>
                  <span>{lt.mins}:{lt.secs}.{lt.centis}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div id="stopwatch-elapsed" data-elapsed={elapsed} className="hidden" />
    </div>
  );
};

export default StopwatchDisplay;
