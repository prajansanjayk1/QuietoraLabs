import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "Quick", min: 1 },
  { label: "Pomodoro", min: 25 },
  { label: "Deep work", min: 50 },
  { label: "Exam prep", min: 90 },
];

export function formatClock(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Browser-only demonstration. Does NOT block apps or websites. */
export function FocusTimer({ compact = false }: { compact?: boolean }) {
  const [preset, setPreset] = useState(1);
  const total = (PRESETS[preset]?.min ?? 25) * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const endAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + left * 1000;
    const id = window.setInterval(() => {
      const rem = Math.max(0, Math.round(((endAt.current ?? 0) - Date.now()) / 1000));
      setLeft(rem);
      if (rem === 0) {
        setRunning(false);
        setDone((d) => d + 1);
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const choose = (i: number) => {
    setPreset(i);
    setRunning(false);
    setLeft((PRESETS[i]?.min ?? 25) * 60);
  };
  const reset = () => {
    setRunning(false);
    setLeft(total);
  };
  const pct = 1 - left / total;
  const R = 88;
  const C = 2 * Math.PI * R;

  return (
    <div className={cn("rounded-3xl bg-navy-gradient p-6 text-navy-foreground shadow-lift md:p-8", compact && "p-5")}>
      <div className="flex items-center justify-between">
        <p className="eyebrow text-mint">Focus session</p>
        <span className="rounded-full border border-navy-foreground/20 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-navy-foreground/70">
          Browser-only demonstration
        </span>
      </div>
      <div role="radiogroup" aria-label="Session length" className="mt-5 flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            role="radio"
            aria-checked={i === preset}
            onClick={() => choose(i)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs transition-colors",
              i === preset ? "bg-mint text-navy font-semibold" : "bg-navy-foreground/8 text-navy-foreground/75 hover:bg-navy-foreground/15",
            )}
          >
            {p.label} · {p.min}m
          </button>
        ))}
      </div>
      <div className="relative mx-auto mt-6 grid h-56 w-56 place-items-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="100" cy="100" r={R} stroke="currentColor" strokeOpacity="0.12" strokeWidth="6" fill="none" />
          <circle
            cx="100" cy="100" r={R}
            stroke="var(--mint)" strokeWidth="6" fill="none" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        </svg>
        <div className="text-center">
          <p className="font-mono text-5xl font-medium tabular-nums" aria-live="polite" aria-atomic>
            {formatClock(left)}
          </p>
          <p className="mt-1 text-xs text-navy-foreground/60">
            {left === 0 ? "Session complete" : running ? "Stay with it" : "Ready when you are"}
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="mint" size="lg" onClick={() => (left === 0 ? reset() : setRunning((r) => !r))} aria-label={running ? "Pause session" : "Start session"}>
          {running ? <Pause /> : <Play />} {running ? "Pause" : left === 0 ? "Restart" : "Start"}
        </Button>
        <Button variant="outline-light" size="lg" onClick={reset} aria-label="Reset session">
          <RotateCcw /> Reset
        </Button>
      </div>
      <p className="mt-5 text-center text-xs leading-relaxed text-navy-foreground/55">
        Sessions completed this visit: <span className="font-mono text-mint">{done}</span>. Nothing is blocked
        and nothing leaves your browser — the real blocking engine is being built for Windows.
      </p>
    </div>
  );
}
