import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Wordmark } from "./Logo";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/products", label: "Products" },
  { to: "/projects", label: "Projects" },
  { to: "/partners", label: "Partners" },
  { to: "/about", label: "About" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all",
        scrolled ? "glass shadow-soft" : "border-b border-transparent bg-transparent",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="container-q flex h-16 items-center justify-between gap-6">
        <Link to="/" aria-label="QuietoraLabs home">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3.5 py-2 text-sm text-charcoal/80 transition-colors hover:bg-secondary hover:text-navy"
              activeProps={{ className: "bg-secondary text-navy font-medium" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild size="sm" className="rounded-full px-4">
            <Link to="/products/quietora-focus" hash="early-access">Join Focus early access</Link>
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-sm bg-background">
            <SheetTitle className="sr-only">Site menu</SheetTitle>
            <SheetDescription className="sr-only">Navigate QuietoraLabs pages</SheetDescription>
            <div className="mt-2"><Wordmark /></div>
            <nav aria-label="Mobile" className="mt-8 flex flex-col">
              {[{ to: "/", label: "Home" }, ...NAV].map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-border py-4 font-display text-xl text-navy"
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-ocean" }}
                >
                  {n.label}
                  <ArrowUpRight className="h-4 w-4 opacity-40" />
                </Link>
              ))}
            </nav>
            <Button asChild className="mt-8 w-full rounded-full" size="lg">
              <Link to="/products/quietora-focus" hash="early-access" onClick={() => setOpen(false)}>
                Join Focus early access
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
