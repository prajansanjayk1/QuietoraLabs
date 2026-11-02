import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion type="single" collapsible className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
      {items.map((it, i) => (
        <AccordionItem key={it.q} value={`q${i}`} className="border-0">
          <AccordionTrigger className="py-5 text-left font-display text-base font-medium text-navy hover:no-underline">
            {it.q}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
