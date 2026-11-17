import { invoke } from "@tauri-apps/api/core";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode, SVGProps } from "react";
import "./App.css";

type IconName =
  | "dashboard" | "company" | "divisions" | "members" | "projects" | "news"
  | "website" | "analytics" | "settings" | "audit" | "help" | "search"
  | "bell" | "chevron" | "arrow" | "calendar" | "chart" | "folder"
  | "articles" | "bolt" | "history" | "person" | "megaphone" | "check"
  | "close" | "menu" | "impact" | "file" | "edit" | "trash" | "upload" | "plus" | "save";

type ContentKind =
  | "company"
  | "division"
  | "project"
  | "impact"
  | "news"
  | "announcement"
  | "page"
  | "navigation"
  | "seo"
  | "assignment"
  | "event"
  | "document";
type LogoVariant = "white" | "blue";
type ContentRecord = {
  id: string;
  kind: ContentKind;
  title: string;
  summary: string;
  body: string;
  status: "draft" | "published";
  image: string | null;
  divisionId: string | null;
  logoWhite: string | null;
  logoBlue: string | null;
  logoVariant: LogoVariant | null;
  assignee: string | null;
  dueDate: string | null;
  workStatus: string | null;
  startsAt: string | null;
  location: string | null;
  resourceFileId: string | null;
  resourceFileName: string | null;
  resourceMimeType: string | null;
  resourceSizeBytes: number | null;
  updatedAt: string;
};
type ResourceFileMetadata = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};
type ResourceFilePayload = ResourceFileMetadata & { base64Data: string };
type ApplicationType = "kilivo_member" | "community_impact";
type ApplicationStatus = "pending" | "approved" | "rejected";
type MemberStatus = "active" | "inactive";
type MemberAttachment = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};
type MembershipApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  applicationType: ApplicationType;
  status: ApplicationStatus;
  appliedAt: string;
  message: string;
  attachments: MemberAttachment[];
  rejectionReason: string | null;
};
type MemberRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  memberType: ApplicationType;
  status: MemberStatus;
  joinedAt: string;
  invitationStatus: string;
};
type MemberWorkspaceData = {
  applications: MembershipApplication[];
  members: MemberRecord[];
};
type MemberAttachmentPayload = {
  fileName: string;
  mimeType: string;
  base64Data: string;
};

function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const shapes: Record<IconName, ReactNode> = {
    dashboard: <><path d="M3 13h8V3H3zM13 21h8v-8h-8zM13 3h8v6h-8zM3 17h8v4H3z" /></>,
    company: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 21V9h6v12M7 7h.01M17 7h.01M7 11h.01M17 11h.01" /></>,
    divisions: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    members: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    projects: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 11v6M9 14h6" /></>,
    news: <><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" /><path d="M2 7v12a2 2 0 0 0 2 2" /></>,
    website: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></>,
    analytics: <><path d="M3 3v18h18M8 15l4-4 4 3 5-7" /><path d="M17 7h4v4" /></>,
    settings: <><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.8Z" /></>,
    audit: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    help: <><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    chevron: <><path d="m7 10 5 5 5-5" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    chart: <><path d="M3 3v18h18M7 14l4-4 4 3 6-7" /></>,
    folder: <><path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
    articles: <><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" /><path d="M2 7v12a2 2 0 0 0 2 2" /></>,
    bolt: <><path d="m13 2-3 8h7L9 22l3-9H5z" /></>,
    history: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    person: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    megaphone: <><path d="m3 11 18-5v12L3 13zM11 14l2 7H8l-2-8M5 13l1 7" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    impact: <><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...shared}
      {...props}
    >
      {shapes[name]}
    </svg>
  );
}

type NavItem = { label: string; icon: IconName; children?: string[] };

const navigation: NavItem[] = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "Company Management", icon: "company", children: ["Company Overview", "Company Profile"] },
  { label: "Divisions", icon: "divisions" },
  { label: "Members Management", icon: "members", children: ["Member Directory", "Roles & Permissions"] },
  { label: "Workers App", icon: "folder", children: ["Assignments", "Meetings & Events", "Documents & Resources"] },
  { label: "News & Media", icon: "news", children: ["Articles", "Announcements"] },
  { label: "Public Website", icon: "website", children: ["Website Pages", "Navigation", "SEO Settings"] },
  { label: "Analytics & Reports", icon: "analytics", children: ["Website Analytics", "Member Reports", "Export Reports"] },
  { label: "System Settings", icon: "settings", children: ["General Settings", "Admin Accounts", "Integrations"] },
  { label: "Audit Logs", icon: "audit", children: ["Activity History", "Security Events"] },
  { label: "Help & Support", icon: "help", children: ["Help Center", "Contact Support"] },
];

const metrics: { label: string; value: string; icon: IconName; tone: string; section: string }[] = [
  { label: "Company", value: "1", icon: "company", tone: "blue", section: "Company Overview" },
  { label: "Divisions", value: "4", icon: "members", tone: "green", section: "Divisions" },
  { label: "Members", value: "248", icon: "members", tone: "purple", section: "Member Directory" },
  { label: "Projects", value: "12", icon: "folder", tone: "orange", section: "Divisions" },
  { label: "News Articles", value: "48", icon: "articles", tone: "mint", section: "Articles" },
];

const sectionContent: Record<string, { kind: ContentKind; title: string }> = {
  Articles: { kind: "news", title: "News Articles" },
  Announcements: { kind: "announcement", title: "Announcements" },
  "Website Pages": { kind: "page", title: "Website Pages" },
  Navigation: { kind: "navigation", title: "Website Navigation" },
  "SEO Settings": { kind: "seo", title: "SEO Settings" },
  Assignments: { kind: "assignment", title: "Worker Assignments" },
  "Meetings & Events": { kind: "event", title: "Meetings & Events" },
  "Documents & Resources": { kind: "document", title: "Documents & Resources" },
};

type OverviewItem = {
  id: string;
  title: string;
  summary: string | null;
  status: string | null;
  date: string | null;
};

type OverviewDivision = {
  id: string;
  name: string;
  summary: string | null;
  status: string | null;
};

type OverviewAmount = {
  amount: number | null;
  currency: string | null;
  period: string | null;
};

type CompanyOverviewData = {
  asOf: string | null;
  mission: string | null;
  achievements: OverviewItem[] | null;
  plans: OverviewItem[] | null;
  divisions: OverviewDivision[] | null;
  revenue: OverviewAmount | null;
  contributions: OverviewAmount | null;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nullableText(value: unknown, field: string): string | null {
  if (value === null || typeof value === "string") return value;
  throw new Error(`The Company Overview API returned an invalid ${field} value.`);
}

function parseOverviewItems(value: unknown, field: string): OverviewItem[] | null {
  if (value === null) return null;
  if (!Array.isArray(value)) {
    throw new Error(`The Company Overview API returned an invalid ${field} list.`);
  }
  return value.map((item, index) => {
    if (!isObject(item) || typeof item.id !== "string" || typeof item.title !== "string") {
      throw new Error(`The Company Overview API returned an invalid ${field} item at position ${index + 1}.`);
    }
    return {
      id: item.id,
      title: item.title,
      summary: nullableText(item.summary, `${field} summary`),
      status: nullableText(item.status, `${field} status`),
      date: nullableText(field === "achievements" ? item.achievedAt : item.targetDate, `${field} date`),
    };
  });
}

function parseOverviewDivisions(value: unknown): OverviewDivision[] | null {
  if (value === null) return null;
  if (!Array.isArray(value)) {
    throw new Error("The Company Overview API returned an invalid divisions list.");
  }
  return value.map((item, index) => {
    if (!isObject(item) || typeof item.id !== "string" || typeof item.name !== "string") {
      throw new Error(`The Company Overview API returned an invalid division at position ${index + 1}.`);
    }
    return {
      id: item.id,
      name: item.name,
      summary: nullableText(item.summary, "division summary"),
      status: nullableText(item.status, "division status"),
    };
  });
}

function parseOverviewAmount(value: unknown, field: string): OverviewAmount | null {
  if (value === null) return null;
  if (!isObject(value) || (value.amount !== null && typeof value.amount !== "number")) {
    throw new Error(`The Company Overview API returned an invalid ${field} amount.`);
  }
  return {
    amount: value.amount,
    currency: nullableText(value.currency, `${field} currency`),
    period: nullableText(value.period, `${field} period`),
  };
}

function parseCompanyOverview(payload: unknown): CompanyOverviewData {
  if (!isObject(payload) || !isObject(payload.data) || !isObject(payload.data.companyOverview)) {
    throw new Error("The API response does not include companyOverview data.");
  }
  const overview = payload.data.companyOverview;
  if (!isObject(overview.financials)) {
    throw new Error("The Company Overview API response does not include financials.");
  }
  return {
    asOf: nullableText(overview.asOf, "last updated"),
    mission: nullableText(overview.mission, "mission"),
    achievements: parseOverviewItems(overview.achievements, "achievements"),
    plans: parseOverviewItems(overview.plans, "plans"),
    divisions: parseOverviewDivisions(overview.divisions),
    revenue: parseOverviewAmount(overview.financials.revenue, "revenue"),
    contributions: parseOverviewAmount(overview.financials.contributions, "contributions"),
  };
}

function formatOverviewDate(value: string | null): string {
  if (!value) return "Not reported by API";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function CompanyOverviewWorkspace({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [overview, setOverview] = useState<CompanyOverviewData | null>(null);
  const [loading, setLoading] = useState(Boolean(apiBaseUrl.trim()));
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const normalizedBaseUrl = apiBaseUrl.trim().replace(/\/+$/, "");

  useEffect(() => {
    if (!normalizedBaseUrl) {
      setLoading(false);
      setOverview(null);
      setError("");
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`${normalizedBaseUrl}/api/v1/admin/dashboard?range=30d`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`GET Company Overview failed (${response.status} ${response.statusText}).`);
        }
        return parseCompanyOverview(await response.json());
      })
      .then((data) => setOverview(data))
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(String(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [normalizedBaseUrl, retry]);

  function renderItems(items: OverviewItem[] | null, emptyMessage: string) {
    if (items === null) return <p className="overview-unavailable">Not reported by API.</p>;
    if (!items.length) return <p className="overview-unavailable">{emptyMessage}</p>;
    return (
      <div className="overview-record-list">
        {items.map((item) => (
          <article className="overview-record" key={item.id}>
            <div className="overview-record-heading">
              <strong>{item.title}</strong>
              <span>{item.status || formatOverviewDate(item.date)}</span>
            </div>
            <p>{item.summary || "No details reported by API."}</p>
            {item.status && item.date && <small>{formatOverviewDate(item.date)}</small>}
          </article>
        ))}
      </div>
    );
  }

  function renderAmount(label: string, value: OverviewAmount | null) {
    const amount = value?.amount;
    return (
      <article className="overview-financial-card">
        <span>{label}</span>
        <strong>{amount === null || amount === undefined
          ? "Not reported"
          : `${amount.toLocaleString()}${value?.currency ? ` ${value.currency}` : ""}`}</strong>
        <small>{value?.period || (value ? "Period not reported" : "Not reported by API")}</small>
      </article>
    );
  }

  if (!normalizedBaseUrl) {
    return (
      <section className="company-overview">
        <div className="overview-api-state" role="status">
          <strong>Company Overview API is not configured.</strong>
          <span>Set <code>VITE_ADMIN_API_BASE_URL</code> to the backend base URL to load current company information.</span>
          <span>This page is read-only and will display API data only; it does not use local starter content.</span>
        </div>
      </section>
    );
  }

  if (loading) {
    return <div className="content-empty"><span className="loading-spinner" />Loading Company Overview from the API…</div>;
  }

  if (error || !overview) {
    return (
      <section className="company-overview">
        <div className="overview-api-state overview-api-state--error" role="alert">
          <strong>Could not load Company Overview.</strong>
          <span>{error || "The API returned no overview data."}</span>
          <button className="button-primary module-back" type="button" onClick={() => setRetry((count) => count + 1)}>Retry GET request</button>
        </div>
      </section>
    );
  }

  return (
    <section className="company-overview">
      <div className="overview-api-meta">
        <span><Icon name="history" size={16} />Read-only · GET API</span>
        <span>Updated: {formatOverviewDate(overview.asOf)}</span>
      </div>
      <article className="overview-panel overview-mission">
        <div className="overview-panel-heading"><h2>Company Mission</h2><span>Current</span></div>
        <p>{overview.mission || "Mission not reported by API."}</p>
      </article>
      <div className="overview-financial-grid">
        {renderAmount("Revenue", overview.revenue)}
        {renderAmount("Contributions", overview.contributions)}
      </div>
      <div className="overview-content-grid">
        <article className="overview-panel">
          <div className="overview-panel-heading"><h2>Achievements</h2></div>
          {renderItems(overview.achievements, "No achievements reported by API.")}
        </article>
        <article className="overview-panel">
          <div className="overview-panel-heading"><h2>Company Plans</h2></div>
          {renderItems(overview.plans, "No plans reported by API.")}
        </article>
      </div>
      <article className="overview-panel">
        <div className="overview-panel-heading"><h2>Divisions Briefing</h2></div>
        {overview.divisions === null ? (
          <p className="overview-unavailable">Not reported by API.</p>
        ) : overview.divisions.length ? (
          <div className="overview-division-grid">
            {overview.divisions.map((division) => (
              <article className="overview-division-card" key={division.id}>
                <strong>{division.name}</strong>
                <p>{division.summary || "No briefing reported by API."}</p>
                <span>{division.status || "Status not reported"}</span>
              </article>
            ))}
          </div>
        ) : <p className="overview-unavailable">No divisions reported by API.</p>}
      </article>
    </section>
  );
}

function createRecord(kind: ContentKind, divisionId: string | null = null): ContentRecord {
  return {
    id: crypto.randomUUID(),
    kind,
    title: "",
    summary: "",
    body: "",
    status: "draft",
    image: null,
    divisionId,
    logoWhite: null,
    logoBlue: null,
    logoVariant: null,
    assignee: null,
    dueDate: null,
    workStatus: kind === "assignment" ? "not_started" : null,
    startsAt: null,
    location: null,
    resourceFileId: null,
    resourceFileName: null,
    resourceMimeType: null,
    resourceSizeBytes: null,
    updatedAt: String(Math.floor(Date.now() / 1000)),
  };
}

async function uploadLocalImage(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("Choose a PNG, JPEG, or WebP image.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image size must be 10 MB or less.");
  }

  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.onload = () => {
      const result = String(reader.result);
      const separator = result.indexOf(",");
      if (separator < 0) reject(new Error("Could not decode the selected image."));
      else resolve(result.slice(separator + 1));
    };
    reader.readAsDataURL(file);
  });
  return invoke<string>("upload_image", { mimeType: file.type, base64Data });
}

async function uploadResourceFile(file: File): Promise<ResourceFileMetadata> {
  const supportedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  if (!supportedTypes.includes(file.type)) {
    throw new Error("Choose a PDF, DOCX, XLSX, or PPTX resource.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Resource files must be 10 MB or less.");
  }
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected resource."));
    reader.onload = () => {
      const result = String(reader.result);
      const separator = result.indexOf(",");
      if (separator < 0) reject(new Error("Could not decode the selected resource."));
      else resolve(result.slice(separator + 1));
    };
    reader.readAsDataURL(file);
  });
  return invoke<ResourceFileMetadata>("upload_resource_file", {
    fileName: file.name,
    mimeType: file.type,
    base64Data,
  });
}

function ImageThumbnail({ filename, alt }: { filename: string | null; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (!filename) {
      setSrc(null);
      return () => { active = false; };
    }
    invoke<string | null>("load_image", { filename })
      .then((image) => { if (active && image) setSrc(image); })
      .catch((error: unknown) => console.error("Could not load local image:", error));
    return () => { active = false; };
  }, [filename]);

  if (!src) return <div className="content-image-placeholder"><Icon name="file" size={24} /></div>;
  return <img className="content-image" src={src} alt={alt} />;
}

function CompanyLogoMark({ variant }: { variant: LogoVariant }) {
  return (
    <svg className={`company-logo-mark company-logo-mark--${variant}`} viewBox="0 0 96 96" aria-hidden="true">
      <path d="M24 16h15v64H24zM39 47l31-31h20L53 49l38 31H68L39 58z" />
      <path className="company-logo-swoosh" d="m40 52 48-27-5 9-38 28z" />
    </svg>
  );
}

function CompanyProfileWorkspace({
  profile,
  divisions,
  loading,
  storageError,
  onSave,
}: {
  profile: ContentRecord;
  divisions: ContentRecord[];
  loading: boolean;
  storageError: string;
  onSave: (record: ContentRecord) => Promise<void>;
}) {
  const [editing, setEditing] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [creatingDivision, setCreatingDivision] = useState(false);
  const [divisionTitle, setDivisionTitle] = useState("");
  const [divisionSummary, setDivisionSummary] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setEditing(profile), [profile]);

  async function saveProfile() {
    setSaving(true);
    setError("");
    try {
      await onSave({ ...editing, kind: "company", logoWhite: null, logoBlue: null });
    } catch (saveError) {
      setError(`Could not save company profile: ${String(saveError)}`);
    } finally {
      setSaving(false);
    }
  }

  async function addDivision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newDivision = {
      ...createRecord("division"),
      title: divisionTitle.trim(),
      summary: divisionSummary.trim(),
    };
    setSaving(true);
    setError("");
    try {
      await onSave(newDivision);
      setCreatingDivision(false);
      setDivisionTitle("");
      setDivisionSummary("");
    } catch (saveError) {
      setError(`Could not add division: ${String(saveError)}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="content-empty"><span className="loading-spinner" />Loading locally saved company profile…</div>;
  }

  return (
    <section className="company-profile-workspace">
      {storageError && <div className="storage-error" role="alert">{storageError}</div>}
      {error && <div className="storage-error" role="alert">{error}</div>}
      <article className="profile-edit-panel">
        <div className="profile-section-heading">
          <div><h2>Official company information</h2><p>Saved on this computer; edits are not shared with the website or mobile app.</p></div>
          <span className="status-badge status-draft">Local profile</span>
        </div>
        <div className="profile-edit-fields">
          <label className="field-label">
            Company name
            <input value={editing.title} maxLength={140} onChange={(event) => setEditing((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <label className="field-label">
            Short description
            <textarea value={editing.summary} maxLength={300} rows={3} onChange={(event) => setEditing((current) => ({ ...current, summary: event.target.value }))} />
          </label>
          <label className="field-label">
            Official information
            <textarea className="body-field" value={editing.body} rows={7} onChange={(event) => setEditing((current) => ({ ...current, body: event.target.value }))} />
          </label>
        </div>
        <div className="company-logo-grid">
          {([
            ["white", "White K logo"],
            ["blue", "Blue K logo"],
          ] as const).map(([variant, label]) => (
            <button
              className={`company-logo-card${editing.logoVariant === variant ? " company-logo-card--selected" : ""}`}
              type="button"
              key={variant}
              aria-pressed={editing.logoVariant === variant}
              disabled={saving}
              onClick={() => setEditing((current) => ({ ...current, logoVariant: variant }))}
            >
              <span className={`company-logo-preview company-logo-preview--${variant}`}>
                <CompanyLogoMark variant={variant} />
              </span>
              <strong>{label}</strong>
              <small>{editing.logoVariant === variant ? "Selected" : "Choose this logo"}</small>
            </button>
          ))}
        </div>
        <p className="upload-help">Choose the built-in white or blue KILIVO logo. No logo upload is needed.</p>
        <div className="editor-actions">
          <button className="button-primary" type="button" disabled={saving || !editing.title.trim() || Boolean(storageError)} onClick={() => void saveProfile()}>
            <Icon name="save" size={17} />{saving ? "Saving…" : "Save company profile"}
          </button>
        </div>
      </article>

      <article className="profile-edit-panel">
        <div className="profile-section-heading">
          <div><h2>Company divisions</h2><p>Add divisions here; edit their imagery and details from the Divisions controller.</p></div>
          <button className="button-primary" type="button" disabled={Boolean(storageError) || loading} onClick={() => { setError(""); setCreatingDivision(true); }}>
            <Icon name="plus" size={17} />Add division
          </button>
        </div>
        {divisions.length ? (
          <div className="profile-division-list">
            {divisions.map((division) => (
              <div className="profile-division-row" key={division.id}>
                <ImageThumbnail filename={division.image} alt="" />
                <span><strong>{division.title}</strong><small>{division.summary || "No short description yet."}</small></span>
              </div>
            ))}
          </div>
        ) : <p className="overview-unavailable">No divisions have been added.</p>}
      </article>

      {creatingDivision && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && setCreatingDivision(false)}>
          <form className="action-modal division-create-modal" onSubmit={(event) => void addDivision(event)} aria-labelledby="create-division-title" aria-modal="true" role="dialog">
            <button className="modal-close icon-button" type="button" aria-label="Close dialog" disabled={saving} onClick={() => setCreatingDivision(false)}><Icon name="close" size={20} /></button>
            <span className="modal-icon"><Icon name="divisions" size={24} /></span>
            <h2 id="create-division-title">Add a division</h2>
            <p>This creates a division card. Add its image and full details from the Divisions controller.</p>
            <label className="field-label">Division name<input autoFocus maxLength={140} required value={divisionTitle} onChange={(event) => setDivisionTitle(event.target.value)} /></label>
            <label className="field-label">Short description<textarea maxLength={300} rows={3} value={divisionSummary} onChange={(event) => setDivisionSummary(event.target.value)} /></label>
            {error && <div className="storage-error" role="alert">{error}</div>}
            <div className="modal-actions">
              <button className="button-secondary" type="button" disabled={saving} onClick={() => setCreatingDivision(false)}>Cancel</button>
              <button className="button-primary" type="submit" disabled={saving || !divisionTitle.trim() || Boolean(storageError)}>{saving ? "Adding…" : "Add division"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

type DivisionTab = "details" | "project" | "impact" | "news" | "announcement";

function DivisionsWorkspace({
  divisions,
  records,
  loading,
  storageError,
  onSave,
  onDelete,
}: {
  divisions: ContentRecord[];
  records: ContentRecord[];
  loading: boolean;
  storageError: string;
  onSave: (record: ContentRecord) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<DivisionTab>("details");
  const selectedDivision = divisions.find((division) => division.id === selectedId) ?? null;
  const [editing, setEditing] = useState<ContentRecord | null>(selectedDivision);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEditing(selectedDivision);
    setTab("details");
    setError("");
  }, [selectedDivision]);

  async function saveDivision() {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      await onSave({ ...editing, kind: "division" });
    } catch (saveError) {
      setError(`Could not save division: ${String(saveError)}`);
    } finally {
      setSaving(false);
    }
  }

  async function uploadDivisionImage(file: File) {
    setUploading(true);
    setError("");
    try {
      const filename = await uploadLocalImage(file);
      setEditing((current) => current ? { ...current, image: filename } : current);
    } catch (uploadError) {
      setError(`Division image upload failed: ${String(uploadError)}`);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div className="content-empty"><span className="loading-spinner" />Loading locally saved divisions…</div>;
  }

  if (!selectedDivision || !editing) {
    return (
      <section className="division-controller">
        {storageError && <div className="storage-error" role="alert">{storageError}</div>}
        <div className="division-controller-intro">
          <div><h2>Choose a division</h2><p>Each division is managed in its own controller, including its app presentation and related content.</p></div>
        </div>
        {divisions.length ? (
          <div className="division-controller-grid">
            {divisions.map((division) => (
              <button className="division-controller-card" type="button" key={division.id} onClick={() => { setSelectedId(division.id); setTab("details"); }}>
                <ImageThumbnail filename={division.image} alt="" />
                <span className="division-controller-card-copy">
                  <strong>{division.title}</strong>
                  <small>{division.summary || "No short description yet."}</small>
                  <span>{division.status === "published" ? "Published locally" : "Draft"}</span>
                </span>
              </button>
            ))}
          </div>
        ) : <div className="content-empty"><span className="module-icon"><Icon name="divisions" size={27} /></span><strong>No divisions yet</strong><span>Add divisions from Company Profile.</span></div>}
        <p className="local-scope-note">Division records and app presentation are stored on this computer only.</p>
      </section>
    );
  }

  const tabs: { id: DivisionTab; label: string }[] = [
    { id: "details", label: "Division details" },
    { id: "project", label: "Projects" },
    { id: "impact", label: "Impact" },
    { id: "news", label: "News" },
    { id: "announcement", label: "Announcements" },
  ];

  return (
    <section className="division-controller">
      <button className="division-back-button" type="button" onClick={() => { setSelectedId(null); setError(""); }}>
        <Icon name="arrow" size={16} />All divisions
      </button>
      {error && <div className="storage-error" role="alert">{error}</div>}
      {storageError && <div className="storage-error" role="alert">{storageError}</div>}
      <div className="division-subcontroller-heading">
        <ImageThumbnail filename={editing.image} alt="" />
        <div><span className="editor-eyebrow">DIVISION CONTROLLER</span><h2>{editing.title}</h2><p>{editing.summary || "Edit the division details and content presented in the apps."}</p></div>
      </div>
      <div className="division-tabs" role="tablist" aria-label={`${editing.title} management`}>
        {tabs.map((item) => (
          <button type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? "division-tab is-active" : "division-tab"} key={item.id} onClick={() => setTab(item.id)}>{item.label}</button>
        ))}
      </div>
      {tab === "details" ? (
        <article className="profile-edit-panel division-details-panel">
          <div className="profile-edit-fields">
            <label className="field-label">Division name<input value={editing.title} maxLength={140} onChange={(event) => setEditing((current) => current ? { ...current, title: event.target.value } : current)} /></label>
            <label className="field-label">Short description<textarea value={editing.summary} maxLength={300} rows={3} onChange={(event) => setEditing((current) => current ? { ...current, summary: event.target.value } : current)} /></label>
            <label className="field-label">Division information<textarea className="body-field" value={editing.body} rows={7} onChange={(event) => setEditing((current) => current ? { ...current, body: event.target.value } : current)} /></label>
            <label className="field-label">Local publication status<select value={editing.status} onChange={(event) => setEditing((current) => current ? { ...current, status: event.target.value as ContentRecord["status"] } : current)}><option value="draft">Draft</option><option value="published">Published locally</option></select></label>
          </div>
          <aside className="editor-aside">
            <span className="field-label">Division image for app cards</span>
            <div className="upload-preview">{editing.image ? <ImageThumbnail filename={editing.image} alt={editing.title} /> : <span className="division-image-empty">No division image uploaded</span>}</div>
            <label className={`upload-button${uploading ? " is-disabled" : ""}`}>
              <Icon name="upload" size={17} />{uploading ? "Uploading…" : "Choose division image"}
              <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading || saving} onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) void uploadDivisionImage(file);
                event.currentTarget.value = "";
              }} />
            </label>
            {editing.image && <button className="remove-image-button" type="button" disabled={uploading || saving} onClick={() => setEditing((current) => current ? { ...current, image: null } : current)}>Remove image</button>}
            <p className="upload-help">PNG, JPEG or WebP · up to 10 MB. Stored locally; not synchronized to other apps.</p>
          </aside>
          <div className="editor-actions">
            <button className="button-primary" type="button" disabled={saving || uploading || !editing.title.trim() || Boolean(storageError)} onClick={() => void saveDivision()}>
              <Icon name="save" size={17} />{saving ? "Saving…" : "Save division"}
            </button>
          </div>
        </article>
      ) : (
        <ContentWorkspace
          key={`${selectedDivision.id}-${tab}`}
          title={tabs.find((item) => item.id === tab)?.label ?? "Division content"}
          kind={tab}
          records={records}
          loading={loading}
          storageError={storageError}
          createRequest={0}
          onCreateRequestHandled={() => undefined}
          onSave={onSave}
          onDelete={onDelete}
          fixedDivisionId={selectedDivision.id}
          workspaceNote="Managed inside this division · Local data only."
        />
      )}
    </section>
  );
}

function memberTypeLabel(type: ApplicationType) {
  return type === "kilivo_member" ? "KILIVO Member" : "Community Impact";
}

function applicationStatusLabel(status: ApplicationStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatMemberDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-TZ", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Dar_es_Salaam",
  }).format(date);
}

function memberInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

async function uploadMemberAttachment(file: File): Promise<MemberAttachment> {
  const supportedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (!supportedTypes.includes(file.type)) {
    throw new Error("Choose a PDF, JPEG, PNG, or WebP attachment.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Attachment size must be 10 MB or less.");
  }
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected attachment."));
    reader.onload = () => {
      const result = String(reader.result);
      const separator = result.indexOf(",");
      if (separator < 0) reject(new Error("Could not decode the selected attachment."));
      else resolve(result.slice(separator + 1));
    };
    reader.readAsDataURL(file);
  });
  return invoke<MemberAttachment>("upload_member_attachment", {
    fileName: file.name,
    mimeType: file.type,
    base64Data,
  });
}

function MemberManagementWorkspace({
  workspace,
  loading,
  storageError,
  onSave,
}: {
  workspace: MemberWorkspaceData | null;
  loading: boolean;
  storageError: string;
  onSave: (workspace: MemberWorkspaceData) => Promise<void>;
}) {
  const [tab, setTab] = useState<"applications" | "members">("applications");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rejecting, setRejecting] = useState<MembershipApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [newApplication, setNewApplication] = useState(false);
  const [draft, setDraft] = useState({
    fullName: "",
    email: "",
    phone: "",
    applicationType: "kilivo_member" as ApplicationType,
    message: "",
  });
  const [draftAttachments, setDraftAttachments] = useState<MemberAttachment[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<MemberAttachmentPayload | null>(null);

  const applications = workspace?.applications ?? [];
  const members = workspace?.members ?? [];
  const visibleApplications = applications
    .filter((application) => filter === "all" || application.status === filter)
    .filter((application) => `${application.fullName} ${application.email} ${application.phone} ${memberTypeLabel(application.applicationType)}`.toLowerCase().includes(search.toLowerCase()))
    .sort((left, right) => right.appliedAt.localeCompare(left.appliedAt));
  const visibleMembers = members
    .filter((member) => filter === "all" || member.memberType === filter || member.status === filter)
    .filter((member) => `${member.fullName} ${member.email} ${member.phone} ${memberTypeLabel(member.memberType)}`.toLowerCase().includes(search.toLowerCase()))
    .sort((left, right) => right.joinedAt.localeCompare(left.joinedAt));
  const visibleCount = tab === "applications" ? visibleApplications.length : visibleMembers.length;
  const pageCount = Math.max(1, Math.ceil(visibleCount / 5));
  const currentPage = Math.min(page, pageCount - 1);
  const currentIds = (tab === "applications" ? visibleApplications : visibleMembers)
    .map((record) => record.id)
    .join("|");
  const selectedApplication = applications.find((application) => application.id === selectedId) ?? null;
  const selectedMember = members.find((member) => member.id === selectedId) ?? null;

  useEffect(() => {
    const ids = currentIds ? currentIds.split("|") : [];
    if (!selectedId || !ids.includes(selectedId)) setSelectedId(ids[0] ?? null);
    if (page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [currentIds, page, pageCount, selectedId]);

  async function persist(next: MemberWorkspaceData, successMessage: string): Promise<boolean> {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await onSave(next);
      setNotice(successMessage);
      return true;
    } catch (saveError) {
      setError(`Could not save member changes: ${String(saveError)}`);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function approveApplication(application: MembershipApplication) {
    if (!workspace) return;
    if (members.some((member) => member.email.toLowerCase() === application.email.toLowerCase())) {
      setError("A member with this email already exists. Review the Members tab before approving.");
      return;
    }
    const member: MemberRecord = {
      id: crypto.randomUUID(),
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      memberType: application.applicationType,
      status: "active",
      joinedAt: new Date().toISOString(),
      invitationStatus: "mock_not_sent",
    };
    if (!await persist({
      applications: workspace.applications.map((item) => item.id === application.id ? { ...item, status: "approved", rejectionReason: null } : item),
      members: [member, ...workspace.members],
    }, "Approved locally. No email or password was sent; the invitation needs a backend email service.")) return;
    setTab("members");
    setSelectedId(member.id);
  }

  async function rejectApplication() {
    if (!workspace || !rejecting || !rejectionReason.trim()) return;
    if (!await persist({
      ...workspace,
      applications: workspace.applications.map((item) => item.id === rejecting.id
        ? { ...item, status: "rejected", rejectionReason: rejectionReason.trim() }
        : item),
    }, "Application rejected locally. No email was sent.")) return;
    setSelectedId(rejecting.id);
    setRejecting(null);
    setRejectionReason("");
  }

  async function saveMemberEdits(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspace || !editingMember) return;
    const duplicate = members.some((member) =>
      member.id !== editingMember.id && member.email.toLowerCase() === editingMember.email.trim().toLowerCase(),
    );
    if (duplicate) {
      setError("Another member already uses this email address.");
      return;
    }
    if (!await persist({
      ...workspace,
      members: workspace.members.map((member) => member.id === editingMember.id
        ? { ...editingMember, fullName: editingMember.fullName.trim(), email: editingMember.email.trim(), phone: editingMember.phone.trim() }
        : member),
    }, "Member details updated on this computer.")) return;
    setEditingMember(null);
  }

  async function toggleMemberStatus(member: MemberRecord) {
    if (!workspace) return;
    const nextStatus: MemberStatus = member.status === "active" ? "inactive" : "active";
    if (nextStatus === "inactive" && !window.confirm(`Deactivate ${member.fullName} on this computer?`)) return;
    await persist({
      ...workspace,
      members: workspace.members.map((item) => item.id === member.id ? { ...item, status: nextStatus } : item),
    }, `Member ${nextStatus === "active" ? "reactivated" : "deactivated"} locally.`);
  }

  async function addApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspace) return;
    const application: MembershipApplication = {
      id: crypto.randomUUID(),
      ...draft,
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      message: draft.message.trim(),
      status: "pending",
      appliedAt: new Date().toISOString(),
      attachments: draftAttachments,
      rejectionReason: null,
    };
    if (!await persist({ ...workspace, applications: [application, ...workspace.applications] }, "Application saved locally.")) return;
    setNewApplication(false);
    setDraft({ fullName: "", email: "", phone: "", applicationType: "kilivo_member", message: "" });
    setDraftAttachments([]);
    setTab("applications");
    setFilter("all");
    setSearch("");
    setPage(0);
    setSelectedId(application.id);
  }

  async function handleAttachmentFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (draftAttachments.length + files.length > 10) {
      setError("An application can have at most 10 attachments.");
      return;
    }
    setUploadingAttachments(true);
    setError("");
    try {
      const uploaded: MemberAttachment[] = [];
      for (const file of Array.from(files)) uploaded.push(await uploadMemberAttachment(file));
      setDraftAttachments((current) => [...current, ...uploaded].slice(0, 10));
    } catch (uploadError) {
      setError(`Attachment upload failed: ${String(uploadError)}`);
    } finally {
      setUploadingAttachments(false);
    }
  }

  async function openAttachment(attachment: MemberAttachment) {
    setError("");
    try {
      const payload = await invoke<MemberAttachmentPayload>("load_member_attachment", { id: attachment.id });
      setAttachmentPreview(payload);
    } catch (attachmentError) {
      setError(`Could not open attachment: ${String(attachmentError)}`);
    }
  }

  function downloadAttachment() {
    if (!attachmentPreview) return;
    const bytes = Uint8Array.from(atob(attachmentPreview.base64Data), (character) => character.charCodeAt(0));
    const blob = new Blob([bytes], { type: attachmentPreview.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachmentPreview.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderAttachmentList(attachments: MemberAttachment[]) {
    if (!attachments.length) return <p className="member-empty-inline">No attachments in this sample application.</p>;
    return (
      <div className="member-attachments">
        {attachments.map((attachment) => (
          <div className="member-attachment" key={attachment.id}>
            <span className="member-attachment-icon"><Icon name="file" size={22} /></span>
            <span className="member-attachment-copy"><strong>{attachment.fileName}</strong><small>{(attachment.sizeBytes / 1024).toFixed(0)} KB</small></span>
            <button type="button" className="member-download-button" aria-label={`View ${attachment.fileName}`} onClick={() => void openAttachment(attachment)}>View</button>
          </div>
        ))}
      </div>
    );
  }

  if (loading) return <div className="content-empty"><span className="loading-spinner" />Loading locally saved applications and members…</div>;
  if (storageError || !workspace) {
    return <div className="storage-error" role="alert">{storageError || "Member data is unavailable."}</div>;
  }

  const pageApplications = visibleApplications.slice(currentPage * 5, currentPage * 5 + 5);
  const pageMembers = visibleMembers.slice(currentPage * 5, currentPage * 5 + 5);

  return (
    <section className="members-workspace">
      <header className="members-page-header">
        <div className="members-page-title">
          <Icon name="members" size={38} />
          <div><h2>Add Members</h2><p>Manage membership applications and registered members</p></div>
        </div>
        <div className="members-page-tabs" role="tablist" aria-label="Member records">
          <button type="button" role="tab" aria-selected={tab === "applications"} className={tab === "applications" ? "is-active" : ""} onClick={() => { setTab("applications"); setFilter("all"); setPage(0); }}>
            <Icon name="articles" size={18} />Applications ({applications.filter((application) => application.status === "pending").length})
          </button>
          <button type="button" role="tab" aria-selected={tab === "members"} className={tab === "members" ? "is-active" : ""} onClick={() => { setTab("members"); setFilter("all"); setPage(0); }}>
            <Icon name="members" size={18} />Members ({members.length})
          </button>
        </div>
      </header>

      <div className="members-local-note"><strong>LOCAL MOCK</strong><span>Saved on this computer. Approval does not send email or create a password; connect the backend email service to send secure invitations.</span></div>
      {error && <div className="storage-error" role="alert">{error}</div>}
      {notice && <div className="member-notice" role="status">{notice}</div>}

      <div className="members-workspace-grid">
        <article className="members-list-panel">
          <div className="members-list-heading">
            <h3>{tab === "applications" ? "Membership Applications" : "Registered Members"}</h3>
            {tab === "applications" && (
              <button type="button" className="button-primary member-add-application" onClick={() => { setError(""); setDraftAttachments([]); setNewApplication(true); }}>+ Add application</button>
            )}
          </div>
          <div className="members-list-controls">
            <input aria-label="Search members" value={search} placeholder="Search name or email" onChange={(event) => { setSearch(event.target.value); setPage(0); }} />
            <select aria-label="Filter applications" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(0); }}>
              {tab === "applications" ? <>
                <option value="all">All applications</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
              </> : <>
                <option value="all">All members</option><option value="kilivo_member">KILIVO Member</option><option value="community_impact">Community Impact</option><option value="active">Active</option><option value="inactive">Inactive</option>
              </>}
            </select>
          </div>

          <div className="members-record-list">
            {tab === "applications" ? pageApplications.map((application) => (
              <button type="button" key={application.id} className={`members-record-row${selectedId === application.id ? " is-selected" : ""}`} onClick={() => setSelectedId(application.id)}>
                <span className="member-avatar">{memberInitials(application.fullName)}</span>
                <span className="member-row-copy"><strong>{application.fullName}</strong><b>{memberTypeLabel(application.applicationType)}</b><small>{formatMemberDate(application.appliedAt)}</small></span>
                <span className={`member-status member-status--${application.status}`}>{applicationStatusLabel(application.status)}</span>
                <span className="member-row-arrow">›</span>
              </button>
            )) : pageMembers.map((member) => (
              <button type="button" key={member.id} className={`members-record-row${selectedId === member.id ? " is-selected" : ""}`} onClick={() => setSelectedId(member.id)}>
                <span className="member-avatar">{memberInitials(member.fullName)}</span>
                <span className="member-row-copy"><strong>{member.fullName}</strong><b>{memberTypeLabel(member.memberType)}</b><small>Joined {formatMemberDate(member.joinedAt)}</small></span>
                <span className={`member-status member-status--${member.status}`}>{member.status}</span>
                <span className="member-row-arrow">›</span>
              </button>
            ))}
            {visibleCount === 0 && <div className="member-empty-state">No {tab === "applications" ? "applications" : "members"} match this filter.</div>}
          </div>

          <div className="members-pagination">
            <button type="button" aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>‹</button>
            {Array.from({ length: pageCount }, (_, index) => <button type="button" key={index} className={currentPage === index ? "is-active" : ""} onClick={() => setPage(index)}>{index + 1}</button>)}
            <button type="button" aria-label="Next page" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)}>›</button>
            <span>{visibleCount ? `${currentPage * 5 + 1}–${Math.min((currentPage + 1) * 5, visibleCount)} of ${visibleCount}` : "0 records"}</span>
          </div>
        </article>

        <article className="member-details-panel">
          {tab === "applications" && selectedApplication ? (
            <>
              <div className="member-details-heading"><h3>Application Details</h3><span className={`member-status member-status--${selectedApplication.status}`}>{applicationStatusLabel(selectedApplication.status)}</span></div>
              <div className="member-details-person">
                <span className="member-avatar member-avatar--large">{memberInitials(selectedApplication.fullName)}</span>
                <div className="member-details-person-copy"><h2>{selectedApplication.fullName}</h2><span className="member-type-pill">{memberTypeLabel(selectedApplication.applicationType)}</span><p>{selectedApplication.email}</p><p>{selectedApplication.phone}</p></div>
                <div className="member-date-card"><span>Applied on</span><strong>{formatMemberDate(selectedApplication.appliedAt)}</strong></div>
              </div>
              <section className="member-detail-section">
                <h4><Icon name="person" size={19} />Personal Information</h4>
                <dl className="member-info-grid"><dt>Full Name</dt><dd>{selectedApplication.fullName}</dd><dt>Email Address</dt><dd>{selectedApplication.email}</dd><dt>Phone Number</dt><dd>{selectedApplication.phone}</dd><dt>Application Type</dt><dd>{memberTypeLabel(selectedApplication.applicationType)}</dd></dl>
              </section>
              <section className="member-detail-section">
                <h4><span className="member-message-icon">•••</span>Application Message</h4>
                <p className="member-message">{selectedApplication.message || "No message provided."}</p>
                {selectedApplication.rejectionReason && <p className="member-rejection-reason"><strong>Rejection reason:</strong> {selectedApplication.rejectionReason}</p>}
              </section>
              <section className="member-detail-section">
                <h4><Icon name="file" size={19} />Attachments</h4>
                {renderAttachmentList(selectedApplication.attachments)}
              </section>
              {selectedApplication.status === "pending" && (
                <div className="member-action-row">
                  <button type="button" className="member-approve-button" disabled={saving} onClick={() => void approveApplication(selectedApplication)}>✓ Add Member</button>
                  <button type="button" className="member-reject-button" disabled={saving} onClick={() => { setRejecting(selectedApplication); setRejectionReason(""); }}>× Reject</button>
                </div>
              )}
              {selectedApplication.status === "approved" && <div className="member-invitation-note">Approved locally. Invitation email is not sent in mock mode.</div>}
            </>
          ) : tab === "members" && selectedMember ? (
            <>
              <div className="member-details-heading"><h3>Member Details</h3><span className={`member-status member-status--${selectedMember.status}`}>{selectedMember.status}</span></div>
              <div className="member-details-person">
                <span className="member-avatar member-avatar--large">{memberInitials(selectedMember.fullName)}</span>
                <div className="member-details-person-copy"><h2>{selectedMember.fullName}</h2><span className="member-type-pill">{memberTypeLabel(selectedMember.memberType)}</span><p>{selectedMember.email}</p><p>{selectedMember.phone}</p></div>
                <div className="member-date-card"><span>Member since</span><strong>{formatMemberDate(selectedMember.joinedAt)}</strong></div>
              </div>
              <section className="member-detail-section">
                <h4><Icon name="person" size={19} />Member Information</h4>
                <dl className="member-info-grid"><dt>Full Name</dt><dd>{selectedMember.fullName}</dd><dt>Email Address</dt><dd>{selectedMember.email}</dd><dt>Phone Number</dt><dd>{selectedMember.phone}</dd><dt>Member Category</dt><dd>{memberTypeLabel(selectedMember.memberType)}</dd><dt>Account Status</dt><dd>{selectedMember.status}</dd></dl>
              </section>
              <div className="member-invitation-note">{selectedMember.invitationStatus === "mock_not_sent" ? "Mock invitation pending: no email or temporary password has been sent." : selectedMember.invitationStatus}</div>
              <div className="member-action-row">
                <button type="button" className="button-primary" onClick={() => { setError(""); setEditingMember({ ...selectedMember }); }}>Edit Member</button>
                <button type="button" className={selectedMember.status === "active" ? "member-reject-button" : "member-approve-button"} disabled={saving} onClick={() => void toggleMemberStatus(selectedMember)}>{selectedMember.status === "active" ? "Deactivate" : "Reactivate"}</button>
              </div>
            </>
          ) : <div className="member-empty-state member-details-empty">Select a record to see its details.</div>}
        </article>
      </div>

      {rejecting && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && setRejecting(null)}>
          <form className="action-modal member-modal" onSubmit={(event) => { event.preventDefault(); void rejectApplication(); }}>
            <h2>Reject application</h2><p>Give a reason for rejecting {rejecting.fullName}. No email will be sent in local mock mode.</p>
            <label className="field-label">Reason for rejection <span>*</span><textarea required rows={4} maxLength={500} value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} /></label>
            <div className="modal-actions"><button type="button" className="button-secondary" disabled={saving} onClick={() => setRejecting(null)}>Cancel</button><button type="submit" className="member-reject-button" disabled={saving || !rejectionReason.trim()}>{saving ? "Saving…" : "Reject application"}</button></div>
          </form>
        </div>
      )}

      {editingMember && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && setEditingMember(null)}>
          <form className="action-modal member-modal" onSubmit={(event) => void saveMemberEdits(event)}>
            <h2>Edit member</h2>
            <label className="field-label">Full name <span>*</span><input required maxLength={140} value={editingMember.fullName} onChange={(event) => setEditingMember((current) => current ? { ...current, fullName: event.target.value } : current)} /></label>
            <label className="field-label">Email address <span>*</span><input required type="email" value={editingMember.email} onChange={(event) => setEditingMember((current) => current ? { ...current, email: event.target.value } : current)} /></label>
            <label className="field-label">Phone number <span>*</span><input required value={editingMember.phone} onChange={(event) => setEditingMember((current) => current ? { ...current, phone: event.target.value } : current)} /></label>
            <label className="field-label">Member category<select value={editingMember.memberType} onChange={(event) => setEditingMember((current) => current ? { ...current, memberType: event.target.value as ApplicationType } : current)}><option value="kilivo_member">KILIVO Member</option><option value="community_impact">Community Impact</option></select></label>
            <div className="modal-actions"><button type="button" className="button-secondary" disabled={saving} onClick={() => setEditingMember(null)}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving…" : "Save member"}</button></div>
          </form>
        </div>
      )}

      {newApplication && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && !uploadingAttachments && setNewApplication(false)}>
          <form className="action-modal member-modal" onSubmit={(event) => void addApplication(event)}>
            <h2>Add application</h2><p>Create a local mock application. Website submissions are not connected.</p>
            <label className="field-label">Full name <span>*</span><input autoFocus required maxLength={140} value={draft.fullName} onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))} /></label>
            <label className="field-label">Email address <span>*</span><input required type="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} /></label>
            <label className="field-label">Phone number <span>*</span><input required value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} /></label>
            <label className="field-label">Application type<select value={draft.applicationType} onChange={(event) => setDraft((current) => ({ ...current, applicationType: event.target.value as ApplicationType }))}><option value="kilivo_member">KILIVO Member</option><option value="community_impact">Community Impact</option></select></label>
            <label className="field-label">Application message<textarea rows={3} maxLength={2000} value={draft.message} onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))} /></label>
            <label className="field-label">Attachments (optional)<input type="file" multiple accept=".pdf,image/jpeg,image/png,image/webp" disabled={uploadingAttachments} onChange={(event) => { void handleAttachmentFiles(event.currentTarget.files); event.currentTarget.value = ""; }} /></label>
            {draftAttachments.length > 0 && <p className="member-form-attachments">{draftAttachments.map((attachment) => attachment.fileName).join(", ")}</p>}
            {error && <div className="storage-error" role="alert">{error}</div>}
            <div className="modal-actions"><button type="button" className="button-secondary" disabled={saving || uploadingAttachments} onClick={() => setNewApplication(false)}>Cancel</button><button type="submit" className="button-primary" disabled={saving || uploadingAttachments}>{uploadingAttachments ? "Uploading…" : saving ? "Saving…" : "Save application"}</button></div>
          </form>
        </div>
      )}

      {attachmentPreview && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setAttachmentPreview(null)}>
          <section className="action-modal member-attachment-modal" aria-label={`Preview ${attachmentPreview.fileName}`}>
            <div className="member-modal-heading"><h2>{attachmentPreview.fileName}</h2><button type="button" className="button-secondary" onClick={() => setAttachmentPreview(null)}>Close</button></div>
            {attachmentPreview.mimeType.startsWith("image/")
              ? <img src={`data:${attachmentPreview.mimeType};base64,${attachmentPreview.base64Data}`} alt={attachmentPreview.fileName} />
              : <iframe title={attachmentPreview.fileName} src={`data:${attachmentPreview.mimeType};base64,${attachmentPreview.base64Data}`} />}
            <button type="button" className="button-primary" onClick={downloadAttachment}>Download attachment</button>
          </section>
        </div>
      )}
    </section>
  );
}

const quickActions: { label: string; icon: IconName; tone: string }[] = [
  { label: "Add Member", icon: "members", tone: "blue" },
  { label: "Publish News", icon: "file", tone: "blue" },
  { label: "Manage Divisions", icon: "divisions", tone: "green" },
  { label: "Update Website Content", icon: "website", tone: "purple" },
];

function Logo() {
  return (
    <div className="brand-lockup" aria-label="KILIVO LABS">
      <svg className="brand-mark" viewBox="0 0 96 96" aria-hidden="true">
        <path d="M24 16h15v64H24zM39 47l31-31h20L53 49l38 31H68L39 58z" />
        <path className="brand-swoosh" d="m40 52 48-27-5 9-38 28z" />
      </svg>
      <strong>KILIVO LABS</strong>
      <span>Build. Innovate. Empower.</span>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [openPanel, setOpenPanel] = useState<"search" | "notifications" | "profile" | null>(null);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [memberWorkspace, setMemberWorkspace] = useState<MemberWorkspaceData | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [memberStorageError, setMemberStorageError] = useState("");
  const [createRequest, setCreateRequest] = useState(0);

  useEffect(() => {
    let active = true;
    invoke<ContentRecord[]>("load_content")
      .then((loadedRecords) => {
        if (active) setRecords(loadedRecords);
      })
      .catch((error: unknown) => {
        if (active) setStorageError(`Could not open this computer's content store: ${String(error)}`);
      })
      .finally(() => {
        if (active) setContentLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    invoke<MemberWorkspaceData>("load_member_workspace")
      .then((loadedWorkspace) => {
        if (active) setMemberWorkspace(loadedWorkspace);
      })
      .catch((error: unknown) => {
        if (active) setMemberStorageError(`Could not open this computer's member store: ${String(error)}`);
      })
      .finally(() => {
        if (active) setMemberLoading(false);
      });
    return () => { active = false; };
  }, []);

  const visibleNavigation = useMemo(
    () => navigation.filter((item) =>
      `${item.label} ${item.children?.join(" ") ?? ""}`.toLowerCase().includes(search.toLowerCase()),
    ),
    [search],
  );

  function toggleExpanded(label: string) {
    setExpanded((current) => current.includes(label)
      ? current.filter((item) => item !== label)
      : [...current, label]);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function navigate(section: string) {
    setActiveSection(section);
    setSidebarOpen(false);
    setOpenPanel(null);
  }

  function runQuickAction(label: string) {
    const destinations: Record<string, { section: string; create?: boolean }> = {
      "Add Member": { section: "Member Directory" },
      "Publish News": { section: "Articles", create: true },
      "Manage Divisions": { section: "Divisions" },
      "Update Website Content": { section: "Website Pages", create: true },
    };
    const destination = destinations[label];
    if (!destination) return;
    navigate(destination.section);
    if (destination.create) setCreateRequest((request) => request + 1);
  }

  async function saveRecord(record: ContentRecord) {
    const saved = await invoke<ContentRecord>("save_content", { record });
    setRecords((current) => current.some((item) => item.id === saved.id)
      ? current.map((item) => item.id === saved.id ? saved : item)
      : [saved, ...current]);
    showToast(`Saved “${saved.title}” on this computer.`);
  }

  async function removeRecord(id: string) {
    await invoke("delete_content", { id });
    setRecords((current) => current.filter((record) => record.id !== id));
    showToast("Content deleted from this computer.");
  }

  async function saveMemberWorkspace(workspace: MemberWorkspaceData) {
    const saved = await invoke<MemberWorkspaceData>("save_member_workspace", { workspace });
    setMemberWorkspace(saved);
  }

  const isDashboard = activeSection === "Dashboard";
  const isCompanyOverview = activeSection === "Company Overview";
  const isMemberDirectory = activeSection === "Member Directory";
  const contentSection = sectionContent[activeSection];
  const metricValues: Record<string, string> = {
    Company: String(records.filter((record) => record.kind === "company").length),
    Divisions: String(records.filter((record) => record.kind === "division").length),
    Members: memberWorkspace ? String(memberWorkspace.members.length) : "—",
    Projects: String(records.filter((record) => record.kind === "project").length),
    "News Articles": String(records.filter((record) => record.kind === "news").length),
  };
  const companyProfile = records.find((record) => record.kind === "company")
    ?? { ...createRecord("company"), id: "company-profile", title: "KILIVO LABS" };
  const divisionRecords = records.filter((record) => record.kind === "division");
  const recentRecords = [...records]
    .sort((left, right) => Number(right.updatedAt) - Number(left.updatedAt))
    .slice(0, 5);
  const localTime = new Intl.DateTimeFormat("en-TZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Dar_es_Salaam",
  }).format(new Date());

  return (
    <div className="app-shell">
      <aside className={`sidebar${sidebarOpen ? " sidebar--open" : ""}`}>
        <Logo />
        <nav className="side-nav" aria-label="Admin navigation">
          {visibleNavigation.map((item) => {
            const isActive = activeSection === item.label || item.children?.includes(activeSection);
            const isExpanded = expanded.includes(item.label);
            return (
              <div className="nav-group" key={item.label}>
                <button
                  type="button"
                  className={`nav-item${isActive ? " nav-item--active" : ""}`}
                  onClick={() => item.children ? toggleExpanded(item.label) : navigate(item.label)}
                  aria-expanded={item.children ? isExpanded : undefined}
                >
                  <Icon name={item.icon} size={21} />
                  <span>{item.label}</span>
                  {item.children && <Icon className={`nav-chevron${isExpanded ? " is-open" : ""}`} name="chevron" size={16} />}
                </button>
                {item.children && isExpanded && (
                  <div className="nav-submenu">
                    {item.children.map((child) => (
                      <button
                        key={child}
                        type="button"
                        className={activeSection === child ? "nav-subitem nav-subitem--active" : "nav-subitem"}
                        onClick={() => navigate(child)}
                      >
                        <span className="submenu-dot" />
                        {child}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="system-status"><span className="status-dot" />{isCompanyOverview ? "Company Overview API" : "Local content storage"}</div>
          <span className="sidebar-time">{localTime}</span>
          <button type="button" className="sidebar-account" onClick={() => setOpenPanel(openPanel === "profile" ? null : "profile")}>
            <span className="avatar avatar--large"><Icon name="person" size={28} /></span>
            <span><strong>Super Admin</strong><small>Admin</small></span>
            <Icon name="chevron" size={16} />
          </button>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <div className="workspace">
        <header className="topbar">
          <button className="mobile-menu icon-button" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
            <Icon name="menu" size={23} />
          </button>
          <div className="global-search">
            <Icon name="search" size={22} />
            <input
              aria-label="Search navigation"
              placeholder="Search anything..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setOpenPanel("search");
              }}
              onFocus={() => setOpenPanel("search")}
            />
            {openPanel === "search" && search && (
              <div className="popover search-popover">
                <div className="popover-title">Navigation results</div>
                {visibleNavigation.length ? visibleNavigation.slice(0, 6).map((item) => (
                  <button key={item.label} type="button" onClick={() => navigate(item.label)}>
                    <Icon name={item.icon} size={17} />{item.label}
                  </button>
                )) : <p className="popover-empty">No admin sections match “{search}”.</p>}
              </div>
            )}
          </div>
          <div className="topbar-spacer" />
          <div className="popover-anchor">
            <button
              className="icon-button notification-button"
              type="button"
              aria-label="Notifications"
              onClick={() => setOpenPanel(openPanel === "notifications" ? null : "notifications")}
            >
              <Icon name="bell" size={22} />
            </button>
            {openPanel === "notifications" && (
              <div className="popover notification-popover">
                <div className="popover-title">Notifications</div>
                <p className="popover-empty">Notifications are not available in local desktop mode.</p>
              </div>
            )}
          </div>
          <div className="topbar-divider" />
          <div className="popover-anchor">
            <button className="profile-button" type="button" onClick={() => setOpenPanel(openPanel === "profile" ? null : "profile")}>
              <span className="avatar"><Icon name="person" size={22} /></span>
              <span className="profile-copy"><strong>Mudhihiri Selemani</strong><small>Super Admin</small></span>
              <Icon name="chevron" size={16} />
            </button>
            {openPanel === "profile" && (
              <div className="popover profile-popover">
                <div className="profile-popover-heading"><strong>Mudhihiri Selemani</strong><span>Super Admin</span></div>
                <button type="button" onClick={() => navigate("General Settings")}><Icon name="person" size={17} />Admin profile</button>
                <button type="button" onClick={() => navigate("General Settings")}><Icon name="settings" size={17} />Account settings</button>
                <button type="button" onClick={() => showToast("Sign out is not connected in this preview.")}><Icon name="audit" size={17} />Sign out</button>
              </div>
            )}
          </div>
        </header>

        <main className="main-content" onClick={() => openPanel && openPanel !== "search" && setOpenPanel(null)}>
          {!isMemberDirectory && (
            <section className="page-heading">
              <div className="heading-copy">
                <div className="heading-title">
                  <span className="heading-icon"><Icon name={isDashboard ? "analytics" : "company"} size={32} /></span>
                  <h1>{isDashboard ? "Admin Dashboard" : activeSection}</h1>
                </div>
                <p>{isDashboard
                  ? "Manage KILIVO LABS ecosystem — Company, Members, Divisions, Projects and Public Presence"
                  : isCompanyOverview
                    ? "Read current company progress, plans, divisions and financial summary from the API."
                    : `${activeSection} management workspace for the KILIVO LABS ecosystem.`}</p>
              </div>
              <span className="preview-chip"><Icon name="history" size={14} />{isCompanyOverview ? "GET API · Read-only" : "This desktop only"}</span>
            </section>
          )}

          {storageError && !isCompanyOverview && <div className="storage-error" role="alert">{storageError}</div>}

          {isCompanyOverview ? (
            <CompanyOverviewWorkspace apiBaseUrl={import.meta.env.VITE_ADMIN_API_BASE_URL ?? ""} />
          ) : activeSection === "Company Profile" ? (
            <CompanyProfileWorkspace
              profile={companyProfile}
              divisions={divisionRecords}
              loading={contentLoading}
              storageError={storageError}
              onSave={saveRecord}
            />
          ) : activeSection === "Divisions" ? (
            <DivisionsWorkspace
              divisions={divisionRecords}
              records={records}
              loading={contentLoading}
              storageError={storageError}
              onSave={saveRecord}
              onDelete={removeRecord}
            />
          ) : isMemberDirectory ? (
            <MemberManagementWorkspace
              workspace={memberWorkspace}
              loading={memberLoading}
              storageError={memberStorageError}
              onSave={saveMemberWorkspace}
            />
          ) : contentSection ? (
            <ContentWorkspace
              key={activeSection}
              title={contentSection.title}
              kind={contentSection.kind}
              records={records}
              loading={contentLoading}
              storageError={storageError}
              createRequest={createRequest}
              onCreateRequestHandled={() => setCreateRequest(0)}
              onSave={saveRecord}
              onDelete={removeRecord}
              divisionOptions={divisionRecords}
              memberOptions={memberWorkspace?.members ?? []}
              workspaceNote={["page", "navigation", "seo"].includes(contentSection.kind)
                ? "Public website only · This content is not used by the mobile workers app."
                : ["assignment", "event", "document"].includes(contentSection.kind)
                  ? "Workers app workspace · Stored on this computer only and not yet available to mobile members."
                  : "News and announcements are stored locally; choose a division association if relevant."}
            />
          ) : !isDashboard ? (
            <section className="module-placeholder">
              <span className="module-icon"><Icon name="company" size={29} /></span>
              <h2>{activeSection}</h2>
              <p>{activeSection.includes("Member") || activeSection.includes("Roles")
                ? "The Members page stores local mock profiles and categories only. Real login accounts, admin permissions, and secure invitations need a shared identity service."
                : "This section is not part of the local content editor yet."}</p>
              <span className="preview-chip"><Icon name="history" size={14} />Stored on this desktop only</span>
              <button className="button-primary module-back" type="button" onClick={() => navigate("Dashboard")}>Back to dashboard</button>
            </section>
          ) : (
            <>
              <section className="metric-grid" aria-label="KILIVO overview metrics">
                {metrics.map((metric) => (
                  <button className={`metric-card metric-${metric.tone}`} key={metric.label} type="button" onClick={() => navigate(metric.section)}>
                    <span className="metric-icon"><Icon name={metric.icon} size={32} /></span>
                    <span className="metric-data"><strong>{metricValues[metric.label] ?? metric.value}</strong><span>{metric.label}</span></span>
                    <span className="metric-link">View Details <Icon name="arrow" size={17} /></span>
                  </button>
                ))}
              </section>

              <section className="overview-grid">
                <article className="panel system-panel">
                  <div className="panel-heading">
                    <h2><Icon name="chart" size={23} />System Overview</h2>
                    <span className="analytics-status">No tracking data</span>
                  </div>
                  <div className="analytics-empty">
                    <span className="analytics-empty-icon"><Icon name="chart" size={28} /></span>
                    <strong>Website and app analytics are not connected.</strong>
                    <span>This desktop-only content store does not collect visitor or member activity.</span>
                  </div>
                </article>

                <article className="panel divisions-panel">
                  <div className="panel-heading"><h2><Icon name="members" size={23} />Divisions Overview</h2><button className="text-link" type="button" onClick={() => navigate("Divisions")}>Manage</button></div>
                  <div className="division-list">
                    {records.filter((record) => record.kind === "division").map((record) => (
                      <button className="division-list-row" type="button" key={record.id} onClick={() => navigate("Divisions")}>
                        <i className="legend-dot legend-blue" /><span>{record.title}</span><small>{record.status}</small>
                      </button>
                    ))}
                    {!records.some((record) => record.kind === "division") && <p className="local-empty">Add divisions to get started.</p>}
                  </div>
                  <div className="chart-disclaimer">Saved on this computer.</div>
                </article>

                <article className="panel quick-panel">
                  <div className="panel-heading"><h2><Icon name="bolt" size={23} />Quick Actions</h2></div>
                  <div className="quick-actions">
                    {quickActions.map((action) => (
                      <button type="button" className={`quick-button quick-${action.tone}`} key={action.label} onClick={() => runQuickAction(action.label)}>
                        <Icon name={action.icon} size={20} />{action.label}
                      </button>
                    ))}
                  </div>
                </article>
              </section>

              <section className="bottom-grid">
                <article className="panel activity-panel">
                  <div className="panel-heading"><h2><Icon name="history" size={23} />Recently Updated</h2></div>
                  <div className="activity-list">
                    {recentRecords.map((record) => (
                      <div className="activity-row" key={record.id}>
                        <span className="activity-icon tone-blue"><Icon name={record.kind === "project" || record.kind === "impact" ? "folder" : record.kind === "division" ? "company" : "file"} size={16} /></span>
                        <span className="activity-message">{record.status === "published" ? "Published" : "Updated"} {record.kind}: {record.title}</span>
                        <time>{new Date(Number(record.updatedAt) * 1000).toLocaleDateString()}</time>
                      </div>
                    ))}
                  </div>
                  <div className="chart-disclaimer">Recent local content records · No shared audit log.</div>
                </article>

                <article className="panel news-panel">
                  <div className="panel-heading"><h2><Icon name="news" size={22} />Latest News</h2><button className="text-link" type="button" onClick={() => navigate("Articles")}>View All <Icon name="arrow" size={15} /></button></div>
                  {records.filter((record) => record.kind === "news").slice(0, 1).map((record) => (
                    <div className="news-preview" key={record.id}>
                      <ImageThumbnail filename={record.image} alt={record.title} />
                      <div className="news-copy">
                        <strong>{record.title}</strong>
                        <p>{record.summary}</p>
                        <time><Icon name="calendar" size={14} />{new Date(Number(record.updatedAt) * 1000).toLocaleDateString()}</time>
                      </div>
                    </div>
                  ))}
                  {!records.some((record) => record.kind === "news") && <p className="local-empty">Add a news article to show it here.</p>}
                  <div className="carousel-dots" aria-label="News preview pagination">
                    {records.filter((record) => record.kind === "news").slice(0, 4).map((record, index) => <button className={index === 0 ? "is-current" : ""} type="button" key={record.id} aria-label={`News ${index + 1}`} />)}
                  </div>
                </article>

                <article className="panel impact-panel">
                  <div className="panel-heading"><h2><Icon name="impact" size={23} />Community Impact</h2><button className="text-link" type="button" onClick={() => navigate("Divisions")}>View Details <Icon name="arrow" size={15} /></button></div>
                  <div className="impact-content">
                    <div className="impact-art"><Icon name="impact" size={44} /><span>TOGETHER<br />WE GROW</span></div>
                    <div className="impact-stats">
                      <strong>{records.filter((record) => record.kind === "impact").length}<small>Impact Programs</small></strong>
                      <strong>—<small>Support totals are shown in Company Overview</small></strong>
                    </div>
                  </div>
                  <div className="impact-tagline">Together for a Better Tomorrow</div>
                </article>
              </section>

              <p className="page-footnote">Local desktop content only. Changes here are not shared with Kilivo_web or the mobile app.</p>
            </>
          )}
        </main>
      </div>

      {toast && <div className="toast-message"><Icon name="check" size={17} />{toast}</div>}
    </div>
  );
}

function ContentWorkspace({
  title,
  kind,
  records,
  loading,
  storageError,
  createRequest,
  onCreateRequestHandled,
  onSave,
  onDelete,
  divisionOptions = [],
  memberOptions = [],
  fixedDivisionId,
  workspaceNote = "Local desktop editor · Content and uploads are not shared with the website or mobile app.",
}: {
  title: string;
  kind: ContentKind;
  records: ContentRecord[];
  loading: boolean;
  storageError: string;
  createRequest: number;
  onCreateRequestHandled: () => void;
  onSave: (record: ContentRecord) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  divisionOptions?: ContentRecord[];
  memberOptions?: MemberRecord[];
  fixedDivisionId?: string;
  workspaceNote?: string;
}) {
  const [editing, setEditing] = useState<ContentRecord | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContentRecord["status"]>("all");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (createRequest > 0) {
      setEditing(createRecord(kind, fixedDivisionId ?? null));
      setImagePreview(null);
      setError("");
      onCreateRequestHandled();
    }
  }, [createRequest, fixedDivisionId, kind, onCreateRequestHandled]);

  const visibleRecords = records
    .filter((record) => record.kind === kind)
    .filter((record) => fixedDivisionId === undefined || record.divisionId === fixedDivisionId)
    .filter((record) => statusFilter === "all" || record.status === statusFilter)
    .filter((record) => `${record.title} ${record.summary} ${record.body} ${record.assignee ?? ""} ${record.location ?? ""} ${record.resourceFileName ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    .sort((left, right) => Number(right.updatedAt) - Number(left.updatedAt));

  function startEditing(record: ContentRecord) {
    setEditing({ ...record });
    setImagePreview(null);
    setError("");
  }

  async function uploadImage(file: File) {
    setError("");
    setUploading(true);
    try {
      const filename = await uploadLocalImage(file);
      const storedImage = await invoke<string | null>("load_image", { filename });
      setEditing((current) => current ? { ...current, image: filename } : current);
      setImagePreview(storedImage ? `data:${storedImage}` : null);
    } catch (uploadError) {
      setError(`Image upload failed: ${String(uploadError)}`);
    } finally {
      setUploading(false);
    }
  }

  async function uploadDocument(file: File) {
    setError("");
    setUploading(true);
    try {
      const resource = await uploadResourceFile(file);
      setEditing((current) => current ? {
        ...current,
        resourceFileId: resource.id,
        resourceFileName: resource.fileName,
        resourceMimeType: resource.mimeType,
        resourceSizeBytes: resource.sizeBytes,
      } : current);
    } catch (uploadError) {
      setError(`Resource upload failed: ${String(uploadError)}`);
    } finally {
      setUploading(false);
    }
  }

  async function downloadDocument(record: ContentRecord) {
    if (!record.resourceFileId) return;
    setError("");
    try {
      const payload = await invoke<ResourceFilePayload>("load_resource_file", { id: record.resourceFileId });
      const bytes = Uint8Array.from(atob(payload.base64Data), (character) => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: payload.mimeType }));
      const link = document.createElement("a");
      link.href = url;
      link.download = payload.fileName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(`Could not download the local resource: ${String(downloadError)}`);
    }
  }

  async function save() {
    if (!editing) return;
    setError("");
    if (kind === "assignment" && editing.status === "published"
      && !memberOptions.some((member) => member.email === editing.assignee && member.status === "active")) {
      setError("Choose an active member before making this assignment available in the workers app.");
      return;
    }
    if (kind === "event" && editing.status === "published" && !editing.startsAt) {
      setError("Add the event date and time before making it available in the workers app.");
      return;
    }
    if (kind === "document" && editing.status === "published" && !editing.resourceFileId) {
      setError("Attach a resource file before making it available to members.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...editing,
        title: editing.title.trim(),
        summary: editing.summary.trim(),
        body: editing.body.trim(),
        divisionId: fixedDivisionId ?? editing.divisionId,
        workStatus: kind === "assignment" ? editing.workStatus ?? "not_started" : editing.workStatus,
      });
      setEditing(null);
      setImagePreview(null);
    } catch (saveError) {
      setError(`Could not save this item: ${String(saveError)}`);
    } finally {
      setSaving(false);
    }
  }

  async function remove(record: ContentRecord) {
    if (!window.confirm(`Delete “${record.title}” from this computer? This cannot be undone.`)) return;
    setError("");
    try {
      await onDelete(record.id);
    } catch (deleteError) {
      setError(`Could not delete this item: ${String(deleteError)}`);
    }
  }

  const update = (field: keyof ContentRecord, value: string | null) => {
    setEditing((current) => current ? { ...current, [field]: value } : current);
  };

  const titleFieldLabel = kind === "navigation"
    ? "Menu item label"
    : kind === "seo"
      ? "Page or route"
      : "Title";
  const summaryFieldLabel = kind === "navigation"
    ? "Link destination"
    : kind === "seo"
      ? "Meta description"
      : "Short description";
  const bodyFieldLabel = kind === "navigation"
    ? "Accessible description"
    : kind === "seo"
      ? "Keywords or social metadata"
      : "Content";

  if (editing) {
    return (
      <section className="content-editor">
        <div className="editor-heading">
          <div>
            <span className="editor-eyebrow">LOCAL CONTENT · {editing.status === "published" ? "PUBLISHED LOCALLY" : "DRAFT"}</span>
            <h2>{records.some((record) => record.id === editing.id) ? "Edit item" : "Create item"}</h2>
          </div>
          <button type="button" className="button-secondary" disabled={saving || uploading} onClick={() => { setEditing(null); setImagePreview(null); setError(""); }}>Cancel</button>
        </div>

        {error && <div className="storage-error" role="alert">{error}</div>}
        {storageError && <div className="storage-error" role="alert">{storageError}</div>}

        <div className="editor-grid">
          <div className="editor-fields">
            <label className="field-label">
              {titleFieldLabel} <span>*</span>
              <input value={editing.title} maxLength={140} required onChange={(event) => update("title", event.target.value)} placeholder={`Enter ${titleFieldLabel.toLowerCase()}`} />
            </label>
            <label className="field-label">
              {summaryFieldLabel}
              <textarea value={editing.summary} maxLength={300} rows={3} onChange={(event) => update("summary", event.target.value)} placeholder={kind === "navigation" ? "/about or #about" : kind === "seo" ? "Describe this page for search results" : "A short summary for cards and previews"} />
            </label>
            <label className="field-label">
              {bodyFieldLabel}
              <textarea className="body-field" value={editing.body} rows={9} onChange={(event) => update("body", event.target.value)} placeholder={kind === "navigation" ? "Optional text for assistive technology" : kind === "seo" ? "Comma-separated keywords or social metadata" : "Write the full content"} />
            </label>
            {kind === "assignment" && (
              <>
                <label className="field-label">Assign to active member
                  <select value={editing.assignee ?? ""} onChange={(event) => update("assignee", event.target.value || null)}>
                    <option value="">Select a member</option>
                    {editing.assignee && !memberOptions.some((member) => member.email === editing.assignee) && <option value={editing.assignee}>Unavailable member · {editing.assignee}</option>}
                    {memberOptions.filter((member) => member.status === "active").map((member) => <option value={member.email} key={member.id}>{member.fullName} · {member.email}</option>)}
                  </select>
                </label>
                <label className="field-label">Due date<input type="date" value={editing.dueDate ?? ""} onChange={(event) => update("dueDate", event.target.value || null)} /></label>
                <label className="field-label">Work status<select value={editing.workStatus ?? "not_started"} onChange={(event) => update("workStatus", event.target.value)}><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></label>
              </>
            )}
            {kind === "event" && (
              <>
                <label className="field-label">Date and time<input type="datetime-local" value={editing.startsAt ?? ""} onChange={(event) => update("startsAt", event.target.value || null)} /></label>
                <label className="field-label">Location or meeting link<input value={editing.location ?? ""} maxLength={240} onChange={(event) => update("location", event.target.value || null)} placeholder="Venue, online link, or hybrid details" /></label>
              </>
            )}
            {(kind === "document" || kind === "assignment" || kind === "event" || ((kind === "news" || kind === "announcement") && fixedDivisionId === undefined)) && (
              <label className="field-label">
                {kind === "document" ? "Available to" : "Associated division"}
                {kind !== "document" && <span>(optional)</span>}
                <select value={editing.divisionId ?? ""} onChange={(event) => update("divisionId", event.target.value || null)}>
                  <option value="">{kind === "document" ? "All members" : "Company-wide / no specific division"}</option>
                  {divisionOptions.map((division) => <option value={division.id} key={division.id}>{division.title}</option>)}
                </select>
              </label>
            )}
            <label className="field-label">
              {kind === "assignment" || kind === "event" || kind === "document" ? "Workers app visibility" : "Local status"}
              <select value={editing.status} onChange={(event) => update("status", event.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">{kind === "assignment" || kind === "event" || kind === "document" ? "Available in local app preview" : "Published locally"}</option>
              </select>
            </label>
            {(kind === "news" || kind === "announcement") && fixedDivisionId === undefined && (
              <p className="field-hint">Choose a division above only when this item belongs to one; otherwise it remains company-wide.</p>
            )}
            {kind === "document" && (
              <div className="resource-file-field">
                <span className="field-label">Resource file</span>
                {editing.resourceFileName ? (
                  <div className="resource-file-current">
                    <span><strong>{editing.resourceFileName}</strong><small>{editing.resourceMimeType} · {Math.ceil((editing.resourceSizeBytes ?? 0) / 1024)} KB</small></span>
                    <button className="remove-image-button" type="button" disabled={uploading || saving} onClick={() => setEditing((current) => current ? {
                      ...current,
                      resourceFileId: null,
                      resourceFileName: null,
                      resourceMimeType: null,
                      resourceSizeBytes: null,
                    } : current)}>Remove file</button>
                  </div>
                ) : <p className="upload-help">No file attached. Upload a PDF, DOCX, XLSX, or PPTX file.</p>}
                <label className={`upload-button${uploading ? " is-disabled" : ""}`}>
                  <Icon name="upload" size={17} />{uploading ? "Uploading…" : editing.resourceFileName ? "Replace resource file" : "Choose resource file"}
                  <input type="file" accept=".pdf,.docx,.xlsx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation" disabled={uploading || saving} onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) void uploadDocument(file);
                    event.currentTarget.value = "";
                  }} />
                </label>
                <p className="upload-help">Up to 10 MB. Stored in this app’s local data folder; it is not yet available to the mobile app.</p>
              </div>
            )}
          </div>

          <aside className="editor-aside">
            {kind !== "navigation" && kind !== "document" && <span className="field-label">{kind === "seo" ? "Social sharing image" : "Featured image"}</span>}
            {kind !== "navigation" && kind !== "document" && <>
              <div className="upload-preview">
                {imagePreview
                  ? <img className="content-image" src={imagePreview} alt="Selected upload preview" />
                  : <ImageThumbnail filename={editing.image} alt={editing.title || "Featured image"} />}
              </div>
              <label className={`upload-button${uploading ? " is-disabled" : ""}`}>
                <Icon name="upload" size={17} />{uploading ? "Uploading…" : "Choose image"}
                <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading || saving} onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) void uploadImage(file);
                  event.currentTarget.value = "";
                }} />
              </label>
              {editing.image && <button className="remove-image-button" type="button" disabled={uploading || saving} onClick={() => { update("image", null); setImagePreview(null); }}>Remove image</button>}
              <p className="upload-help">PNG, JPEG or WebP · up to 10 MB. Stored in this app’s local data folder.</p>
            </>}
            <div className="local-storage-note"><Icon name="history" size={16} />Saving changes stores them on this computer only. They are not sent to Kilivo_web or the mobile app.</div>
          </aside>
        </div>

        <div className="editor-actions">
          <button type="button" className="button-secondary" disabled={saving || uploading} onClick={() => { setEditing(null); setImagePreview(null); setError(""); }}>Cancel</button>
          <button type="button" className="button-primary" disabled={saving || uploading || !editing.title.trim()} onClick={() => void save()}>
            <Icon name="save" size={17} />{saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="content-workspace">
      <div className="content-toolbar">
        <div className="content-count"><strong>{visibleRecords.length}</strong><span>{title.toLowerCase()}</span></div>
        <div className="content-controls">
          <label className="content-search"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} aria-label={`Search ${title}`} /></label>
          <select className="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} aria-label="Filter by publishing status">
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published locally</option>
          </select>
          <button className="button-primary create-content-button" type="button" disabled={Boolean(storageError) || loading} onClick={() => { setEditing(createRecord(kind, fixedDivisionId ?? null)); setImagePreview(null); setError(""); }}>
            <Icon name="plus" size={18} />New item
          </button>
        </div>
      </div>

      {storageError && <div className="storage-error" role="alert">{storageError}</div>}
      {error && <div className="storage-error" role="alert">{error}</div>}
      {loading ? (
        <div className="content-empty"><span className="loading-spinner" />Loading locally saved content…</div>
      ) : visibleRecords.length ? (
        <div className="content-card-grid">
          {visibleRecords.map((record) => (
            <article className="content-card" key={record.id}>
              <ImageThumbnail filename={record.image} alt={record.title} />
              <div className="content-card-main">
                <div className="content-card-topline">
                  <span className={`status-badge status-${record.status}`}>{record.status === "published"
                    ? ["assignment", "event", "document"].includes(kind) ? "Available in local preview" : "Published locally"
                    : "Draft"}</span>
                  <time>{new Date(Number(record.updatedAt) * 1000).toLocaleDateString()}</time>
                </div>
                {(kind === "news" || kind === "announcement") && (
                  <span className="content-card-division">
                    {divisionOptions.find((division) => division.id === record.divisionId)?.title ?? "Company-wide"}
                  </span>
                )}
                <h3>{record.title}</h3>
                <p>{record.summary || record.body || "No description added."}</p>
                {kind === "assignment" && <small className="record-meta">{record.assignee ? `Assigned to ${memberOptions.find((member) => member.email === record.assignee)?.fullName ?? record.assignee}` : "No member assigned"}{record.dueDate ? ` · Due ${record.dueDate}` : ""} · ${(record.workStatus ?? "not_started").replace("_", " ")}</small>}
                {kind === "event" && <small className="record-meta">{record.startsAt ? new Date(record.startsAt).toLocaleString() : "Date not set"}{record.location ? ` · ${record.location}` : ""}</small>}
                {kind === "document" && <small className="record-meta">{record.resourceFileName ?? "No file attached"} · {record.divisionId ? divisionOptions.find((division) => division.id === record.divisionId)?.title ?? "Division" : "All members"}</small>}
                <div className="content-card-actions">
                  <button type="button" onClick={() => startEditing(record)}><Icon name="edit" size={16} />Edit</button>
                  {kind === "document" && record.resourceFileId && <button type="button" onClick={() => void downloadDocument(record)}><Icon name="file" size={16} />Download</button>}
                  <button type="button" className="delete-action" onClick={() => void remove(record)}><Icon name="trash" size={16} />Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="content-empty">
          <span className="module-icon"><Icon name={kind === "news" ? "news" : kind === "project" || kind === "impact" || kind === "assignment" ? "projects" : kind === "event" ? "calendar" : kind === "document" ? "file" : kind === "division" ? "divisions" : kind === "page" || kind === "navigation" || kind === "seo" ? "website" : "company"} size={27} /></span>
          <strong>{query ? "No matching content" : `No ${title.toLowerCase()} yet`}</strong>
          <span>{query ? "Try another search." : "Create the first item; it will be stored on this computer."}</span>
        </div>
      )}
      <p className="local-scope-note">{workspaceNote}</p>
    </section>
  );
}

export default App;
