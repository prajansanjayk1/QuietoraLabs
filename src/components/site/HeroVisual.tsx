import { cn } from "@/lib/utils";

/**
 * Pure, Minimalist Brand Mark Hero
 * Simply the iconic Quietora Q with gentle, organic floating and soft ambient light.
 * No gimmicks, no nested rings, no saucer plates, no badges.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-[420px] items-center justify-center py-6 select-none",
        className,
      )}
    >
      {/* Soft, calm ambient light behind the mark */}
      <div
        className="pointer-events-none absolute h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-gradient-to-tr from-mint/20 via-ocean/15 to-transparent blur-3xl opacity-70"
        aria-hidden
      />

      {/* The Quietora Q mark with gentle floating animation */}
      <div className="relative animate-q-float">
        <img
          src="/assets/quietora-mark.png"
          alt="QuietoraLabs"
          className="h-48 w-48 sm:h-64 sm:w-64 lg:h-72 lg:w-72 object-contain drop-shadow-[0_20px_35px_rgba(12,36,65,0.12)] transition-transform duration-500 hover:scale-105"
          loading="eager"
        />
      </div>
    </div>
  );
}
