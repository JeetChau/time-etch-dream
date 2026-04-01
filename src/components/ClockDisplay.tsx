import { useState, useEffect } from "react";

const ClockDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground font-serif text-sm tracking-[0.3em] uppercase">
        {dateStr}
      </p>
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-7xl md:text-9xl font-light tracking-tight text-foreground">
          {hours}
        </span>
        <span className="text-5xl md:text-7xl text-sand-dim animate-pulse">:</span>
        <span className="text-7xl md:text-9xl font-light tracking-tight text-foreground">
          {minutes}
        </span>
        <span className="text-3xl md:text-5xl text-muted-foreground ml-2">
          {seconds}
        </span>
      </div>
    </div>
  );
};

export default ClockDisplay;
