import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ROLES = { ADMIN: "Admin", DISCOVERER: "Event Discoverer", ELAM: "Elam Department", COPYRIGHT: "Copyright Department" };
const PLATFORMS = ["Instagram","YouTube","Facebook","TikTok","Telegram","WhatsApp","X/Twitter","Website"];
const PRIORITIES = ["Low","Medium","High","Critical"];
const TAGS = ["Ashara Preparation","Ashara Fazal","Pehli Tareekh","Ashara Mubarak Day 1","Ashara Mubarak Day 2","Ashara Mubarak Day 3","Ashara Mubarak Day 4","Ashara Mubarak Day 5","Ashara Mubarak Day 6","Ashara Mubarak Day 7","Ashara Mubarak Day 8","Ashara Mubarak Day 9","Ashura Day","Majlis","Waaz","Salaam","Matam","Qadam","Ziyafat","Relay Video","Confidential Recording","Bayan Summary","WhatsApp PDF","Tawsurat"];
const ZONES = ["Relay Video Zone","Ashara Video Zone","Fazal Zone","Majlis Zone","Confidential Zone","Monitoring Zone"];
const CALL_STATUSES = ["Called","No Response","Resolved","Refused","Follow-up Needed"];
const CONTENT_TYPES = ["Unauthorized Video","Unauthorized Photo","Bayan Summary","WhatsApp PDF","Tawsurat","Relay Video","Confidential Recording","Social Media Repost","Sensitive Content"];

const HIGH_URGENCY_TAGS = ["Tawsurat","Confidential Recording","Bayan Summary","WhatsApp PDF","Relay Video"];

const PLATFORM_COLORS = {
  Instagram: "#E1306C", YouTube: "#FF0000", Facebook: "#1877F2",
  TikTok: "#69C9D0", Telegram: "#0088CC", WhatsApp: "#25D366",
  "X/Twitter": "#FFFFFF", Website: "#8B5CF6"
};

const PLATFORM_ICONS = {
  Instagram: "📸", YouTube: "▶️", Facebook: "👥", TikTok: "🎵",
  Telegram: "✈️", WhatsApp: "💬", "X/Twitter": "𝕏", Website: "🌐"
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_REPORTS = [
  { id: "ASH1448-2024-0001", subId: "SUB-0001", urls: ["https://instagram.com/reel/abc123"], platform: "Instagram", submittedBy: "Ahmed Hussain", tags: ["Ashara Mubarak Day 3","Waaz"], priority: "Critical", zone: "Ashara Video Zone", status: "Assigned", department: "Elam Department", contentType: "Unauthorized Video", timestamp: "2024-06-15 09:23", uploaderKnown: true, uploaderName: "Mohammad Ali", uploaderContact: "+91 98765 43210", uploaderJamaat: "Bhendi Bazaar", notes: "Video of full waaz circulating", callStatus: "Called", elmId: "ELM-0001" },
  { id: "ASH1448-2024-0002", subId: "SUB-0002", urls: ["https://youtube.com/watch?v=xyz789","https://tiktok.com/@user/video/123"], platform: "YouTube", submittedBy: "Fatema Bohra", tags: ["Tawsurat","Confidential Recording"], priority: "Critical", zone: "Confidential Zone", status: "Pending", department: null, contentType: "Tawsurat", timestamp: "2024-06-15 10:45", uploaderKnown: false, notes: "Tawsurat clips, multiple platforms", callStatus: null, crId: "CR-0001" },
  { id: "ASH1448-2024-0003", subId: "SUB-0003", urls: ["https://facebook.com/video/def456"], platform: "Facebook", submittedBy: "Taher Rangwala", tags: ["Bayan Summary","WhatsApp PDF"], priority: "High", zone: "Majlis Zone", status: "In Progress", department: "Copyright Department", contentType: "Bayan Summary", timestamp: "2024-06-15 11:15", uploaderKnown: true, uploaderName: "Hussain Contractor", uploaderContact: "+91 87654 32109", uploaderJamaat: "Dongri", notes: "PDF summary circulating", callStatus: "No Response", crId: "CR-0002" },
  { id: "ASH1448-2024-0004", subId: "SUB-0004", urls: ["https://telegram.me/channel/ghi012"], platform: "Telegram", submittedBy: "Sakina Merchant", tags: ["Relay Video","Ashara Mubarak Day 5"], priority: "High", zone: "Relay Video Zone", status: "Resolved", department: "Elam Department", contentType: "Relay Video", timestamp: "2024-06-14 14:30", uploaderKnown: false, notes: "Relay video posted publicly", callStatus: "Resolved", elmId: "ELM-0002" },
  { id: "ASH1448-2024-0005", subId: "SUB-0005", urls: ["https://twitter.com/user/status/jkl345"], platform: "X/Twitter", submittedBy: "Mustafa Lokhandwala", tags: ["Salaam","Matam"], priority: "Medium", zone: "Ashara Video Zone", status: "Pending", department: null, contentType: "Unauthorized Video", timestamp: "2024-06-14 16:00", uploaderKnown: false, notes: "Salaam clips on Twitter", callStatus: null },
  { id: "ASH1448-2024-0006", subId: "SUB-0006", urls: ["https://whatsapp.com/link/mno678"], platform: "WhatsApp", submittedBy: "Zainab Kapasi", tags: ["WhatsApp PDF","Ashara Mubarak Day 1"], priority: "Critical", zone: "Fazal Zone", status: "Assigned", department: "Copyright Department", contentType: "WhatsApp PDF", timestamp: "2024-06-13 08:00", uploaderKnown: true, uploaderName: "Unknown Person", uploaderContact: "+91 76543 21098", uploaderJamaat: "Unknown", notes: "PDF shared in multiple groups", callStatus: "Follow-up Needed", crId: "CR-0003" },
];

const MOCK_USERS = [
  { id: "USR-001", name: "Shabbir Admin", role: "Admin", contact: "+91 99999 00001", status: "Active" },
  { id: "USR-002", name: "Ahmed Hussain", role: "Event Discoverer", contact: "+91 98765 43210", status: "Active" },
  { id: "USR-003", name: "Fatema Bohra", role: "Event Discoverer", contact: "+91 87654 32109", status: "Active" },
  { id: "USR-004", name: "Taher Elam", role: "Elam Department", contact: "+91 76543 21098", status: "Active" },
  { id: "USR-005", name: "Mustafa CR", role: "Copyright Department", contact: "+91 65432 10987", status: "Active" },
];

const MOCK_ANALYTICS = {
  platforms: { Instagram: 42, YouTube: 28, Facebook: 15, TikTok: 33, Telegram: 19, WhatsApp: 51, "X/Twitter": 11, Website: 7 },
  daily: [8,12,19,25,31,18,24,29,15,22],
  zones: { "Relay Video Zone": 23, "Ashara Video Zone": 45, "Fazal Zone": 12, "Majlis Zone": 31, "Confidential Zone": 18, "Monitoring Zone": 9 },
  resolved: 67, pending: 41, escalated: 28, total: 206,
  deptPerf: { "Elam Department": { resolved: 45, total: 67, avgTime: "2.3h" }, "Copyright Department": { resolved: 22, total: 34, avgTime: "5.1h" } }
};

// ─── UTILITY FUNCTIONS ─────────────────────────────────────────────────────────
function cleanUrl(url) {
  try {
    const u = new URL(url);
    u.searchParams.delete("igsh"); u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium"); u.searchParams.delete("utm_campaign");
    u.searchParams.delete("fbclid"); u.searchParams.delete("ref");
    return u.origin + u.pathname;
  } catch { return url; }
}

function detectPlatform(url) {
  if (url.includes("instagram")) return "Instagram";
  if (url.includes("youtube") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("facebook") || url.includes("fb.com")) return "Facebook";
  if (url.includes("tiktok")) return "TikTok";
  if (url.includes("telegram") || url.includes("t.me")) return "Telegram";
  if (url.includes("whatsapp") || url.includes("wa.me")) return "WhatsApp";
  if (url.includes("twitter") || url.includes("x.com")) return "X/Twitter";
  return "Website";
}

function generateId(prefix, num) { return `${prefix}-${String(num).padStart(4, "0")}`; }
function genCaseId() { return `ASH1448-2024-${String(Math.floor(Math.random()*9000)+1000)}`; }
function isHighUrgency(tags) { return tags.some(t => HIGH_URGENCY_TAGS.includes(t)); }
function timeAgo(ts) {
  const d = new Date(ts); const now = new Date();
  const diff = Math.floor((now - d) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
  return `${Math.floor(diff/1440)}d ago`;
}

// ─── STYLE CONSTANTS ──────────────────────────────────────────────────────────
const css = {
  glass: "bg-white/5 backdrop-blur-md border border-white/10",
  glassHover: "hover:bg-white/8 hover:border-emerald-500/30 transition-all duration-300",
  card: "rounded-2xl p-6",
  badge: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
  btn: "inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200",
  input: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all text-sm",
  label: "block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2",
  sectionTitle: "text-xl font-bold text-white mb-1",
  sectionSub: "text-sm text-white/40 mb-6",
};

function priorityColor(p) {
  return p === "Critical" ? "text-red-400 bg-red-500/15 border border-red-500/30"
    : p === "High" ? "text-amber-400 bg-amber-500/15 border border-amber-500/30"
    : p === "Medium" ? "text-yellow-400 bg-yellow-500/15 border border-yellow-500/30"
    : "text-green-400 bg-green-500/15 border border-green-500/30";
}

function statusColor(s) {
  return s === "Resolved" ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30"
    : s === "In Progress" ? "text-blue-400 bg-blue-500/15 border border-blue-500/30"
    : s === "Assigned" ? "text-purple-400 bg-purple-500/15 border border-purple-500/30"
    : "text-white/50 bg-white/5 border border-white/10";
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-emerald-500 rounded-xl rotate-6 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
          <span className="text-black font-black text-lg">𝕊</span>
        </div>
      </div>
      <div>
        <div className="text-white font-black text-sm leading-none tracking-tight">SMVAM</div>
        <div className="text-emerald-400 text-xs font-semibold tracking-widest opacity-80">ASHARA 1448H</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "emerald", icon, pulse }) {
  const colors = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    red: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-400",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
    gold: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400",
  };
  return (
    <div className={`relative rounded-2xl p-5 bg-gradient-to-br ${colors[color]} border overflow-hidden group cursor-default`} style={{transition:"transform 0.2s",}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      {pulse && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-400 animate-ping" />}
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {pulse && <div className="w-2 h-2 rounded-full bg-red-400" />}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm font-semibold text-white/70">{label}</div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
    </div>
  );
}

function PlatformBar({ platform, count, max }) {
  const pct = Math.round((count / max) * 100);
  const color = PLATFORM_COLORS[platform] || "#8B5CF6";
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-lg w-7 text-center">{PLATFORM_ICONS[platform]}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/70 font-medium">{platform}</span>
          <span className="text-white/50">{count}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}

function ReportRow({ report, onView, onAssign, currentRole }) {
  const urgent = isHighUrgency(report.tags);
  return (
    <div className={`rounded-xl p-4 border transition-all duration-200 cursor-pointer group
      ${urgent ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40" : "bg-white/3 border-white/8 hover:border-emerald-500/30 hover:bg-white/5"}`}
      onClick={() => onView(report)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {urgent && <span className="text-xs font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">🔴 URGENT</span>}
            <span className="text-xs text-white/30 font-mono">{report.id}</span>
            <span className={`${css.badge} ${priorityColor(report.priority)}`}>{report.priority}</span>
            <span className={`${css.badge} ${statusColor(report.status)}`}>{report.status}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{PLATFORM_ICONS[report.platform]}</span>
            <span className="text-sm font-semibold text-white truncate">{report.contentType}</span>
            <span className="text-xs text-white/30">·</span>
            <span className="text-xs text-white/40">{report.urls.length} URL{report.urls.length > 1 ? "s" : ""}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {report.tags.slice(0,3).map(t => (
              <span key={t} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{t}</span>
            ))}
            {report.tags.length > 3 && <span className="text-xs text-white/30">+{report.tags.length-3}</span>}
          </div>
          <div className="text-xs text-white/30">by {report.submittedBy} · {timeAgo(report.timestamp)}</div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {report.department && <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-lg">{report.department === "Elam Department" ? "ELAM" : "CR"}</span>}
          {currentRole === "Admin" && report.status === "Pending" && (
            <button onClick={e=>{e.stopPropagation();onAssign(report);}}
              className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors">
              Assign →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children, width = "max-w-2xl" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)"}}>
      <div className={`${width} w-full bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden`}
        style={{maxHeight:"90vh",overflowY:"auto"}}>
        <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#0d1117] z-10">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xl transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── VIEWS ────────────────────────────────────────────────────────────────────

function AdminDashboard({ reports, analytics, onViewReport, onAssign }) {
  const critCount = reports.filter(r=>r.priority==="Critical").length;
  const pendingCount = reports.filter(r=>r.status==="Pending").length;
  const resolvedCount = reports.filter(r=>r.status==="Resolved").length;
  const maxPlatform = Math.max(...Object.values(analytics.platforms));
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? reports : reports.filter(r=>r.status===filter);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Operations Center</h1>
          <p className="text-white/40 text-sm">Ashara Mubaraka 1448H · Social Media Vigilance Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 text-sm font-semibold">LIVE MONITORING</span>
        </div>
      </div>

      {critCount > 0 && (
        <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <div className="text-red-400 font-bold text-sm">{critCount} CRITICAL INCIDENTS REQUIRE IMMEDIATE ATTENTION</div>
            <div className="text-red-400/60 text-xs">High-urgency content detected — Admin review required</div>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reports" value={reports.length} sub="All time" icon="📋" color="blue" />
        <StatCard label="Pending Action" value={pendingCount} sub="Needs assignment" icon="⏳" color="amber" pulse={pendingCount > 0} />
        <StatCard label="Critical Alerts" value={critCount} sub="Immediate response" icon="🔴" color="red" pulse={critCount > 0} />
        <StatCard label="Resolved" value={resolvedCount} sub={`${Math.round(resolvedCount/reports.length*100)}% success rate`} icon="✅" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Incident Feed</h2>
            <div className="flex gap-2">
              {["All","Pending","Assigned","In Progress","Resolved"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors
                    ${filter===f ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-white/40 hover:text-white/70"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map(r=>(
              <ReportRow key={r.id} report={r} onView={onViewReport} onAssign={onAssign} currentRole="Admin" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className={`${css.glass} ${css.card} rounded-2xl`}>
            <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Platform Analysis</h3>
            <div className="space-y-3">
              {Object.entries(analytics.platforms).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([p,c])=>(
                <PlatformBar key={p} platform={p} count={c} max={maxPlatform} />
              ))}
            </div>
          </div>

          <div className={`${css.glass} ${css.card} rounded-2xl`}>
            <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Zone Activity</h3>
            <div className="space-y-2">
              {Object.entries(analytics.zones).map(([zone,count])=>(
                <div key={zone} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/60 flex-1">{zone}</span>
                  <span className="text-sm font-bold text-emerald-400 ml-2">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${css.glass} ${css.card} rounded-2xl`}>
            <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Department Performance</h3>
            {Object.entries(analytics.deptPerf).map(([dept,perf])=>(
              <div key={dept} className="mb-4 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70 font-semibold">{dept === "Elam Department" ? "Elam Dept." : "Copyright Dept."}</span>
                  <span className="text-emerald-400">{Math.round(perf.resolved/perf.total*100)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                    style={{width:`${Math.round(perf.resolved/perf.total*100)}%`}} />
                </div>
                <div className="text-xs text-white/30 mt-1">Avg: {perf.avgTime} · {perf.resolved}/{perf.total} resolved</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitReport({ onSubmit, currentUser }) {
  const [urls, setUrls] = useState([""]);
  const [contentType, setContentType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [zone, setZone] = useState("");
  const [notes, setNotes] = useState("");
  const [uploaderKnown, setUploaderKnown] = useState(null);
  const [uploaderName, setUploaderName] = useState("");
  const [uploaderContact, setUploaderContact] = useState("");
  const [uploaderWhatsApp, setUploaderWhatsApp] = useState("");
  const [uploaderAddress, setUploaderAddress] = useState("");
  const [uploaderJamaat, setUploaderJamaat] = useState("");
  const [uploaderUsername, setUploaderUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [detectedPlatforms, setDetectedPlatforms] = useState([]);

  const handleUrlChange = (i, val) => {
    const newUrls = [...urls]; newUrls[i] = val; setUrls(newUrls);
    setDetectedPlatforms(newUrls.filter(Boolean).map(detectPlatform));
  };

  const urgentTags = selectedTags.filter(t=>HIGH_URGENCY_TAGS.includes(t));
  const willBeUrgent = urgentTags.length > 0;

  const handleSubmit = () => {
    const cleanedUrls = urls.filter(Boolean).map(cleanUrl);
    const priority = willBeUrgent ? "Critical" : "Medium";
    const platform = detectedPlatforms[0] || "Website";
    const report = {
      id: genCaseId(), subId: generateId("SUB", Math.floor(Math.random()*9000)+1000),
      urls: cleanedUrls, platform, submittedBy: currentUser?.name || "Unknown",
      tags: selectedTags, priority, zone, status: "Pending", department: null,
      contentType, timestamp: new Date().toISOString().slice(0,16).replace("T"," "),
      uploaderKnown: uploaderKnown === "yes",
      uploaderName, uploaderContact, uploaderJamaat, notes,
    };
    onSubmit(report);
    setSubmitted(true);
    setTimeout(()=>setSubmitted(false), 3000);
  };

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-4xl animate-bounce">✅</div>
      <h2 className="text-2xl font-black text-white">Report Submitted!</h2>
      <p className="text-white/40 text-sm text-center">Your incident has been logged and is pending Admin review.</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Submit Incident Report</h1>
        <p className="text-white/40 text-sm">Report unauthorized uploads for Ashara Mubaraka 1448H monitoring</p>
      </div>

      {willBeUrgent && (
        <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3 animate-pulse">
          <span className="text-xl">🚨</span>
          <div>
            <div className="text-red-400 font-bold text-sm">HIGH URGENCY CONTENT DETECTED</div>
            <div className="text-red-400/60 text-xs">This report will be marked CRITICAL and Admin will be notified immediately.</div>
          </div>
        </div>
      )}

      <div className={`${css.glass} ${css.card} rounded-2xl space-y-4`}>
        <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">📎 URLs / Links</h3>
        {urls.map((url, i) => (
          <div key={i} className="space-y-2">
            <div className="flex gap-2">
              <input className={css.input} placeholder={`Paste URL #${i+1} here...`}
                value={url} onChange={e=>handleUrlChange(i,e.target.value)} />
              {urls.length > 1 && (
                <button onClick={()=>setUrls(urls.filter((_,j)=>j!==i))}
                  className="text-red-400 hover:text-red-300 text-lg px-2">✕</button>
              )}
            </div>
            {url && (
              <div className="flex items-center gap-2 text-xs">
                <span>{PLATFORM_ICONS[detectPlatform(url)]}</span>
                <span className="text-emerald-400 font-mono">{cleanUrl(url)}</span>
                <span className="text-white/30">→ {detectPlatform(url)}</span>
              </div>
            )}
          </div>
        ))}
        <button onClick={()=>setUrls([...urls,""])}
          className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
          + Add Another URL
        </button>
        {detectedPlatforms.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/8">
            <span className="text-xs text-white/30">Detected:</span>
            {[...new Set(detectedPlatforms)].map(p=>(
              <span key={p} className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{background:PLATFORM_COLORS[p]+"22",color:PLATFORM_COLORS[p],border:`1px solid ${PLATFORM_COLORS[p]}44`}}>
                {PLATFORM_ICONS[p]} {p}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={`${css.glass} ${css.card} rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4`}>
        <div>
          <label className={css.label}>Content Type</label>
          <select className={css.input} value={contentType} onChange={e=>setContentType(e.target.value)}>
            <option value="">Select type...</option>
            {CONTENT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={css.label}>Zone</label>
          <select className={css.input} value={zone} onChange={e=>setZone(e.target.value)}>
            <option value="">Select zone...</option>
            {ZONES.map(z=><option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>

      <div className={`${css.glass} ${css.card} rounded-2xl`}>
        <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">🏷️ Incident Tags</h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag=>{
            const isSelected = selectedTags.includes(tag);
            const isUrgent = HIGH_URGENCY_TAGS.includes(tag);
            return (
              <button key={tag} onClick={()=>setSelectedTags(isSelected?selectedTags.filter(t=>t!==tag):[...selectedTags,tag])}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium
                  ${isSelected
                    ? isUrgent ? "bg-red-500/20 text-red-300 border-red-500/40" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white/60"}`}>
                {isUrgent && "⚠️ "}{tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`${css.glass} ${css.card} rounded-2xl`}>
        <label className={css.label}>Additional Notes</label>
        <textarea className={`${css.input} h-24 resize-none`} placeholder="Describe the incident, context, or any important details..."
          value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>

      <div className={`${css.glass} ${css.card} rounded-2xl`}>
        <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">👤 Do You Know This Uploader?</h3>
        <div className="flex gap-3 mb-4">
          {["yes","no"].map(v=>(
            <button key={v} onClick={()=>setUploaderKnown(v)}
              className={`px-6 py-2.5 rounded-xl border font-bold text-sm transition-all capitalize
                ${uploaderKnown===v
                  ? v==="yes" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-red-500/20 text-red-400 border-red-500/40"
                  : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"}`}>
              {v === "yes" ? "✅ Yes, I Know Them" : "❌ No, Unknown"}
            </button>
          ))}
        </div>
        {uploaderKnown === "yes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/8">
            <div><label className={css.label}>Full Name</label><input className={css.input} placeholder="Uploader's name" value={uploaderName} onChange={e=>setUploaderName(e.target.value)} /></div>
            <div><label className={css.label}>Contact Number</label><input className={css.input} placeholder="+91 XXXXX XXXXX" value={uploaderContact} onChange={e=>setUploaderContact(e.target.value)} /></div>
            <div><label className={css.label}>WhatsApp Number</label><input className={css.input} placeholder="+91 XXXXX XXXXX" value={uploaderWhatsApp} onChange={e=>setUploaderWhatsApp(e.target.value)} /></div>
            <div><label className={css.label}>Jamaat / Mohalla</label><input className={css.input} placeholder="Jamaat or area" value={uploaderJamaat} onChange={e=>setUploaderJamaat(e.target.value)} /></div>
            <div><label className={css.label}>Social Media Username</label><input className={css.input} placeholder="@username" value={uploaderUsername} onChange={e=>setUploaderUsername(e.target.value)} /></div>
            <div><label className={css.label}>Address</label><input className={css.input} placeholder="Address if known" value={uploaderAddress} onChange={e=>setUploaderAddress(e.target.value)} /></div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit}
          disabled={urls.every(u=>!u.trim()) || !contentType}
          className={`${css.btn} px-8 py-3 rounded-xl font-black text-base transition-all
            ${urls.some(u=>u.trim()) && contentType
              ? willBeUrgent
                ? "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              : "bg-white/10 text-white/30 cursor-not-allowed"}`}>
          {willBeUrgent ? "🚨 Submit CRITICAL Report" : "📤 Submit Incident Report"}
        </button>
      </div>
    </div>
  );
}

function ElamView({ reports, currentUser }) {
  const assigned = reports.filter(r=>r.department==="Elam Department");
  const [selected, setSelected] = useState(null);
  const [callStatus, setCallStatus] = useState("");
  const [note, setNote] = useState("");
  const [localReports, setLocalReports] = useState(assigned);

  const updateCase = (id, updates) => {
    setLocalReports(prev => prev.map(r=>r.id===id?{...r,...updates}:r));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Elam Department</h1>
        <p className="text-white/40 text-sm">Communication & resolution management</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Assigned Cases" value={localReports.length} icon="📁" color="blue" />
        <StatCard label="Resolved" value={localReports.filter(r=>r.callStatus==="Resolved").length} icon="✅" color="emerald" />
        <StatCard label="Follow-ups" value={localReports.filter(r=>r.callStatus==="Follow-up Needed").length} icon="🔄" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {localReports.map(r=>(
            <div key={r.id} onClick={()=>{setSelected(r);setCallStatus(r.callStatus||"");setNote(r.notes||"");}}
              className={`${css.glass} rounded-xl p-4 cursor-pointer transition-all
                ${selected?.id===r.id ? "border-emerald-500/40 bg-emerald-500/5" : "hover:border-white/20"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-xs text-white/30">{r.elmId || r.id}</span>
                    <span className={`${css.badge} ${priorityColor(r.priority)}`}>{r.priority}</span>
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">{r.contentType}</div>
                  <div className="text-xs text-white/40">{r.platform} · {r.submittedBy}</div>
                  {r.uploaderKnown && <div className="text-xs text-emerald-400 mt-1">👤 Uploader Known: {r.uploaderName}</div>}
                </div>
                {r.callStatus && (
                  <span className={`text-xs px-2 py-1 rounded-lg font-semibold
                    ${r.callStatus==="Resolved" ? "text-emerald-400 bg-emerald-500/10" :
                      r.callStatus==="Called" ? "text-blue-400 bg-blue-500/10" :
                      r.callStatus==="Refused" ? "text-red-400 bg-red-500/10" :
                      "text-amber-400 bg-amber-500/10"}`}>
                    {r.callStatus}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {selected ? (
          <div className={`${css.glass} ${css.card} rounded-2xl space-y-4 h-fit`}>
            <h3 className="font-bold text-white">Case Actions</h3>
            <div className="font-mono text-xs text-emerald-400">{selected.id}</div>

            {selected.uploaderKnown && (
              <div className="rounded-xl bg-white/3 border border-white/8 p-4 space-y-2">
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider">Uploader Info</div>
                {selected.uploaderName && <div className="text-sm text-white">{selected.uploaderName}</div>}
                {selected.uploaderContact && (
                  <a href={`tel:${selected.uploaderContact}`}
                    className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
                    📞 {selected.uploaderContact}
                  </a>
                )}
                {selected.uploaderJamaat && <div className="text-xs text-white/40">Jamaat: {selected.uploaderJamaat}</div>}
              </div>
            )}

            <div>
              <label className={css.label}>Call Status</label>
              <select className={css.input} value={callStatus} onChange={e=>setCallStatus(e.target.value)}>
                <option value="">Select status...</option>
                {CALL_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className={css.label}>Add Note</label>
              <textarea className={`${css.input} h-24 resize-none`} placeholder="Case notes..."
                value={note} onChange={e=>setNote(e.target.value)} />
            </div>

            <div className="flex gap-2">
              <button onClick={()=>updateCase(selected.id,{callStatus,notes:note})}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm hover:bg-emerald-500/30 transition-colors">
                Save
              </button>
              <button onClick={()=>updateCase(selected.id,{callStatus:"Resolved",status:"Resolved"})}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors">
                Resolve ✓
              </button>
            </div>
          </div>
        ) : (
          <div className={`${css.glass} ${css.card} rounded-2xl flex items-center justify-center h-48 text-white/20 text-sm`}>
            Select a case to take action
          </div>
        )}
      </div>
    </div>
  );
}

function CopyrightView({ reports }) {
  const assigned = reports.filter(r=>r.department==="Copyright Department");
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Copyright Department</h1>
        <p className="text-white/40 text-sm">Legal action & copyright strike management</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Escalated Cases" value={assigned.length} icon="⚖️" color="purple" />
        <StatCard label="Strikes Issued" value={2} icon="🛡️" color="red" />
        <StatCard label="Legal Notices" value={1} icon="📄" color="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {assigned.map(r=>(
            <div key={r.id} onClick={()=>{setSelected(r);setAction("");setNotes("");}}
              className={`${css.glass} rounded-xl p-4 cursor-pointer transition-all
                ${selected?.id===r.id ? "border-purple-500/40 bg-purple-500/5" : "hover:border-white/20"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-white/30">{r.crId || r.id}</span>
                    <span className={`${css.badge} ${priorityColor(r.priority)}`}>{r.priority}</span>
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">{r.contentType}</div>
                  <div className="text-xs text-white/40">{r.platform} · {r.urls.length} URL(s)</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {r.tags.slice(0,3).map(t=>(
                      <span key={t} className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isHighUrgency(r.tags) && <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg">URGENT</span>}
                  <span className={`${css.badge} ${statusColor(r.status)}`}>{r.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected ? (
          <div className={`${css.glass} ${css.card} rounded-2xl space-y-4 h-fit`}>
            <h3 className="font-bold text-white">Legal Action</h3>
            <div className="font-mono text-xs text-purple-400">{selected.crId || selected.id}</div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-red-500/10 border-b border-red-500/20 px-3 py-2 flex items-center gap-2">
                <span className="text-red-400 text-xs font-bold">🔒 PROTECTED EVIDENCE</span>
              </div>
              <div className="p-3 space-y-2">
                {selected.urls.map((url,i)=>(
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/3">
                    <span>{PLATFORM_ICONS[detectPlatform(url)]}</span>
                    <span className="text-xs text-white/50 truncate font-mono flex-1">{cleanUrl(url)}</span>
                    <span className="text-xs text-white/20">🔒</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={css.label}>Action Type</label>
              <select className={css.input} value={action} onChange={e=>setAction(e.target.value)}>
                <option value="">Select action...</option>
                <option>Copyright Strike</option>
                <option>DMCA Takedown</option>
                <option>Legal Notice</option>
                <option>Platform Report</option>
                <option>Account Report</option>
              </select>
            </div>

            <div>
              <label className={css.label}>Action Notes</label>
              <textarea className={`${css.input} h-20 resize-none`} placeholder="Detail the legal action taken..."
                value={notes} onChange={e=>setNotes(e.target.value)} />
            </div>

            <button className="w-full py-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold text-sm hover:bg-purple-500/30 transition-colors">
              ⚖️ Log Legal Action
            </button>
          </div>
        ) : (
          <div className={`${css.glass} ${css.card} rounded-2xl flex items-center justify-center h-48 text-white/20 text-sm`}>
            Select a case to manage
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsView({ analytics, reports }) {
  const days = analytics.daily;
  const max = Math.max(...days);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Analytics & Intelligence</h1>
        <p className="text-white/40 text-sm">Real-time monitoring data for Ashara Mubaraka 1448H</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Incidents" value={analytics.total} icon="📊" color="blue" />
        <StatCard label="Resolved" value={analytics.resolved} sub={`${Math.round(analytics.resolved/analytics.total*100)}%`} icon="✅" color="emerald" />
        <StatCard label="Pending" value={analytics.pending} icon="⏳" color="amber" />
        <StatCard label="Escalated" value={analytics.escalated} icon="🔺" color="red" />
      </div>

      <div className={`${css.glass} ${css.card} rounded-2xl`}>
        <h3 className="font-bold text-white mb-6">Daily Incident Trend (Ashara Days)</h3>
        <div className="flex items-end gap-2 h-32">
          {days.map((val, i)=>(
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-white/40">{val}</span>
              <div className="w-full rounded-t-lg transition-all"
                style={{
                  height:`${(val/max)*100}%`,
                  background: val > 25 ? "linear-gradient(to top, #ef4444, #f97316)"
                    : val > 15 ? "linear-gradient(to top, #f59e0b, #eab308)"
                    : "linear-gradient(to top, #10b981, #34d399)",
                  minHeight: "4px"
                }} />
              <span className="text-xs text-white/30">D{i+1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${css.glass} ${css.card} rounded-2xl`}>
          <h3 className="font-bold text-white mb-6">Platform Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analytics.platforms).sort((a,b)=>b[1]-a[1]).map(([p,c])=>(
              <div key={p} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{PLATFORM_ICONS[p]}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70 font-medium">{p}</span>
                    <span className="text-white/50">{c} · {Math.round(c/analytics.total*100)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{width:`${c/Math.max(...Object.values(analytics.platforms))*100}%`,
                        backgroundColor: PLATFORM_COLORS[p], opacity: 0.8}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${css.glass} ${css.card} rounded-2xl`}>
          <h3 className="font-bold text-white mb-2">🔮 Prevention Intelligence</h3>
          <p className="text-xs text-white/30 mb-6">Recommendations for Next Ashara</p>
          <div className="space-y-3">
            {[
              {icon:"⚠️", insight:"WhatsApp PDF circulation is highest risk", action:"Deploy dedicated WhatsApp monitors", risk:"Critical"},
              {icon:"📍", insight:"Ashara Video Zone has most incidents", action:"Increase zone coverage", risk:"High"},
              {icon:"📱", insight:"Instagram & TikTok fastest spread time", action:"Priority monitoring 8am-11pm", risk:"High"},
              {icon:"🕐", insight:"Peak incident time: Days 3-5", action:"Double monitoring crew mid-Ashara", risk:"Medium"},
              {icon:"👤", insight:"30% incidents from repeat offenders", action:"Build uploader intelligence database", risk:"Medium"},
            ].map((item,i)=>(
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-white mb-0.5">{item.insight}</div>
                  <div className="text-xs text-emerald-400">→ {item.action}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg h-fit ${priorityColor(item.risk)}`}>{item.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersView({ users }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">User Management</h1>
          <p className="text-white/40 text-sm">Manage system access and roles</p>
        </div>
        <button className={`${css.btn} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30`}>
          + Add User
        </button>
      </div>

      <div className="space-y-3">
        {users.map(u=>(
          <div key={u.id} className={`${css.glass} ${css.glassHover} rounded-xl p-4 flex items-center gap-4`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-700/30 border border-emerald-500/20 flex items-center justify-center text-lg font-black text-emerald-400">
              {u.name[0]}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">{u.name}</div>
              <div className="text-xs text-white/40">{u.contact}</div>
            </div>
            <div>
              <span className={`${css.badge} text-xs
                ${u.role==="Admin" ? "text-amber-400 bg-amber-500/10 border border-amber-500/20" :
                  u.role==="Elam Department" ? "text-blue-400 bg-blue-500/10 border border-blue-500/20" :
                  u.role==="Copyright Department" ? "text-purple-400 bg-purple-500/10 border border-purple-500/20" :
                  "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"}`}>
                {u.role}
              </span>
            </div>
            <div>
              <span className={`${css.badge} ${u.status==="Active" ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
                {u.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-white/30 hover:text-white/60 transition-colors">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportDetailModal({ report, open, onClose, onAssign }) {
  if (!report) return null;
  return (
    <Modal open={open} onClose={onClose} title={`Case: ${report.id}`} width="max-w-3xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`${css.badge} ${priorityColor(report.priority)}`}>{report.priority}</span>
          <span className={`${css.badge} ${statusColor(report.status)}`}>{report.status}</span>
          {isHighUrgency(report.tags) && <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full font-bold animate-pulse">🚨 HIGH URGENCY</span>}
          {report.department && <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">→ {report.department}</span>}
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="bg-[#0d1117] border-b border-white/8 px-4 py-2 flex items-center gap-2">
            <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Evidence URLs</span>
            <span className="ml-auto text-xs text-white/20">🔒 Admin Only</span>
          </div>
          <div className="p-4 space-y-2">
            {report.urls.map((url,i)=>(
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <span className="text-lg">{PLATFORM_ICONS[detectPlatform(url)]}</span>
                <code className="text-xs text-emerald-400 flex-1 font-mono truncate">{cleanUrl(url)}</code>
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-white/20 hover:text-white/50 transition-colors shrink-0">↗</a>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className={css.label}>Content Type</div>
            <div className="text-sm text-white font-semibold">{report.contentType}</div>
          </div>
          <div className="space-y-1">
            <div className={css.label}>Platform</div>
            <div className="text-sm text-white font-semibold">{PLATFORM_ICONS[report.platform]} {report.platform}</div>
          </div>
          <div className="space-y-1">
            <div className={css.label}>Zone</div>
            <div className="text-sm text-white font-semibold">{report.zone || "Unassigned"}</div>
          </div>
          <div className="space-y-1">
            <div className={css.label}>Submitted By</div>
            <div className="text-sm text-white font-semibold">{report.submittedBy}</div>
          </div>
          <div className="space-y-1">
            <div className={css.label}>Timestamp</div>
            <div className="text-sm text-white font-semibold">{report.timestamp}</div>
          </div>
        </div>

        <div>
          <div className={css.label}>Tags</div>
          <div className="flex flex-wrap gap-2">
            {report.tags.map(t=>(
              <span key={t} className={`text-xs px-3 py-1 rounded-full border
                ${HIGH_URGENCY_TAGS.includes(t)
                  ? "text-red-400 bg-red-500/10 border-red-500/20"
                  : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>{t}</span>
            ))}
          </div>
        </div>

        {report.uploaderKnown && (
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
            <div className={`${css.label} text-emerald-500/70`}>👤 Known Uploader</div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {report.uploaderName && <div><span className="text-xs text-white/30">Name: </span><span className="text-sm text-white">{report.uploaderName}</span></div>}
              {report.uploaderContact && <div><span className="text-xs text-white/30">Contact: </span><span className="text-sm text-emerald-400">{report.uploaderContact}</span></div>}
              {report.uploaderJamaat && <div><span className="text-xs text-white/30">Jamaat: </span><span className="text-sm text-white">{report.uploaderJamaat}</span></div>}
            </div>
          </div>
        )}

        {report.notes && (
          <div>
            <div className={css.label}>Notes</div>
            <div className="text-sm text-white/70 bg-white/3 border border-white/8 rounded-xl p-4">{report.notes}</div>
          </div>
        )}

        {report.status === "Pending" && (
          <div className="flex gap-3 pt-4 border-t border-white/8">
            <button onClick={()=>onAssign({...report,department:"Elam Department"})}
              className={`flex-1 ${css.btn} justify-center py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30`}>
              → Assign to Elam
            </button>
            <button onClick={()=>onAssign({...report,department:"Copyright Department"})}
              className={`flex-1 ${css.btn} justify-center py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30`}>
              → Assign to Copyright
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

function AssignModal({ report, open, onClose, onConfirm }) {
  const [dept, setDept] = useState("Elam Department");
  if (!report) return null;
  return (
    <Modal open={open} onClose={onClose} title="Assign Case" width="max-w-md">
      <div className="space-y-4">
        <p className="text-sm text-white/60">Assign <span className="text-emerald-400 font-mono">{report.id}</span> to a department:</p>
        <div className="flex flex-col gap-3">
          {["Elam Department","Copyright Department"].map(d=>(
            <button key={d} onClick={()=>setDept(d)}
              className={`p-4 rounded-xl border text-left transition-all
                ${dept===d
                  ? d==="Elam Department"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"}`}>
              <div className="font-bold text-sm">{d === "Elam Department" ? "📞 " : "⚖️ "}{d}</div>
              <div className="text-xs opacity-60 mt-1">
                {d==="Elam Department" ? "Communication, calling, resolution" : "Copyright strikes, legal notices, DMCA"}
              </div>
            </button>
          ))}
        </div>
        <button onClick={()=>onConfirm(dept)}
          className="w-full py-3 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400 transition-colors">
          Assign Case →
        </button>
      </div>
    </Modal>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentRole, setCurrentRole] = useState("Admin");
  const [activeView, setActiveView] = useState("dashboard");
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [viewReport, setViewReport] = useState(null);
  const [assignReport, setAssignReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentUser = MOCK_USERS.find(u=>u.role===currentRole) || MOCK_USERS[0];

  const handleSubmitReport = (report) => {
    setReports(prev=>[report,...prev]);
  };

  const handleAssign = (report, dept) => {
    setReports(prev=>prev.map(r=>r.id===report.id
      ? {...r, department: dept || report.department, status: "Assigned"}
      : r));
    setAssignReport(null);
    setViewReport(null);
  };

  const navItems = {
    Admin: [
      {id:"dashboard",icon:"⬡",label:"Operations"},
      {id:"reports",icon:"📋",label:"All Reports"},
      {id:"analytics",icon:"📊",label:"Analytics"},
      {id:"users",icon:"👥",label:"Users"},
      {id:"audit",icon:"🔍",label:"Audit Logs"},
    ],
    "Event Discoverer": [
      {id:"submit",icon:"➕",label:"Submit Report"},
      {id:"myreports",icon:"📋",label:"My Reports"},
    ],
    "Elam Department": [
      {id:"elam",icon:"📞",label:"My Cases"},
    ],
    "Copyright Department": [
      {id:"copyright",icon:"⚖️",label:"My Cases"},
    ],
  }[currentRole] || [];

  const pendingCount = reports.filter(r=>r.status==="Pending").length;

  return (
    <div className="min-h-screen bg-[#080b0f] text-white" style={{fontFamily:"'Manrope', 'Inter', sans-serif"}}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/2 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage:"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
          backgroundSize:"40px 40px"
        }} />
      </div>

      <div className="flex h-screen overflow-hidden relative">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-60" : "w-16"} shrink-0 h-full border-r border-white/8 bg-[#080b0f]/90 backdrop-blur-xl flex flex-col transition-all duration-300 z-20`}>
          <div className="p-4 border-b border-white/8 flex items-center gap-3">
            {sidebarOpen ? <Logo /> : <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center"><span className="text-black font-black text-lg">𝕊</span></div>}
          </div>

          {sidebarOpen && (
            <div className="p-3 border-b border-white/8">
              <select className={`${css.input} text-xs py-2`} value={currentRole} onChange={e=>{setCurrentRole(e.target.value);setActiveView(e.target.value==="Admin"?"dashboard":e.target.value==="Event Discoverer"?"submit":e.target.value==="Elam Department"?"elam":"copyright");}}>
                {Object.values(ROLES).map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item=>(
              <button key={item.id} onClick={()=>setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative
                  ${activeView===item.id
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
                <span className="text-base shrink-0">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {item.id==="reports" && pendingCount > 0 && sidebarOpen && (
                  <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-black">{pendingCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-white/8">
            <div className={`flex items-center gap-3 p-2.5 rounded-xl ${css.glass}`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-700/30 border border-emerald-500/20 flex items-center justify-center text-sm font-black text-emerald-400 shrink-0">
                {currentUser?.name[0]}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{currentUser?.name}</div>
                  <div className="text-xs text-white/30 truncate">{currentRole}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-14 border-b border-white/8 bg-[#080b0f]/80 backdrop-blur-xl flex items-center px-6 gap-4 shrink-0 z-10">
            <button onClick={()=>setSidebarOpen(!sidebarOpen)}
              className="text-white/30 hover:text-white/60 transition-colors text-lg">
              {sidebarOpen ? "◀" : "▶"}
            </button>
            <div className="flex-1" />
            {currentRole === "Admin" && pendingCount > 0 && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span className="text-xs text-red-400 font-bold">{pendingCount} pending</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/30">System Active</span>
            </div>
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-700/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
              <span className="text-xs font-bold text-emerald-400">ASHARA 1448H</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeView === "dashboard" && currentRole === "Admin" && (
              <AdminDashboard reports={reports} analytics={MOCK_ANALYTICS}
                onViewReport={(r)=>setViewReport(r)}
                onAssign={(r)=>setAssignReport(r)} />
            )}
            {activeView === "reports" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">All Reports</h1>
                  <p className="text-white/40 text-sm">{reports.length} total incidents · Ashara Mubaraka 1448H</p>
                </div>
                <div className="space-y-3">
                  {reports.map(r=>(
                    <ReportRow key={r.id} report={r}
                      onView={(r)=>setViewReport(r)}
                      onAssign={(r)=>setAssignReport(r)}
                      currentRole={currentRole} />
                  ))}
                </div>
              </div>
            )}
            {activeView === "submit" && (
              <SubmitReport onSubmit={handleSubmitReport} currentUser={currentUser} />
            )}
            {activeView === "myreports" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-black text-white mb-1">My Submissions</h1>
                <div className="space-y-3">
                  {reports.filter(r=>r.submittedBy===currentUser?.name).map(r=>(
                    <ReportRow key={r.id} report={r} onView={setViewReport} onAssign={setAssignReport} currentRole={currentRole} />
                  ))}
                  {reports.filter(r=>r.submittedBy===currentUser?.name).length === 0 && (
                    <div className={`${css.glass} ${css.card} rounded-2xl text-center py-16 text-white/20`}>
                      No submissions yet. Use Submit Report to log an incident.
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeView === "elam" && <ElamView reports={reports} currentUser={currentUser} />}
            {activeView === "copyright" && <CopyrightView reports={reports} />}
            {activeView === "analytics" && <AnalyticsView analytics={MOCK_ANALYTICS} reports={reports} />}
            {activeView === "users" && <UsersView users={MOCK_USERS} />}
            {activeView === "audit" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-black text-white mb-1">Audit Logs</h1>
                <div className={`${css.glass} ${css.card} rounded-2xl space-y-3`}>
                  {[
                    {time:"10:45 AM",user:"Shabbir Admin",action:"Assigned ASH1448-2024-0003 to Copyright Department",type:"assign"},
                    {time:"10:23 AM",user:"Ahmed Hussain",action:"Submitted new report SUB-0001 [CRITICAL]",type:"submit"},
                    {time:"09:55 AM",user:"Taher Elam",action:"Marked ELM-0002 as Resolved",type:"resolve"},
                    {time:"09:30 AM",user:"Shabbir Admin",action:"Assigned ASH1448-2024-0004 to Elam Department",type:"assign"},
                    {time:"09:10 AM",user:"Fatema Bohra",action:"Submitted new report SUB-0002 [CRITICAL - Tawsurat]",type:"submit"},
                    {time:"08:45 AM",user:"Shabbir Admin",action:"Closed case ASH1448-2024-0004",type:"close"},
                  ].map((log,i)=>(
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                      <span className="text-xs text-white/30 font-mono w-20 shrink-0">{log.time}</span>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${log.type==="submit"?"bg-blue-400":log.type==="resolve"?"bg-emerald-400":log.type==="assign"?"bg-purple-400":"bg-white/20"}`} />
                      <div className="flex-1">
                        <span className="text-xs text-emerald-400 font-semibold">{log.user}</span>
                        <span className="text-xs text-white/40"> · {log.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportDetailModal report={viewReport} open={!!viewReport} onClose={()=>setViewReport(null)}
        onAssign={(r)=>{setViewReport(null);setAssignReport(r);}} />
      <AssignModal report={assignReport} open={!!assignReport} onClose={()=>setAssignReport(null)}
        onConfirm={(dept)=>handleAssign(assignReport, dept)} />
    </div>
  );
}
