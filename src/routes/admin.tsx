import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Shield,
  ShieldAlert,
  Inbox,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  LogOut,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  Search,
  MessageCircle,
  Phone,
  Copy,
  Check,
  Briefcase,
  Calendar,
  User,
  Sparkles,
  MapPin,
  PlusCircle,
  Trash2,
  Save,
  X,
  FileText,
  Eye,
  Sliders,
  Edit3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminStatus,
  listSubmissions,
  updateSubmissionStatus,
  createSubmissionAdmin,
  deleteSubmissionAdmin,
  updateSubmissionDetailsAdmin,
} from "@/lib/submissions.functions";
import {
  listAllJobPostingsAdmin,
  saveJobPostingAdmin,
  deleteJobPostingAdmin,
  type JobPosting,
  DEFAULT_JOB_POSTINGS,
} from "@/lib/jobs.functions";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () =>
    pageMeta(
      "Operator Admin",
      "Restricted operator access and lead management portal for QuietoraLabs.",
    ),
  component: AdminPage,
});

type SubmissionRow = Database["public"]["Tables"]["submissions"]["Row"];
type SubmissionStatus = Database["public"]["Enums"]["submission_status"];
type SubmissionKind = Database["public"]["Enums"]["submission_kind"];
type FilterTab = "all" | "early_access" | "partnership" | "contact" | "careers";
type AdminSection = "inbox" | "jobs" | "candidates";

function isCareerSubmission(s: SubmissionRow): boolean {
  if (s.kind !== "contact") return false;
  if (s.enquiry_type === "Careers") return true;
  if (s.source_path === "/careers" || s.source_path === "/careers/apply") return true;
  if (s.details && typeof s.details === "object" && !Array.isArray(s.details)) {
    const d = s.details as Record<string, unknown>;
    if ("appliedRole" in d || "resumeUrl" in d || "portfolioUrl" in d || "referenceId" in d) return true;
  }
  return false;
}

function AdminPage() {
  const getAdminStatusFn = useServerFn(getAdminStatus);
  const listSubmissionsFn = useServerFn(listSubmissions);
  const updateStatusFn = useServerFn(updateSubmissionStatus);
  const createSubmissionFn = useServerFn(createSubmissionAdmin);
  const deleteSubmissionFn = useServerFn(deleteSubmissionAdmin);
  const updateDetailsFn = useServerFn(updateSubmissionDetailsAdmin);

  // Jobs Server Functions
  const listJobsAdminFn = useServerFn(listAllJobPostingsAdmin);
  const saveJobAdminFn = useServerFn(saveJobPostingAdmin);
  const deleteJobAdminFn = useServerFn(deleteJobPostingAdmin);

  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(DEFAULT_JOB_POSTINGS);
  const [fetchingLeads, setFetchingLeads] = useState(false);
  const [fetchingJobs, setFetchingJobs] = useState(false);

  // Top Section Switcher
  const [activeSection, setActiveSection] = useState<AdminSection>("inbox");

  // Auth form state
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Filters & search
  const [kindFilter, setKindFilter] = useState<FilterTab>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | SubmissionStatus>("all");
  const [candidateRoleFilter, setCandidateRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Create Inbound Lead Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createKind, setCreateKind] = useState<"early_access" | "partnership" | "contact" | "careers">("contact");
  const [createStatus, setCreateStatus] = useState<SubmissionStatus>("new");
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createOrg, setCreateOrg] = useState("");
  const [createRole, setCreateRole] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [createNotes, setCreateNotes] = useState("");
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Job Posting Modal State (Create / Edit)
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDepartment, setJobDepartment] = useState("Core Desktop Engine");
  const [jobLocation, setJobLocation] = useState("Remote (India) / Bengaluru");
  const [jobType, setJobType] = useState("Full-time");
  const [jobExperience, setJobExperience] = useState("2-5 years");
  const [jobSalary, setJobSalary] = useState("₹18L - ₹28L CTC + Equity");
  const [jobSummary, setJobSummary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobResponsibilitiesText, setJobResponsibilitiesText] = useState("");
  const [jobRequirementsText, setJobRequirementsText] = useState("");
  const [jobPerksText, setJobPerksText] = useState("");
  const [jobStatus, setJobStatus] = useState<"published" | "draft" | "closed">("published");
  const [savingJob, setSavingJob] = useState(false);
  const [jobError, setJobError] = useState("");

  // Edit / Notes state per row
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  // Check auth and admin role
  async function checkAuthAndRole() {
    setLoading(true);
    setAuthError("");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setSessionUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setSessionUser({ id: user.id, email: user.email ?? "" });

      // Check admin status via server function with client-side table fallback
      let verifiedAdmin = false;
      try {
        const res = await getAdminStatusFn();
        if (res.isAdmin) verifiedAdmin = true;
      } catch (err: unknown) {
        console.warn("Server admin check failed, trying client verification:", err);
      }

      if (!verifiedAdmin) {
        try {
          const { data: roleRow } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "admin")
            .maybeSingle();
          if (roleRow) verifiedAdmin = true;
        } catch (e: unknown) {
          console.warn("Client role verification also failed:", e);
        }
      }

      setIsAdmin(verifiedAdmin);
      if (verifiedAdmin) {
        await Promise.all([loadLeads(), loadJobs()]);
      }
    } catch (e: unknown) {
      console.error("Auth check failed:", e);
      setSessionUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadLeads() {
    setFetchingLeads(true);
    try {
      const leads = await listSubmissionsFn();
      setSubmissions(leads as SubmissionRow[]);
    } catch (err: unknown) {
      console.warn("Server listSubmissions failed, trying client query:", err);
      try {
        const { data: clientLeads, error } = await supabase
          .from("submissions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500);
        if (!error && clientLeads) {
          setSubmissions(clientLeads as SubmissionRow[]);
        }
      } catch (fallbackErr: unknown) {
        console.error("Direct client query also failed:", fallbackErr);
      }
    } finally {
      setFetchingLeads(false);
    }
  }

  async function loadJobs() {
    setFetchingJobs(true);
    try {
      const jobs = await listJobsAdminFn();
      if (jobs && jobs.length > 0) {
        setJobPostings(jobs);
      }
    } catch (err: unknown) {
      console.warn("Failed to load jobs:", err);
    } finally {
      setFetchingJobs(false);
    }
  }

  useEffect(() => {
    checkAuthAndRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSessionUser({ id: session.user.id, email: session.user.email ?? "" });
      } else {
        setSessionUser(null);
        setIsAdmin(false);
        setSubmissions([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthNotice("");
    setSubmittingAuth(true);

    try {
      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.user) {
          setEmail("");
          setPassword("");
          await checkAuthAndRole();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setAuthNotice(
          `Account created for ${data.user?.email}. By default, Supabase requires email confirmation before signing in. Check your inbox or run the confirmation SQL command below in your PostgreSQL console. Then grant the admin role.`,
        );
        setAuthMode("signin");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setAuthError(msg);
    } finally {
      setSubmittingAuth(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSessionUser(null);
    setIsAdmin(false);
    setSubmissions([]);
  }

  async function handleStatusChange(id: string, newStatus: SubmissionStatus) {
    setUpdatingId(id);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus, updated_at: new Date().toISOString() } : s)),
    );

    try {
      await updateStatusFn({ data: { id, status: newStatus } });
    } catch (err: unknown) {
      console.error("Failed to update status:", err);
      await loadLeads();
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to permanently delete this submission record?")) return;
    setDeletingId(id);
    try {
      await deleteSubmissionFn({ data: { id } });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      alert("Failed to delete record: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveNotes(s: SubmissionRow) {
    const detailsMap = (s.details && typeof s.details === "object" && !Array.isArray(s.details)
      ? (s.details as Record<string, string>)
      : {}) as Record<string, string>;
    const currentNote = editingNotes[s.id] ?? (detailsMap["notes"] || "");
    setSavingNoteId(s.id);
    try {
      const currentDetails = (s.details && typeof s.details === "object" && !Array.isArray(s.details)
        ? { ...s.details }
        : {}) as Record<string, unknown>;

      currentDetails["notes"] = currentNote;
      currentDetails["notesUpdatedBy"] = sessionUser?.email;
      currentDetails["notesUpdatedAt"] = new Date().toISOString();

      await updateDetailsFn({
        data: {
          id: s.id,
          details: currentDetails,
        },
      });

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === s.id ? { ...item, details: currentDetails as unknown as SubmissionRow["details"] } : item,
        ),
      );
    } catch (err: unknown) {
      console.error("Failed to save note:", err);
      alert("Failed to save note: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setSavingNoteId(null);
    }
  }

  async function handleCreateLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");

    if (!createName.trim() || !createEmail.trim()) {
      setCreateError("Name and Email are required.");
      return;
    }

    setCreatingLoading(true);
    try {
      const details: Record<string, unknown> = {};
      if (createPhone.trim()) details["phone"] = createPhone.trim();
      if (createNotes.trim()) {
        details["notes"] = createNotes.trim();
        details["notesCreatedBy"] = sessionUser?.email;
      }

      const res = await createSubmissionFn({
        data: {
          kind: createKind === "careers" ? "contact" : createKind,
          status: createStatus,
          name: createName.trim(),
          email: createEmail.trim(),
          organization: createOrg.trim() || undefined,
          role_title: createRole.trim() || undefined,
          enquiry_type: createKind === "careers" ? "Careers" : createKind === "early_access" ? "Early Access" : createKind === "partnership" ? "Partnership" : "General enquiry",
          message: createMessage.trim() || undefined,
          details,
        },
      });

      if (res.ok && res.data) {
        setSubmissions((prev) => [res.data as SubmissionRow, ...prev]);
        setShowCreateModal(false);
        setCreateName("");
        setCreateEmail("");
        setCreatePhone("");
        setCreateOrg("");
        setCreateRole("");
        setCreateMessage("");
        setCreateNotes("");
        setExpandedId(res.data.id);
      }
    } catch (err: unknown) {
      console.error("Failed to create submission:", err);
      setCreateError(err instanceof Error ? err.message : "Creation failed");
    } finally {
      setCreatingLoading(false);
    }
  }

  // Handle Open Create / Edit Job Modal
  function handleOpenJobModal(jobToEdit?: JobPosting) {
    setJobError("");
    if (jobToEdit) {
      setEditingJobId(jobToEdit.id);
      setJobTitle(jobToEdit.title);
      setJobDepartment(jobToEdit.department);
      setJobLocation(jobToEdit.location);
      setJobType(jobToEdit.type);
      setJobExperience(jobToEdit.experience_level);
      setJobSalary(jobToEdit.salary_range || "");
      setJobSummary(jobToEdit.summary);
      setJobDescription(jobToEdit.description);
      setJobResponsibilitiesText(jobToEdit.responsibilities.join("\n"));
      setJobRequirementsText(jobToEdit.requirements.join("\n"));
      setJobPerksText(jobToEdit.perks.join("\n"));
      setJobStatus(jobToEdit.status);
    } else {
      setEditingJobId(null);
      setJobTitle("");
      setJobDepartment("Core Desktop Engine");
      setJobLocation("Remote (India) / Bengaluru");
      setJobType("Full-time");
      setJobExperience("2-5 years");
      setJobSalary("₹18L - ₹28L CTC + Equity");
      setJobSummary("");
      setJobDescription("");
      setJobResponsibilitiesText("");
      setJobRequirementsText("");
      setJobPerksText("");
      setJobStatus("published");
    }
    setShowJobModal(true);
  }

  // Handle Save Job Posting (Admin)
  async function handleSaveJobSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJobError("");

    if (!jobTitle.trim() || !jobDepartment.trim() || !jobSummary.trim() || !jobDescription.trim()) {
      setJobError("Title, Department, Summary and Description are required.");
      return;
    }

    setSavingJob(true);
    try {
      const responsibilities = jobResponsibilitiesText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const requirements = jobRequirementsText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const perks = jobPerksText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const res = await saveJobAdminFn({
        data: {
          id: editingJobId || undefined,
          title: jobTitle.trim(),
          department: jobDepartment.trim(),
          location: jobLocation.trim(),
          type: jobType,
          experience_level: jobExperience,
          salary_range: jobSalary.trim() || undefined,
          summary: jobSummary.trim(),
          description: jobDescription.trim(),
          responsibilities,
          requirements,
          perks,
          status: jobStatus,
        },
      });

      if (res && res.ok && res.job) {
        setShowJobModal(false);
        await loadJobs();
      }
    } catch (err: unknown) {
      console.error("Save job error:", err);
      setJobError(err instanceof Error ? err.message : "Failed to save job opening.");
    } finally {
      setSavingJob(false);
    }
  }

  // Handle Delete Job Posting
  async function handleDeleteJob(jobId: string, title: string) {
    if (!confirm(`Are you sure you want to delete the job opening "${title}"?`)) return;
    try {
      await deleteJobAdminFn({ data: { id: jobId } });
      setJobPostings((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: unknown) {
      console.error("Delete job failed:", err);
      alert("Failed to delete job: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  }

  function exportCSV() {
    if (submissions.length === 0) return;
    const headers = ["ID", "Kind", "Status", "Name", "Email", "Organization", "Role", "Enquiry Type", "Message", "Details", "Created At"];
    const rows = submissions.map((s) => [
      s.id,
      isCareerSubmission(s) ? "career_application" : s.kind,
      s.status,
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${(s.email || "").replace(/"/g, '""')}"`,
      `"${(s.organization || "").replace(/"/g, '""')}"`,
      `"${(s.role_title || "").replace(/"/g, '""')}"`,
      `"${(s.enquiry_type || "").replace(/"/g, '""')}"`,
      `"${(s.message || "").replace(/"/g, '""')}"`,
      `"${JSON.stringify(s.details || {}).replace(/"/g, '""')}"`,
      s.created_at,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quietoralabs-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Metrics
  const metrics = useMemo(() => {
    const total = submissions.length;
    const earlyAccess = submissions.filter((s) => s.kind === "early_access").length;
    const partnerships = submissions.filter((s) => s.kind === "partnership").length;
    const careers = submissions.filter(isCareerSubmission).length;
    const contact = submissions.filter((s) => s.kind === "contact" && !isCareerSubmission(s)).length;
    const pendingReview = submissions.filter((s) => s.status === "new" || s.status === "in_review").length;
    return { total, earlyAccess, partnerships, careers, contact, pendingReview };
  }, [submissions]);

  // Candidates list
  const candidateSubmissions = useMemo(() => {
    return submissions.filter(isCareerSubmission);
  }, [submissions]);

  // Filtered Leads
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const isJobApp = isCareerSubmission(s);
      if (kindFilter === "careers") {
        if (!isJobApp) return false;
      } else if (kindFilter !== "all") {
        if (s.kind !== kindFilter || isJobApp) return false;
      }

      if (statusFilter !== "all" && s.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const detailsStr = JSON.stringify(s.details || {}).toLowerCase();
        const match =
          (s.name || "").toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q) ||
          (s.organization || "").toLowerCase().includes(q) ||
          (s.role_title || "").toLowerCase().includes(q) ||
          (s.message || "").toLowerCase().includes(q) ||
          detailsStr.includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [submissions, kindFilter, statusFilter, searchQuery]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidateSubmissions.filter((c) => {
      if (candidateRoleFilter !== "all") {
        const d = (c.details as Record<string, unknown>) || {};
        const role = c.role_title || (d["appliedRole"] as string) || "";
        if (!role.toLowerCase().includes(candidateRoleFilter.toLowerCase())) return false;
      }

      if (statusFilter !== "all" && c.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const detailsStr = JSON.stringify(c.details || {}).toLowerCase();
        const match =
          (c.name || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q) ||
          (c.role_title || "").toLowerCase().includes(q) ||
          (c.message || "").toLowerCase().includes(q) ||
          detailsStr.includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [candidateSubmissions, candidateRoleFilter, statusFilter, searchQuery]);

  const grantSql = sessionUser
    ? `insert into public.user_roles (user_id, role) values ('${sessionUser.id}', 'admin') on conflict do nothing;`
    : "-- Sign in to generate role grant SQL";

  return (
    <div className="relative min-h-screen bg-sand/30 text-navy pb-24">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Banner */}
      <div className="relative border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white shadow-xs">
              <Shield className="h-4 w-4 text-mint" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-navy">QuietoraLabs</span>
                <Badge variant="outline" className="border-ocean/30 bg-ocean/5 text-[0.65rem] text-ocean font-mono">
                  Operator Studio Portal
                </Badge>
              </div>
              <p className="text-[0.7rem] text-muted-foreground font-mono">
                PostgreSQL & Supabase Self-Hosted Backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {sessionUser && (
              <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground">
                {sessionUser.email}
              </span>
            )}
            {sessionUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5 rounded-xl text-xs h-8 text-muted-foreground hover:text-navy"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-8">
        {/* State 1: Loading Session */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-ocean" />
            <p className="text-xs text-muted-foreground font-mono">Verifying operator credentials...</p>
          </div>
        )}

        {/* State 2: Not Signed In */}
        {!loading && !sessionUser && (
          <div className="mx-auto mt-12 max-w-md">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lift">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
                  <Shield className="h-6 w-6 text-mint" />
                </div>
                <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-navy">
                  Operator Sign-In
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Secure administration access for QuietoraLabs studio founders and staff.
                </p>
              </div>

              {authError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800">
                  {authError}
                </div>
              )}

              {authNotice && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-800">
                  {authNotice}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="auth-email" className="text-xs font-medium text-navy">
                    Email Address
                  </Label>
                  <Input
                    id="auth-email"
                    type="email"
                    placeholder="operator@quietoralabs.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-border bg-secondary/30 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="auth-password" className="text-xs font-medium text-navy">
                    Password
                  </Label>
                  <Input
                    id="auth-password"
                    type="password"
                    placeholder="••••••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-border bg-secondary/30 text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full rounded-xl bg-navy text-white hover:bg-navy-soft shadow-soft text-xs font-semibold py-2.5"
                >
                  {submittingAuth ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : authMode === "signin" ? (
                    "Sign In to Studio Portal"
                  ) : (
                    "Create Operator Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "signin" ? "signup" : "signin");
                    setAuthError("");
                    setAuthNotice("");
                  }}
                  className="text-xs text-muted-foreground hover:text-navy underline underline-offset-2"
                >
                  {authMode === "signin"
                    ? "Need to register an operator account? Click here"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Signed In but Not Admin */}
        {!loading && sessionUser && !isAdmin && (
          <div className="mx-auto mt-12 max-w-xl">
            <div className="rounded-3xl border border-warning/40 bg-card p-8 shadow-lift">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">Admin Role Assignment Required</h2>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    You are signed in as <strong className="text-navy">{sessionUser.email}</strong>, but this
                    account does not yet have the <code className="font-mono text-xs bg-sand px-1.5 py-0.5 rounded">admin</code> role in <code className="font-mono text-xs bg-sand px-1.5 py-0.5 rounded">public.user_roles</code>.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-border bg-secondary/40 p-4 text-xs">
                <p className="font-semibold text-navy">Run this SQL command in your Supabase SQL Editor:</p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-xl bg-navy p-3 font-mono text-[0.7rem] text-mint">
                    {grantSql}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(grantSql);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="absolute right-2 top-2 h-6 gap-1 bg-white/10 px-2 text-[0.65rem] text-white hover:bg-white/20"
                  >
                    {copiedSql ? <Check className="h-3 w-3 text-mint" /> : <Copy className="h-3 w-3" />}
                    {copiedSql ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={checkAuthAndRole} className="rounded-xl bg-navy text-white hover:bg-navy-soft text-xs">
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Re-check Admin Role
                </Button>
                <Button variant="outline" onClick={handleSignOut} className="rounded-xl text-xs">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* State 4: Authenticated Operator Admin Dashboard */}
        {!loading && sessionUser && isAdmin && (
          <div className="space-y-8">
            {/* Studio Navigation Ribbon (Human Crafted) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-navy">
                  Studio Operations
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  QuietoraLabs Product Studio • Manage inbounds, job postings & candidates
                </p>
              </div>

              {/* Top View Selector Switcher */}
              <div className="inline-flex items-center rounded-2xl border border-border bg-card p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveSection("inbox")}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all",
                    activeSection === "inbox"
                      ? "bg-navy text-white shadow-soft"
                      : "text-muted-foreground hover:text-navy",
                  )}
                >
                  <Inbox className="h-3.5 w-3.5" /> Inbound Inquiries
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[0.65rem] font-mono">
                    {metrics.total}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("jobs")}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all",
                    activeSection === "jobs"
                      ? "bg-navy text-white shadow-soft"
                      : "text-muted-foreground hover:text-navy",
                  )}
                >
                  <Briefcase className="h-3.5 w-3.5" /> Job Openings
                  <span className="rounded-full bg-emerald-500/20 text-emerald-700 px-1.5 py-0.2 text-[0.65rem] font-mono">
                    {jobPostings.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("candidates")}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all",
                    activeSection === "candidates"
                      ? "bg-navy text-white shadow-soft"
                      : "text-muted-foreground hover:text-navy",
                  )}
                >
                  <User className="h-3.5 w-3.5" /> Candidates
                  <span className="rounded-full bg-ocean/20 text-ocean px-1.5 py-0.2 text-[0.65rem] font-mono">
                    {metrics.careers}
                  </span>
                </button>
              </div>
            </div>

            {/* SECTION 1: INBOUND INQUIRIES */}
            {activeSection === "inbox" && (
              <div className="space-y-6 animate-fade-in">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <p className="text-xs text-muted-foreground">Focus Early Access</p>
                    <p className="mt-1 font-display text-2xl font-bold text-navy">{metrics.earlyAccess}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[0.7rem] text-emerald-700 font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Waitlist leads
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <p className="text-xs text-muted-foreground">Campus Institutional</p>
                    <p className="mt-1 font-display text-2xl font-bold text-navy">{metrics.partnerships}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[0.7rem] text-ocean font-medium">
                      <Building className="h-3 w-3" /> Partner inquiries
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <p className="text-xs text-muted-foreground">General Messages</p>
                    <p className="mt-1 font-display text-2xl font-bold text-navy">{metrics.contact}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                      <Mail className="h-3 w-3" /> Direct notes
                    </span>
                  </div>

                  <div className="rounded-2xl border border-ocean/30 bg-ocean/5 p-5 shadow-soft">
                    <p className="text-xs text-navy/80">Pending Attention</p>
                    <p className="mt-1 font-display text-2xl font-bold text-navy">{metrics.pendingReview}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[0.7rem] text-navy font-medium">
                      <Clock className="h-3 w-3" /> New or in review
                    </span>
                  </div>
                </div>

                {/* Filter and Action Bar */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft md:flex-row md:items-center md:justify-between">
                  <div className="relative flex-1 md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search name, email, notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pl-9 text-xs rounded-xl"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded-xl border border-border bg-secondary/50 p-0.5 text-xs">
                      {(
                        [
                          { key: "all", label: "All" },
                          { key: "early_access", label: "Focus" },
                          { key: "partnership", label: "Campus" },
                          { key: "contact", label: "Contact" },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setKindFilter(tab.key)}
                          className={cn(
                            "rounded-lg px-2.5 py-1 font-medium transition-colors",
                            kindFilter === tab.key
                              ? "bg-navy text-white shadow-xs"
                              : "text-muted-foreground hover:text-navy",
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        setCreateKind("contact");
                        setShowCreateModal(true);
                      }}
                      size="sm"
                      className="gap-1.5 text-xs rounded-xl bg-ocean hover:bg-ocean/90 text-white"
                    >
                      <PlusCircle className="h-3.5 w-3.5" /> + Add Entry
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportCSV}
                      disabled={submissions.length === 0}
                      className="gap-1.5 text-xs rounded-xl"
                    >
                      <Download className="h-3.5 w-3.5" /> Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadLeads}
                      disabled={fetchingLeads}
                      className="gap-1.5 text-xs rounded-xl"
                    >
                      <RefreshCw className={cn("h-3.5 w-3.5", fetchingLeads && "animate-spin")} />
                    </Button>
                  </div>
                </div>

                {/* Submissions Feed */}
                {filteredSubmissions.length === 0 ? (
                  <div className="rounded-3xl border border-border bg-card p-12 text-center">
                    <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 font-display text-sm font-semibold text-navy">No matching inquiries</p>
                    <p className="text-xs text-muted-foreground">All caught up or try clearing your search query.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSubmissions.map((s) => {
                      const isExpanded = expandedId === s.id;
                      const details = (s.details && typeof s.details === "object" ? s.details : {}) as Record<string, unknown>;
                      const phone = (details["phone"] as string) || "";
                      const operatorNote = (details["notes"] as string) || "";

                      return (
                        <div
                          key={s.id}
                          className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-ocean/30"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-sm text-navy">{s.name}</span>
                                <Badge variant="outline" className="text-[0.65rem] font-mono">
                                  {s.kind}
                                </Badge>
                                <span className="text-xs text-muted-foreground">({s.email})</span>
                              </div>
                              {s.organization && (
                                <p className="text-xs text-muted-foreground">Org: {s.organization}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Status Dropdown */}
                              <select
                                value={s.status}
                                onChange={(e) => handleStatusChange(s.id, e.target.value as SubmissionStatus)}
                                disabled={updatingId === s.id}
                                className="rounded-xl border border-border bg-secondary/40 px-2.5 py-1 text-xs font-medium text-navy focus:border-ocean focus:outline-none"
                              >
                                <option value="new">New</option>
                                <option value="in_review">In Review</option>
                                <option value="responded">Responded</option>
                                <option value="archived">Archived</option>
                              </select>

                              {phone && (
                                <a
                                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                                className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-navy"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(s.id)}
                                disabled={deletingId === s.id}
                                className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details & Notes */}
                          {isExpanded && (
                            <div className="mt-4 border-t border-border/60 pt-4 space-y-4 text-xs animate-fade-in">
                              {s.message && (
                                <div>
                                  <span className="font-semibold text-navy">Message:</span>
                                  <p className="mt-1 rounded-xl bg-secondary/30 p-3 text-muted-foreground leading-relaxed">
                                    {s.message}
                                  </p>
                                </div>
                              )}

                              {/* Operator Notes Box */}
                              <div className="rounded-xl border border-border bg-secondary/20 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-navy font-mono text-[0.7rem] uppercase">
                                    Internal Operator Notes
                                  </span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveNotes(s)}
                                    disabled={savingNoteId === s.id}
                                    className="h-6 gap-1 text-[0.68rem] rounded-lg bg-navy text-white px-2.5"
                                  >
                                    <Save className="h-3 w-3" /> Save Note
                                  </Button>
                                </div>
                                <Textarea
                                  rows={2}
                                  placeholder="Record calls, next steps, meeting outcomes..."
                                  value={editingNotes[s.id] ?? operatorNote}
                                  onChange={(e) =>
                                    setEditingNotes((prev) => ({ ...prev, [s.id]: e.target.value }))
                                  }
                                  className="rounded-lg text-xs bg-card"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: JOB OPENINGS MANAGEMENT */}
            {activeSection === "jobs" && (
              <div className="space-y-6 animate-fade-in">
                {/* Header Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy">Studio Roles & Positions</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Create, publish, edit, or close roles on the public careers page. Candidate applications flow
                      directly to the talent pipeline.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleOpenJobModal()}
                      className="gap-2 rounded-xl bg-navy text-white hover:bg-navy-soft shadow-soft text-xs font-semibold px-4 py-2"
                    >
                      <PlusCircle className="h-3.5 w-3.5" /> + Post New Role
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadJobs}
                      disabled={fetchingJobs}
                      className="rounded-xl text-xs"
                    >
                      <RefreshCw className={cn("h-3.5 w-3.5", fetchingJobs && "animate-spin")} />
                    </Button>
                  </div>
                </div>

                {/* Jobs List */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {jobPostings.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:border-ocean/40 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            className={cn(
                              "text-[0.65rem] font-mono",
                              job.status === "published"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : job.status === "draft"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-secondary text-muted-foreground",
                            )}
                          >
                            {job.status.toUpperCase()}
                          </Badge>

                          <span className="text-[0.7rem] font-mono text-muted-foreground">
                            {job.applicant_count ?? 0} Applicants
                          </span>
                        </div>

                        <div>
                          <h3 className="font-display text-lg font-bold text-navy">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                            <span>{job.department}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">{job.salary_range}</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {job.summary}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                        <Link
                          to="/careers/apply"
                          search={{ role: job.slug || job.id }}
                          className="text-xs text-ocean hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          View Public Page <ExternalLink className="h-3 w-3" />
                        </Link>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenJobModal(job)}
                            className="rounded-xl text-xs h-7 px-2.5 gap-1"
                          >
                            <Edit3 className="h-3 w-3" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="rounded-xl text-xs h-7 px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: CANDIDATE APPLICATIONS PIPELINE */}
            {activeSection === "candidates" && (
              <div className="space-y-6 animate-fade-in">
                {/* Header & Filter Ribbon */}
                <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy">Candidate Pipeline</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Review applicant resumes, code repos, experience, and interview notes.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Role Filter */}
                    <div className="flex items-center gap-1.5">
                      <label htmlFor="cand-role-filter" className="text-xs text-muted-foreground">
                        Role:
                      </label>
                      <select
                        id="cand-role-filter"
                        value={candidateRoleFilter}
                        onChange={(e) => setCandidateRoleFilter(e.target.value)}
                        className="rounded-xl border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-navy focus:border-ocean focus:outline-none"
                      >
                        <option value="all">All Roles ({candidateSubmissions.length})</option>
                        {jobPostings.map((j) => (
                          <option key={j.id} value={j.title}>
                            {j.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as "all" | SubmissionStatus)}
                      className="rounded-xl border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-navy focus:border-ocean focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in_review">In Review</option>
                      <option value="responded">Interview / Shortlisted</option>
                      <option value="archived">Archived</option>
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadLeads}
                      disabled={fetchingLeads}
                      className="rounded-xl text-xs h-8"
                    >
                      <RefreshCw className={cn("h-3.5 w-3.5", fetchingLeads && "animate-spin")} />
                    </Button>
                  </div>
                </div>

                {/* Candidate Feed */}
                {filteredCandidates.length === 0 ? (
                  <div className="rounded-3xl border border-border bg-card p-12 text-center">
                    <User className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 font-display text-sm font-semibold text-navy">No candidate applications</p>
                    <p className="text-xs text-muted-foreground">
                      Candidates applying through the careers page will be displayed here with their resume and notes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCandidates.map((cand) => {
                      const details = (cand.details && typeof cand.details === "object" ? cand.details : {}) as Record<string, unknown>;
                      const phone = (details["phone"] as string) || "";
                      const location = (details["location"] as string) || "";
                      const resumeUrl = (details["resumeUrl"] as string) || "";
                      const resumeFilename = (details["resumeFilename"] as string) || "Resume.pdf";
                      const linkedinUrl = (details["linkedinUrl"] as string) || "";
                      const portfolioUrl = (details["portfolioUrl"] as string) || "";
                      const yearsExp = (details["yearsExperience"] as string) || "";
                      const noticePeriod = (details["noticePeriod"] as string) || "";
                      const expectedCtc = (details["expectedCtc"] as string) || "";
                      const projectHighlight = (details["projectHighlight"] as string) || "";
                      const refId = (details["referenceId"] as string) || "";
                      const notes = (details["notes"] as string) || "";

                      return (
                        <div
                          key={cand.id}
                          className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:border-ocean/40 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border/60 pb-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-display text-lg font-bold text-navy">{cand.name}</h3>
                                {refId && (
                                  <span className="font-mono text-[0.65rem] bg-sand px-2 py-0.5 rounded-md text-muted-foreground">
                                    {refId}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                                <span className="font-medium text-ocean">{cand.role_title || "General Application"}</span>
                                <span>•</span>
                                <span>{cand.email}</span>
                                {phone && (
                                  <>
                                    <span>•</span>
                                    <span>{phone}</span>
                                  </>
                                )}
                                {location && (
                                  <>
                                    <span>•</span>
                                    <span>{location}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Status Dropdown */}
                              <select
                                value={cand.status}
                                onChange={(e) => handleStatusChange(cand.id, e.target.value as SubmissionStatus)}
                                className="rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium text-navy focus:border-ocean focus:outline-none"
                              >
                                <option value="new">New Candidate</option>
                                <option value="in_review">Reviewing Portfolio</option>
                                <option value="responded">Shortlisted / Interview</option>
                                <option value="archived">Archived / Rejected</option>
                              </select>

                              {phone && (
                                <a
                                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  title="WhatsApp Chat"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDelete(cand.id)}
                                className="rounded-xl border border-border p-2 text-muted-foreground hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Candidate Highlights Grid */}
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                            <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5">
                              <span className="text-[0.68rem] text-muted-foreground block font-mono">Experience</span>
                              <span className="font-semibold text-navy">{yearsExp || "Not specified"}</span>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5">
                              <span className="text-[0.68rem] text-muted-foreground block font-mono">Notice Period</span>
                              <span className="font-semibold text-navy">{noticePeriod || "Not specified"}</span>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5">
                              <span className="text-[0.68rem] text-muted-foreground block font-mono">Expected CTC</span>
                              <span className="font-semibold text-emerald-700">{expectedCtc || "Flexible"}</span>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-secondary/20 p-2.5 flex items-center justify-center">
                              {resumeUrl ? (
                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean hover:underline"
                                >
                                  <FileText className="h-4 w-4" /> View Resume (PDF)
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-[0.7rem]">No Resume Link</span>
                              )}
                            </div>
                          </div>

                          {/* Profile Links */}
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            {linkedinUrl && (
                              <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-ocean hover:underline font-medium"
                              >
                                LinkedIn Profile <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {portfolioUrl && (
                              <a
                                href={portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-navy hover:underline font-medium"
                              >
                                GitHub / Portfolio <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>

                          {/* Cover Letter */}
                          {cand.message && (
                            <div className="space-y-1">
                              <span className="text-[0.7rem] font-semibold text-navy font-mono uppercase">
                                Why QuietoraLabs / Personal Statement:
                              </span>
                              <p className="rounded-2xl border border-border/50 bg-secondary/20 p-3.5 text-xs text-muted-foreground leading-relaxed">
                                {cand.message}
                              </p>
                            </div>
                          )}

                          {projectHighlight && (
                            <div className="space-y-1">
                              <span className="text-[0.7rem] font-semibold text-navy font-mono uppercase">
                                Technical / Design Challenge Highlight:
                              </span>
                              <p className="rounded-2xl border border-border/50 bg-secondary/20 p-3.5 text-xs text-muted-foreground leading-relaxed">
                                {projectHighlight}
                              </p>
                            </div>
                          )}

                          {/* Interview Notes */}
                          <div className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-navy font-mono text-[0.7rem] uppercase">
                                Private Interview & Founder Notes
                              </span>
                              <Button
                                size="sm"
                                onClick={() => handleSaveNotes(cand)}
                                disabled={savingNoteId === cand.id}
                                className="h-6 gap-1 text-[0.68rem] rounded-lg bg-navy text-white px-2.5"
                              >
                                <Save className="h-3 w-3" /> Save Note
                              </Button>
                            </div>
                            <Textarea
                              rows={2}
                              placeholder="Add thoughts on code samples, trial milestones, interview feedback..."
                              value={editingNotes[cand.id] ?? notes}
                              onChange={(e) =>
                                setEditingNotes((prev) => ({ ...prev, [cand.id]: e.target.value }))
                              }
                              className="rounded-xl text-xs bg-card"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* MODAL 1: CREATE INBOUND ENTRY MODAL */}
            {showCreateModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lift max-h-[90vh] overflow-y-auto space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h3 className="font-display text-lg font-bold text-navy">Manually Add Inbound Record</h3>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="rounded-xl p-1 text-muted-foreground hover:text-navy"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {createError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                      {createError}
                    </div>
                  )}

                  <form onSubmit={handleCreateLeadSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Category (Type or select)</Label>
                        <Input
                          list="lead-kind-presets"
                          value={createKind}
                          onChange={(e) => setCreateKind(e.target.value as any)}
                          placeholder="Type or pick category..."
                          className="rounded-xl text-xs bg-secondary/30"
                        />
                        <datalist id="lead-kind-presets">
                          <option value="early_access">Focus Early Access</option>
                          <option value="partnership">Campus Partnership</option>
                          <option value="contact">General Contact</option>
                          <option value="careers">Career Application</option>
                        </datalist>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Initial Status (Type or select)</Label>
                        <Input
                          list="lead-status-presets"
                          value={createStatus}
                          onChange={(e) => setCreateStatus(e.target.value as any)}
                          placeholder="new, in_review, responded..."
                          className="rounded-xl text-xs bg-secondary/30"
                        />
                        <datalist id="lead-status-presets">
                          <option value="new">New</option>
                          <option value="in_review">In Review</option>
                          <option value="responded">Responded</option>
                          <option value="archived">Archived</option>
                        </datalist>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name *</Label>
                        <Input
                          required
                          value={createName}
                          onChange={(e) => setCreateName(e.target.value)}
                          className="rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Email *</Label>
                        <Input
                          type="email"
                          required
                          value={createEmail}
                          onChange={(e) => setCreateEmail(e.target.value)}
                          className="rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">WhatsApp / Phone</Label>
                        <Input
                          value={createPhone}
                          onChange={(e) => setCreatePhone(e.target.value)}
                          className="rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Organization / College</Label>
                        <Input
                          value={createOrg}
                          onChange={(e) => setCreateOrg(e.target.value)}
                          className="rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Message / Context</Label>
                      <Textarea
                        rows={2}
                        value={createMessage}
                        onChange={(e) => setCreateMessage(e.target.value)}
                        className="rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Private Operator Notes</Label>
                      <Textarea
                        rows={2}
                        value={createNotes}
                        onChange={(e) => setCreateNotes(e.target.value)}
                        className="rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateModal(false)}
                        className="rounded-xl text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={creatingLoading}
                        className="rounded-xl bg-navy text-white text-xs px-5"
                      >
                        {creatingLoading ? "Saving..." : "Create Record"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODAL 2: CREATE / EDIT JOB OPENING MODAL */}
            {showJobModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lift max-h-[92vh] overflow-y-auto space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-navy">
                        {editingJobId ? "Edit Job Opening" : "Create New Job Opening"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        This role will be instantly updated on the public careers portal.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowJobModal(false)}
                      className="rounded-xl p-1 text-muted-foreground hover:text-navy"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {jobError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                      {jobError}
                    </div>
                  )}

                  <form onSubmit={handleSaveJobSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs font-medium">Job Title *</Label>
                        <Input
                          required
                          placeholder="e.g. Founding Windows Systems Engineer"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Department (Type or select) *</Label>
                        <Input
                          required
                          list="job-dept-presets"
                          placeholder="Type or pick department..."
                          value={jobDepartment}
                          onChange={(e) => setJobDepartment(e.target.value)}
                          className="rounded-xl text-xs bg-secondary/30"
                        />
                        <datalist id="job-dept-presets">
                          <option value="Core Desktop Engine" />
                          <option value="Design & Experience" />
                          <option value="Web & Studio Platform" />
                          <option value="Quietora Product Lab" />
                          <option value="Security & Systems" />
                          <option value="Growth & Operations" />
                          <option value="Founders Office" />
                        </datalist>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Location (Type or select) *</Label>
                        <Input
                          required
                          list="job-loc-presets"
                          placeholder="e.g. Remote (India) / Bengaluru"
                          value={jobLocation}
                          onChange={(e) => setJobLocation(e.target.value)}
                          className="rounded-xl text-xs bg-secondary/30"
                        />
                        <datalist id="job-loc-presets">
                          <option value="Remote (India) / Bengaluru" />
                          <option value="Remote (India)" />
                          <option value="Bengaluru (Hybrid)" />
                          <option value="Flexible Remote" />
                        </datalist>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Employment Type (Type or select)</Label>
                        <Input
                          list="job-type-presets"
                          placeholder="Full-time, Internship, Contract..."
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value)}
                          className="rounded-xl text-xs bg-secondary/30"
                        />
                        <datalist id="job-type-presets">
                          <option value="Full-time" />
                          <option value="Internship (Paid)" />
                          <option value="Contract / High-Autonomy" />
                          <option value="Part-time" />
                          <option value="Fellowship" />
                          <option value="Visiting Researcher" />
                        </datalist>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Experience Level (Type or select)</Label>
                        <Input
                          list="job-exp-presets"
                          placeholder="Students, 2-5 years, Staff..."
                          value={jobExperience}
                          onChange={(e) => setJobExperience(e.target.value)}
                          className="rounded-xl text-xs bg-secondary/30"
                        />
                        <datalist id="job-exp-presets">
                          <option value="Students / Recent Grads" />
                          <option value="1-2 years" />
                          <option value="2-5 years" />
                          <option value="3+ years" />
                          <option value="5+ years / Staff" />
                          <option value="Open to all backgrounds" />
                        </datalist>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Compensation / Salary Range (Type)</Label>
                        <Input
                          placeholder="e.g. ₹18L - ₹28L CTC + Studio Equity"
                          value={jobSalary}
                          onChange={(e) => setJobSalary(e.target.value)}
                          className="rounded-xl text-xs bg-secondary/30"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Publishing Status (Type or select)</Label>
                        <Input
                          list="job-status-presets"
                          placeholder="published, draft, or closed"
                          value={jobStatus}
                          onChange={(e) => setJobStatus(e.target.value as any)}
                          className="rounded-xl text-xs bg-secondary/30"
                        />
                        <datalist id="job-status-presets">
                          <option value="published">Published (Visible on site)</option>
                          <option value="draft">Draft (Hidden)</option>
                          <option value="closed">Closed</option>
                        </datalist>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Short Summary *</Label>
                      <Textarea
                        rows={2}
                        required
                        placeholder="1-2 sentence pitch shown on job cards..."
                        value={jobSummary}
                        onChange={(e) => setJobSummary(e.target.value)}
                        className="rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Detailed Role Description *</Label>
                      <Textarea
                        rows={4}
                        required
                        placeholder="Comprehensive background about the role and what the engineer/designer will build..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Key Responsibilities (One item per line)</Label>
                      <Textarea
                        rows={3}
                        placeholder="Architect Windows background daemon&#10;Implement interception hooks&#10;Profile CPU and memory..."
                        value={jobResponsibilitiesText}
                        onChange={(e) => setJobResponsibilitiesText(e.target.value)}
                        className="rounded-xl text-xs leading-relaxed font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Requirements & Skills (One item per line)</Label>
                      <Textarea
                        rows={3}
                        placeholder="Strong modern C++ or Rust proficiency&#10;Win32 process architecture&#10;Performance profiling..."
                        value={jobRequirementsText}
                        onChange={(e) => setJobRequirementsText(e.target.value)}
                        className="rounded-xl text-xs leading-relaxed font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">What We Offer / Perks (One item per line)</Label>
                      <Textarea
                        rows={2}
                        placeholder="High autonomy async culture&#10;Top-tier hardware setup&#10;Founding equity stake..."
                        value={jobPerksText}
                        onChange={(e) => setJobPerksText(e.target.value)}
                        className="rounded-xl text-xs leading-relaxed font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowJobModal(false)}
                        className="rounded-xl text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={savingJob}
                        className="rounded-xl bg-navy text-white text-xs px-6"
                      >
                        {savingJob ? "Saving Role..." : editingJobId ? "Save Changes" : "Publish Job Role"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
