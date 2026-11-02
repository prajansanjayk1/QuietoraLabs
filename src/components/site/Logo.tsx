import { cn } from "@/lib/utils";

/** Official QuietoraLabs Q Mark symbol */
export function QMark({ className, title = "QuietoraLabs" }: { className?: string; title?: string }) {
  return (
    <img
      src="/assets/quietora-mark.png"
      alt={title}
      className={cn("inline-block object-contain", className)}
      loading="eager"
    />
  );
}

/** Official QuietoraLabs Brand Wordmark */
export function Wordmark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <QMark className="h-8 w-8 shrink-0 drop-shadow-xs" />
      <span
        className={cn(
          "font-display text-[1.2rem] font-semibold tracking-tight",
          light ? "text-navy-foreground" : "text-navy",
        )}
      >
        Quietora<span className={cn("font-medium ml-1", light ? "text-mint" : "text-ocean")}>Labs</span>
      </span>
    </span>
  );
}

/** Official Full QuietoraLabs Logo */
export function FullLogo({ className, alt = "QuietoraLabs" }: { className?: string; alt?: string }) {
  return (
    <img
      src="/assets/quietora-logo-trans.png"
      alt={alt}
      className={cn("h-auto max-w-full object-contain", className)}
    />
  );
}
