import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PictureInPicture2 } from "lucide-react";

type AppMode = "clock" | "timer" | "stopwatch" | "pomodoro" | "world" | "stats";

interface PipButtonProps {
  mode: AppMode;
}

const PipButton = ({ mode }: PipButtonProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const drawFrame = useCallback((canvas: HTMLCanvasElement, currentMode: string) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    const now = new Date();
    let text: string;
    let label: string = currentMode.toUpperCase();

    if (currentMode === "clock" || currentMode === "world") {
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      const secs = now.getSeconds().toString().padStart(2, "0");
      text = `${hrs}:${mins}:${secs}`;
      label = "CLOCK";
    } else if (currentMode === "timer") {
      const el = document.getElementById("timer-remaining");
      const rem = parseInt(el?.dataset.remaining || "0");
      const m = Math.floor(rem / 60).toString().padStart(2, "0");
      const s = (rem % 60).toString().padStart(2, "0");
      text = `${m}:${s}`;
      label = "TIMER";
    } else if (currentMode === "stopwatch") {
      const el = document.getElementById("stopwatch-elapsed");
      const ms = parseInt(el?.dataset.elapsed || "0");
      const totalSecs = Math.floor(ms / 1000);
      const m = Math.floor(totalSecs / 60).toString().padStart(2, "0");
      const s = (totalSecs % 60).toString().padStart(2, "0");
      text = `${m}:${s}`;
      label = "STOPWATCH";
    } else if (currentMode === "pomodoro") {
      const el = document.getElementById("pomodoro-remaining");
      const rem = parseInt(el?.dataset.remaining || "0");
      const phase = el?.dataset.phase || "work";
      const m = Math.floor(rem / 60).toString().padStart(2, "0");
      const s = (rem % 60).toString().padStart(2, "0");
      text = `${m}:${s}`;
      label = phase === "work" ? "FOCUS" : "BREAK";
    } else {
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      const secs = now.getSeconds().toString().padStart(2, "0");
      text = `${hrs}:${mins}:${secs}`;
    }

    ctx.fillStyle = "#eaeaea";
    ctx.font = "bold 48px 'Space Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    ctx.fillStyle = "#666";
    ctx.font = "14px 'Cormorant Garamond', serif";
    ctx.fillText(label, w / 2, h / 2 + 40);
  }, []);

  const openPip = useCallback(async () => {
    try {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
        canvasRef.current.width = 320;
        canvasRef.current.height = 180;
      }

      if (!videoRef.current) {
        videoRef.current = document.createElement("video");
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
      }

      drawFrame(canvasRef.current, mode);

      const stream = canvasRef.current.captureStream(30);
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      await videoRef.current.requestPictureInPicture();

      // Use setInterval instead of requestAnimationFrame so it keeps
      // running when the browser tab is in the background
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (canvasRef.current) drawFrame(canvasRef.current, mode);
      }, 500);

      videoRef.current.addEventListener("leavepictureinpicture", () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, { once: true });
    } catch (err) {
      console.error("PiP not supported or failed:", err);
    }
  }, [mode, drawFrame]);

  if (mode === "stats") return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={openPip}
      className="text-muted-foreground hover:text-foreground font-serif tracking-widest text-xs"
    >
      <PictureInPicture2 className="w-4 h-4 mr-1" />
      Picture in Picture
    </Button>
  );
};

export default PipButton;
