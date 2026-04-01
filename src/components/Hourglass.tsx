import { useEffect, useRef } from "react";

interface HourglassProps {
  progress?: number; // 0-1, for timer mode
  isRunning?: boolean;
}

const Hourglass = ({ progress = 0.5, isRunning = false }: HourglassProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Hourglass frame
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;

    // Top triangle
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy - 80);
    ctx.lineTo(cx + 50, cy - 80);
    ctx.lineTo(cx + 4, cy - 4);
    ctx.lineTo(cx - 4, cy - 4);
    ctx.closePath();
    ctx.stroke();

    // Bottom triangle
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 80);
    ctx.lineTo(cx + 50, cy + 80);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.closePath();
    ctx.stroke();

    // Top sand (depleting)
    const topSandHeight = (1 - progress) * 60;
    if (topSandHeight > 0) {
      const topWidth = (topSandHeight / 60) * 42;
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.moveTo(cx - topWidth, cy - 80);
      ctx.lineTo(cx + topWidth, cy - 80);
      ctx.lineTo(cx + (topWidth * (1 - topSandHeight / 76) * 0.1), cy - 80 + topSandHeight);
      ctx.lineTo(cx - (topWidth * (1 - topSandHeight / 76) * 0.1), cy - 80 + topSandHeight);
      ctx.closePath();
      ctx.fill();
    }

    // Bottom sand (accumulating)
    const bottomSandHeight = progress * 60;
    if (bottomSandHeight > 0) {
      const bottomWidth = (bottomSandHeight / 60) * 42;
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.moveTo(cx - bottomWidth, cy + 80);
      ctx.lineTo(cx + bottomWidth, cy + 80);
      ctx.lineTo(cx + (bottomWidth * (1 - bottomSandHeight / 76) * 0.1), cy + 80 - bottomSandHeight);
      ctx.lineTo(cx - (bottomWidth * (1 - bottomSandHeight / 76) * 0.1), cy + 80 - bottomSandHeight);
      ctx.closePath();
      ctx.fill();
    }

    // Falling sand stream
    if (isRunning && progress < 1) {
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 4);
      ctx.lineTo(cx, cy + 4);
      ctx.stroke();
    }

    // Top & bottom caps
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 55, cy - 80);
    ctx.lineTo(cx + 55, cy - 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 55, cy + 80);
    ctx.lineTo(cx + 55, cy + 80);
    ctx.stroke();
  }, [progress, isRunning]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="opacity-60"
    />
  );
};

export default Hourglass;
