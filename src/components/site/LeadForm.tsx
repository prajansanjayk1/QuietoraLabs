import { useState, type FormEvent } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { leadSchema, pathwayErrors, type LeadKind } from "@/lib/lead-schema";
import { submitLead } from "@/lib/submissions.functions";
import { cn } from "@/lib/utils";

type Field =
  | { name: "organization" | "roleTitle"; label: string; required?: boolean; placeholder?: string; options?: readonly string[] }
  | { name: "enquiryType"; label: string; required?: boolean; options: readonly string[] }
  | { name: "message"; label: string; required?: boolean; placeholder?: string }
  | { name: `details.${string}`; label: string; placeholder?: string; options?: readonly string[] };

const successCopy: Record<LeadKind, { title: string; body: string; dup: string }> = {
  early_access: {
    title: "You're on the early access list.",
    body: "Your details are saved. We'll reach out when there's a Focus build worth your time — no spam in between.",
    dup: "This email is already on the Focus early access list. Nothing more to do.",
  },
  partnership: {
    title: "Partnership enquiry received.",
    body: "Your enquiry is saved with our team. We read every one personally and reply when we can offer a useful conversation.",
    dup: "",
  },
  contact: {
    title: "Message received.",
    body: "Your message is saved and will be read by a person on our team. We don't send automated replies.",
    dup: "",
  },
};

export function LeadForm({
  kind,
  fields,
  submitLabel,
  className,
  initial,
}: {
  initial?: Record<string, string> | undefined;
  kind: LeadKind;
  fields: Field[];
  submitLabel: string;
  className?: string | undefined;
}) {
  const submit = useServerFn(submitLead);
  const location = useLocation();
  const [values, setValues] = useState<Record<string, string>>(initial ?? {});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(initial ?? {});
  const [state, setState] = useState<"idle" | "sending" | "done" | "dup" | "error">("idle");
  const [formError, setFormError] = useState("");
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const details: Record<string, string> = {};
    for (const [k, v] of Object.entries(values)) if (k.startsWith("details.") && v) details[k.slice(8)] = v;
    const payload = {
      kind,
      name: values["name"] ?? "",
      email: values["email"] ?? "",
      organization: values["organization"],
      roleTitle: values["roleTitle"],
      enquiryType: values["enquiryType"],
      message: values["message"],
      details,
      consent: consent as true,
      sourcePath: location.pathname,
      website: values["website"],
    };
    const parsed = leadSchema.safeParse(payload);
    const fe: Record<string, string> = {};
    if (!parsed.success) for (const i of parsed.error.issues) fe[String(i.path[0])] = i.message;
    else Object.assign(fe, pathwayErrors(parsed.data));
    setErrors(fe);
    if (Object.keys(fe).length) {
      setFormError("Please check the highlighted fields.");
      return;
    }
    setState("sending");
    setFormError("");
    try {
      const res = await submit({ data: payload });
      if (res.ok) setState(res.duplicate ? "dup" : "done");
      else {
        setErrors(res.fieldErrors ?? {});
        setFormError(res.error);
        setState("error");
      }
    } catch {
      setFormError("Something went wrong on our side. Please try again in a moment.");
      setState("error");
    }
  }

  if (state === "done" || state === "dup") {
    const c = successCopy[kind];
    return (
      <div role="status" className={cn("rounded-2xl border border-mint/50 bg-mint-soft p-8", className)}>
        <CheckCircle2 className="h-8 w-8 text-success" />
        <h3 className="mt-4 text-2xl font-semibold text-navy">{state === "dup" ? "Already signed up." : c.title}</h3>
        <p className="mt-2 leading-relaxed text-charcoal">{state === "dup" ? c.dup : c.body}</p>
        <Button variant="outline" className="mt-6 rounded-full" onClick={() => { setValues(initial ?? {}); setConsent(false); setState("idle"); }}>
          Send another
        </Button>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${kind}-${k}-err`} className="mt-1.5 text-xs text-destructive">{errors[k]}</p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className={cn("space-y-5", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        {(["name", "email"] as const).map((k) => (
          <div key={k}>
            <Label htmlFor={`${kind}-${k}`}>{k === "name" ? "Full name" : "Email"} <span className="text-ocean">*</span></Label>
            <Input
              id={`${kind}-${k}`}
              type={k === "email" ? "email" : "text"}
              autoComplete={k}
              maxLength={k === "name" ? 120 : 254}
              value={values[k] ?? ""}
              onChange={(e) => set(k, e.target.value)}
              aria-invalid={!!errors[k]}
              aria-describedby={errors[k] ? `${kind}-${k}-err` : undefined}
              className="mt-1.5 h-11 bg-card"
            />
            {err(k)}
          </div>
        ))}
      </div>
      {fields.map((f) => {
        const id = `${kind}-${f.name}`;
        const key = f.name.startsWith("details.") ? f.name : f.name;
        const required = "required" in f && f.required;
        const label = (
          <Label htmlFor={id}>
            {f.label} {required ? <span className="text-ocean">*</span> : <span className="text-muted-foreground font-normal">(optional)</span>}
          </Label>
        );
        if ("options" in f && f.options) {
          return (
            <div key={f.name}>
              {label}
              <select
                id={id}
                value={values[key] ?? ""}
                onChange={(e) => set(key, e.target.value)}
                aria-invalid={!!errors[key]}
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-card px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select…</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {err(key)}
            </div>
          );
        }
        if (f.name === "message") {
          return (
            <div key={f.name}>
              {label}
              <Textarea
                id={id}
                rows={5}
                maxLength={4000}
                placeholder={f.placeholder}
                value={values["message"] ?? ""}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={!!errors["message"]}
                className="mt-1.5 bg-card"
              />
              {err("message")}
            </div>
          );
        }
        return (
          <div key={f.name}>
            {label}
            <Input
              id={id}
              maxLength={160}
              placeholder={"placeholder" in f ? f.placeholder : undefined}
              value={values[key] ?? ""}
              onChange={(e) => set(key, e.target.value)}
              aria-invalid={!!errors[key]}
              className="mt-1.5 h-11 bg-card"
            />
            {err(key)}
          </div>
        );
      })}
      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={values["website"] ?? ""} onChange={(e) => set("website", e.target.value)} /></label>
      </div>
      <div>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/60 p-4">
          <Checkbox id={`${kind}-consent`} checked={consent} onCheckedChange={(v) => setConsent(v === true)} aria-invalid={!!errors["consent"]} className="mt-0.5" />
          <Label htmlFor={`${kind}-consent`} className="text-sm font-normal leading-relaxed text-charcoal">
            I agree that QuietoraLabs may store these details to respond to me, as described in the{" "}
            <Link to="/privacy" className="text-ocean underline underline-offset-2">privacy notice</Link>. No marketing lists, no selling data.
          </Label>
        </div>
        {err("consent")}
      </div>
      {formError && (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {formError}
        </p>
      )}
      <Button type="submit" size="lg" disabled={state === "sending"} className="w-full sm:w-auto">
        {state === "sending" && <Loader2 className="animate-spin" />} {submitLabel}
      </Button>
    </form>
  );
}
