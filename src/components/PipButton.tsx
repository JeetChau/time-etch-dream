import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PictureInPicture2 } from "lucide-react";

interface PipButtonProps {
  mode: "clock" | "timer";
  timerRemaining?: number;
}

const PipButton = ({ mode, timerRemaining = 0 }: PipButtonProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  const drawFrame = useCallback((canvas: HTMLCanvasElement, currentMode: string, getRemaining: () => number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    const now = new Date();
    let text: string;

    if (currentMode === "clock") {
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      const secs = now.getSeconds().toString().padStart(2, "0");
      text = `${hrs}:${mins}:${secs}`;
    } else {
      const rem = getRemaining();
      const m = Math.floor(rem / 60).toString().padStart(2, "0");
      const s = (rem % 60).toString().padStart(2, "0");
      text = `${m}:${s}`;
    }

    ctx.fillStyle = "#eaeaea";
    ctx.font = "bold 48px 'Space Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    // Subtle label
    ctx.fillStyle = "#666";
    ctx.font = "14px 'Cormorant Garamond', serif";
    ctx.fillText(currentMode === "clock" ? "CLOCK" : "TIMER", w / 2, h / 2 + 40);

    animFrameRef.current = requestAnimationFrame(() => drawFrame(canvas, currentMode, getRemaining));
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

      // Capture remaining via closure that reads from DOM
      let remainingVal = timerRemaining;
      const getRemaining = () => remainingVal;

      // Update remaining periodically
      const updateInterval = setInterval(() => {
        const el = document.getElementById("timer-remaining");
        if (el) remainingVal = parseInt(el.dataset.remaining || "0");
      }, 500);

      drawFrame(canvasRef.current, mode, getRemaining);

      const stream = canvasRef.current.captureStream(30);
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      await videoRef.current.requestPictureInPicture();

      videoRef.current.addEventListener("leavepictureinpicture", () => {
        cancelAnimationFrame(animFrameRef.current);
        clearInterval(updateInterval);
      }, { once: true });
    } catch (err) {
      console.error("PiP not supported or failed:", err);
    }
  }, [mode, timerRemaining, drawFrame]);

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
