// Focus stats utility - stores daily timer sessions in localStorage

interface FocusSession {
  date: string; // YYYY-MM-DD
  seconds: number;
}

const STORAGE_KEY = "hourglass-focus-stats";

const getToday = () => new Date().toISOString().split("T")[0];

export const addFocusSession = (seconds: number) => {
  const stats = getFocusStats();
  const today = getToday();
  const existing = stats.find((s) => s.date === today);
  if (existing) {
    existing.seconds += seconds;
  } else {
    stats.push({ date: today, seconds });
  }
  // Keep last 7 days only
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const filtered = stats.filter((s) => new Date(s.date) >= cutoff);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getFocusStats = (): FocusSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getLast7Days = (): { label: string; minutes: number }[] => {
  const stats = getFocusStats();
  const days: { label: string; minutes: number }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    const session = stats.find((s) => s.date === dateStr);
    days.push({
      label: dayLabel,
      minutes: session ? Math.round(session.seconds / 60) : 0,
    });
  }
  
  return days;
};
