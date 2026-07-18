import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Users,
  Building2,
  AlertTriangle,
  FileText,
  MessageCircle,
  BarChart3,
  TrendingUp,
  BellRing,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Trash2,
  Eye,
  MapPin,
  Star,
  Settings2,
  Menu,
  X,
  LayoutDashboard,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Hostel, SafetyAlert, IncidentReport, DiscussionThread, LostFoundItem, BookingApplication, NotificationItem } from "../types";

interface AdminConsoleProps {
  hostels: Hostel[];
  alerts: SafetyAlert[];
  incidents: IncidentReport[];
  discussions: DiscussionThread[];
  lostFoundItems: LostFoundItem[];
  applications: BookingApplication[];
  notifications: NotificationItem[];
  currentUser: {
    uid: string;
    email: string | null;
    displayName: string;
    university: string;
    avatarUrl?: string;
  } | null;
  adminUser?: {
    uid: string;
    email: string | null;
    displayName: string;
  } | null;
  onNavigateToTab?: (tab: string) => void;
  onAdminLogout?: () => void;
  onAddAlert?: (alert: Omit<SafetyAlert, "id">) => void;
  onDismissAlert?: (id: string) => void;
  onUpdateIncidentStatus?: (id: string, status: IncidentReport["status"]) => void;
  onDeleteDiscussion?: (id: string) => void;
  onDeleteLostFound?: (id: string) => void;
  onUpdateHostel?: (id: string, updates: Partial<Hostel>) => void;
  onUpdateApplicationStatus?: (id: string, status: BookingApplication["status"], stepIndex: number) => void;
}

type AdminTab = "overview" | "users" | "hostels" | "incidents" | "alerts" | "applications" | "community";

interface MockUser {
  id: string; name: string; email: string; university: string;
  role: "student" | "landlord" | "admin"; joined: string; status: "active" | "suspended";
}

const mockUsers: MockUser[] = [
  { id: "u1", name: "Timothy Bayode", email: "timothy.bayode@lautech.edu.ng", university: "LAUTECH", role: "student", joined: "2026-06-15", status: "active" },
  { id: "u2", name: "Sarah Alao", email: "sarah.alao@lautech.edu.ng", university: "LAUTECH", role: "student", joined: "2026-07-01", status: "active" },
  { id: "u3", name: "Chief Security Officer", email: "security@dwello", university: "LAUTECH", role: "admin", joined: "2026-01-10", status: "active" },
  { id: "u4", name: "Kunle Adeyemi", email: "kunle@property.com", university: "LAUTECH", role: "landlord", joined: "2026-03-20", status: "active" },
  { id: "u5", name: "Zainab Yusuf", email: "zainab.yusuf@lautech.edu.ng", university: "LAUTECH", role: "student", joined: "2026-05-08", status: "active" },
  { id: "u6", name: "Emeka Okafor", email: "emeka.okafor@lautech.edu.ng", university: "LAUTECH", role: "student", joined: "2026-04-12", status: "suspended" },
  { id: "u7", name: "Grace Ogunlade", email: "grace.ogunlade@property.com", university: "LAUTECH", role: "landlord", joined: "2026-02-28", status: "active" },
];

const navItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "hostels", label: "Hostels", icon: Building2 },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
  { id: "alerts", label: "Alerts", icon: BellRing },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "community", label: "Community", icon: MessageCircle },
];

export default function AdminConsole({
  hostels, alerts, incidents, discussions, lostFoundItems, applications, notifications,
  currentUser, adminUser, onNavigateToTab, onAdminLogout,
  onAddAlert, onDismissAlert, onUpdateIncidentStatus,
  onDeleteDiscussion, onDeleteLostFound, onUpdateHostel, onUpdateApplicationStatus,
}: AdminConsoleProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showHostelEdit, setShowHostelEdit] = useState<string | null>(null);
  const [showIncidentDetail, setShowIncidentDetail] = useState<string | null>(null);

  const [newAlert, setNewAlert] = useState({
    title: "", severity: "warning" as SafetyAlert["severity"], location: "", description: "", aiAdvice: "",
  });

  const [hostelEdits, setHostelEdits] = useState<Record<string, { price?: number; roomsLeft?: number; safetyScore?: number }>>({});

  const totalStudents = mockUsers.filter(u => u.role === "student").length;
  const totalLandlords = mockUsers.filter(u => u.role === "landlord").length;
  const activeAlerts = alerts.filter(a => a.severity === "critical" || a.severity === "warning").length;
  const pendingIncidents = incidents.filter(i => i.status !== "Resolved").length;

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return mockUsers;
    const q = searchQuery.toLowerCase();
    return mockUsers.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.university.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredHostels = useMemo(() => {
    if (!searchQuery) return hostels;
    const q = searchQuery.toLowerCase();
    return hostels.filter(h => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q));
  }, [searchQuery, hostels]);

  const handleCreateAlert = () => {
    if (!newAlert.title.trim() || !newAlert.description.trim()) return;
    if (onAddAlert) {
      onAddAlert({
        title: newAlert.title, severity: newAlert.severity,
        location: newAlert.location || "Campus-wide", description: newAlert.description,
        aiAdvice: newAlert.aiAdvice || "Stay alert and follow campus safety guidelines.",
        timestamp: "Just Now",
      });
    }
    setNewAlert({ title: "", severity: "warning", location: "", description: "", aiAdvice: "" });
    setShowAlertForm(false);
  };

  const handleSaveHostelEdit = (id: string) => {
    const edits = hostelEdits[id];
    if (edits && onUpdateHostel) onUpdateHostel(id, edits);
    setShowHostelEdit(null);
    setHostelEdits(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const roleColor = (role: MockUser["role"]) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700 border-purple-200";
      case "landlord": return "bg-amber-100 text-amber-700 border-amber-200";
      case "student": return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const severityColor = (severity: SafetyAlert["severity"]) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "warning": return "bg-amber-100 text-amber-700 border-amber-200";
      case "info": return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const statusColor = (status: IncidentReport["status"]) => {
    switch (status) {
      case "Under Review": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Investigating": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const appStatusColor = (status: BookingApplication["status"]) => {
    switch (status) {
      case "Submitted": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Documents Verified": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Payment Completed": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Booking Confirmed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const Sidebar = () => (
    <aside className="h-full flex flex-col bg-white border-r border-slate-100">
      {/* Branding */}
      <div className="p-4 md:p-5 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-purple-600 rounded-lg shadow-xs">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Admin Panel</h2>
            <p className="text-[9px] text-slate-400 font-medium">Super Admin</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 lg:hidden">
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${
                isActive
                  ? "bg-purple-50 text-purple-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} className={isActive ? "text-purple-600" : "text-slate-400"} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto text-purple-400" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-slate-50 space-y-2">
        <div className="px-3 py-2 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[9px] font-bold text-purple-700 shrink-0">
            {(adminUser?.displayName || currentUser?.displayName || "A").charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-slate-800 truncate">{adminUser?.displayName || currentUser?.displayName || "Admin"}</p>
            <p className="text-[8px] text-slate-400 truncate">{adminUser?.email || currentUser?.email || "admin@dwello"}</p>
          </div>
        </div>
        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab("dashboard")}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <LayoutDashboard size={16} />
            <span>Back to Dashboard</span>
          </button>
        )}
        {onAdminLogout && (
          <button
            onClick={onAdminLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out of Admin</span>
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar: fixed drawer on mobile, static on desktop */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:z-auto
      `}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin header */}
        <header className="h-14 md:h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-purple-600 shrink-0 hidden sm:block" />
              <h1 className="text-sm md:text-base font-bold text-slate-900 truncate">
                {navItems.find(n => n.id === activeTab)?.label || "Admin"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-lg border border-purple-200 hidden sm:flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>Super Admin</span>
            </span>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] md:text-xs font-bold text-purple-700">
              {currentUser?.displayName?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: "Total Users", value: mockUsers.length, icon: Users, color: "bg-purple-50 text-purple-600 border-purple-100", sub: `${totalStudents} students` },
                { label: "Hostels Listed", value: hostels.length, icon: Building2, color: "bg-blue-50 text-blue-600 border-blue-100", sub: `${hostels.filter(h => h.roomsLeft > 0).length} with vacancies` },
                { label: "Active Alerts", value: activeAlerts, icon: BellRing, color: "bg-red-50 text-red-600 border-red-100", sub: `${alerts.length} total` },
                { label: "Pending Incidents", value: pendingIncidents, icon: AlertTriangle, color: "bg-amber-50 text-amber-600 border-amber-100", sub: `${incidents.length} total reports` },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 md:p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                      <div className={`p-1.5 md:p-2 rounded-lg border ${stat.color}`}>
                        <Icon size={14} />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-lg md:text-2xl font-bold text-slate-950 tracking-tight">{stat.value}</h3>
                      <p className="text-[10px] md:text-xs text-slate-500 font-medium">{stat.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {[
                      { label: "New Users (7d)", value: 3, icon: TrendingUp, color: "text-emerald-600" },
                      { label: "Avg Safety Score", value: `${Math.round(hostels.reduce((s, h) => s + h.safetyScore, 0) / hostels.length)}%`, icon: ShieldCheck, color: "text-purple-600" },
                      { label: "Total Applications", value: applications.length, icon: FileText, color: "text-blue-600" },
                      { label: "Discussions", value: discussions.length, icon: MessageCircle, color: "text-cyan-600" },
                      { label: "Lost & Found", value: lostFoundItems.length, icon: Eye, color: "text-amber-600" },
                      { label: "Unread Notifications", value: notifications.filter(n => !n.isRead).length, icon: BellRing, color: "text-red-600" },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 md:p-5 shadow-xs flex items-center gap-3 md:gap-4">
                          <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 ${stat.color}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-lg md:text-xl font-bold text-slate-950">{stat.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent activity */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-4 border-b border-slate-100">Recent Platform Activity</h3>
                    <div className="mt-4 space-y-4">
                      {[
                        { icon: Users, text: "New student registered: Emeka Okafor", time: "2 hours ago", color: "bg-blue-100 text-blue-600" },
                        { icon: Building2, text: "Crown Heights Premium Lodge updated room availability", time: "5 hours ago", color: "bg-purple-100 text-purple-600" },
                        { icon: AlertTriangle, text: "New incident reported: Broken streetlight at West Gate", time: "8 hours ago", color: "bg-amber-100 text-amber-600" },
                        { icon: FileText, text: "Booking application submitted for Lighthouse Student Suites", time: "12 hours ago", color: "bg-emerald-100 text-emerald-600" },
                        { icon: MessageCircle, text: "New discussion: Security escort service review", time: "1 day ago", color: "bg-cyan-100 text-cyan-600" },
                      ].map((act, i) => {
                        const Icon = act.icon;
                        return (
                          <div key={i} className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-lg ${act.color} mt-0.5`}><Icon size={12} /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs md:text-sm text-slate-700 font-medium">{act.text}</p>
                              <span className="text-[10px] text-slate-400">{act.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-4 border-b border-slate-100">Quick Actions</h3>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "New Alert", icon: Plus, action: () => setShowAlertForm(true), setTab: "alerts" as const, color: "bg-red-50 text-red-600 hover:bg-red-100 border-red-100" },
                        { label: "View Reports", icon: AlertTriangle, action: () => setActiveTab("incidents"), setTab: "incidents", color: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100" },
                        { label: "Manage Hostels", icon: Building2, action: () => setActiveTab("hostels"), setTab: "hostels", color: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100" },
                        { label: "User Management", icon: Users, action: () => setActiveTab("users"), setTab: "users", color: "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-100" },
                      ].map((btn, i) => {
                        const Icon = btn.icon;
                        return (
                          <button key={i} onClick={btn.action} className={`flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl border text-xs md:text-sm font-bold transition-all ${btn.color}`}>
                            <Icon size={16} /><span>{btn.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users ({filteredUsers.length})</h3>
                    <div className="relative w-full sm:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white text-slate-800" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-slate-50 text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">
                          <th className="text-left p-3 md:p-4">Name</th>
                          <th className="text-left p-3 md:p-4 hidden sm:table-cell">Email</th>
                          <th className="text-left p-3 md:p-4 hidden md:table-cell">University</th>
                          <th className="text-left p-3 md:p-4">Role</th>
                          <th className="text-left p-3 md:p-4 hidden lg:table-cell">Joined</th>
                          <th className="text-left p-3 md:p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 md:p-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700 shrink-0">{u.name.charAt(0)}</div><span className="font-semibold text-slate-800">{u.name}</span></div></td>
                            <td className="p-3 md:p-4 text-slate-500 hidden sm:table-cell">{u.email}</td>
                            <td className="p-3 md:p-4 text-slate-500 hidden md:table-cell">{u.university}</td>
                            <td className="p-3 md:p-4"><span className={`px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-bold border ${roleColor(u.role)}`}>{u.role}</span></td>
                            <td className="p-3 md:p-4 text-slate-500 hidden lg:table-cell">{u.joined}</td>
                            <td className="p-3 md:p-4"><span className={`flex items-center gap-1 text-[10px] font-bold ${u.status === "active" ? "text-emerald-600" : "text-red-500"}`}><span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />{u.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "hostels" && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hostel Listings ({filteredHostels.length})</h3>
                    <div className="relative w-full sm:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search hostels..." className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white text-slate-800" />
                    </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {filteredHostels.map(h => (
                      <div key={h.id} className="p-4 md:p-6">
                        {showHostelEdit === h.id ? (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <img src={h.images[0]} alt={h.name} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shrink-0" />
                              <div className="flex-1 min-w-0"><h4 className="text-sm font-bold text-slate-900">{h.name}</h4><p className="text-[10px] text-slate-500">{h.location}</p></div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <div><label className="text-[9px] font-semibold text-slate-400 uppercase block mb-1">Price (₦)</label><input type="number" defaultValue={h.price} onChange={e => setHostelEdits(prev => ({ ...prev, [h.id]: { ...prev[h.id], price: Number(e.target.value) } }))} className="w-full px-2.5 py-1.5 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500" /></div>
                              <div><label className="text-[9px] font-semibold text-slate-400 uppercase block mb-1">Rooms Left</label><input type="number" defaultValue={h.roomsLeft} onChange={e => setHostelEdits(prev => ({ ...prev, [h.id]: { ...prev[h.id], roomsLeft: Number(e.target.value) } }))} className="w-full px-2.5 py-1.5 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500" /></div>
                              <div><label className="text-[9px] font-semibold text-slate-400 uppercase block mb-1">Safety Score</label><input type="number" defaultValue={h.safetyScore} min={0} max={100} onChange={e => setHostelEdits(prev => ({ ...prev, [h.id]: { ...prev[h.id], safetyScore: Number(e.target.value) } }))} className="w-full px-2.5 py-1.5 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500" /></div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <button onClick={() => handleSaveHostelEdit(h.id)} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg transition-colors">Save Changes</button>
                              <button onClick={() => { setShowHostelEdit(null); setHostelEdits(prev => { const n = { ...prev }; delete n[h.id]; return n; }); }} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg transition-colors">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3 md:gap-4">
                            <img src={h.images[0]} alt={h.name} className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div><h4 className="text-sm font-bold text-slate-900">{h.name}</h4><p className="text-[10px] md:text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {h.location}</p></div>
                                <span className="text-xs md:text-sm font-bold text-slate-950 whitespace-nowrap">₦{h.price.toLocaleString()}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-3">
                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] md:text-[10px] font-bold border ${h.roomsLeft > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>{h.roomsLeft > 0 ? `${h.roomsLeft} rooms left` : "Full"}</span>
                                <span className="text-[9px] md:text-[10px] font-semibold text-slate-500 flex items-center gap-1"><ShieldCheck size={10} className="text-purple-500" /> Safety: {h.safetyScore}%</span>
                                <span className="text-[9px] md:text-[10px] font-semibold text-slate-500 flex items-center gap-1"><Star size={10} className="text-amber-500" /> {h.rating}</span>
                                <span className="text-[9px] md:text-[10px] font-semibold text-slate-500">{h.reviewsCount} reviews</span>
                              </div>
                              <button onClick={() => setShowHostelEdit(h.id)} className="mt-2 text-[10px] font-bold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1"><Settings2 size={10} /> Edit</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "incidents" && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <div className="p-4 md:p-6 border-b border-slate-100"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incident Reports ({incidents.length})</h3></div>
                  <div className="divide-y divide-slate-50">
                    {incidents.map(inc => (
                      <div key={inc.id} className="p-4 md:p-6">
                        {showIncidentDetail === inc.id ? (
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div><h4 className="text-sm font-bold text-slate-900">{inc.title}</h4><p className="text-[10px] text-slate-500">{inc.category} • {inc.location} • {inc.timestamp}</p></div>
                              <button onClick={() => setShowIncidentDetail(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={16} /></button>
                            </div>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{inc.description}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusColor(inc.status)}`}>{inc.status}</span>
                              {!inc.isAnonymous && inc.reporterName && <span className="text-[10px] text-slate-500">Reported by: {inc.reporterName}</span>}
                              <span className="text-[10px] text-slate-500">{inc.upvotes} upvotes</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50">
                              <span className="text-[10px] font-semibold text-slate-400">Update Status:</span>
                              {(["Under Review", "Investigating", "Resolved"] as const).map(s => (
                                <button key={s} onClick={() => onUpdateIncidentStatus?.(inc.id, s)} className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors ${inc.status === s ? "bg-purple-600 text-white border-purple-600" : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"}`}>{s}</button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2"><h4 className="text-sm font-bold text-slate-900">{inc.title}</h4><span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${statusColor(inc.status)}`}>{inc.status}</span></div>
                              <p className="text-xs text-slate-500 mt-0.5">{inc.category} • {inc.location} • {inc.timestamp}</p>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-1">{inc.description}</p>
                            </div>
                            <button onClick={() => setShowIncidentDetail(inc.id)} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors shrink-0"><Eye size={14} /></button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button onClick={() => setShowAlertForm(!showAlertForm)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs">
                      <Plus size={14} /><span>{showAlertForm ? "Cancel" : "Create Alert"}</span>
                    </button>
                  </div>

                  {showAlertForm && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Safety Alert</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2"><label className="text-[10px] font-semibold text-slate-500 block mb-1">Title</label><input type="text" value={newAlert.title} onChange={e => setNewAlert(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. Suspicious Activity at North Gate" className="w-full px-3 py-2 bg-slate-50 text-sm rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white" /></div>
                        <div><label className="text-[10px] font-semibold text-slate-500 block mb-1">Severity</label><select value={newAlert.severity} onChange={e => setNewAlert(prev => ({ ...prev, severity: e.target.value as SafetyAlert["severity"] }))} className="w-full px-3 py-2 bg-slate-50 text-sm rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500"><option value="critical">Critical</option><option value="warning">Warning</option><option value="info">Info</option></select></div>
                        <div><label className="text-[10px] font-semibold text-slate-500 block mb-1">Location</label><input type="text" value={newAlert.location} onChange={e => setNewAlert(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g. North Gate Shuttle Stop" className="w-full px-3 py-2 bg-slate-50 text-sm rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white" /></div>
                        <div className="sm:col-span-2"><label className="text-[10px] font-semibold text-slate-500 block mb-1">Description</label><textarea value={newAlert.description} onChange={e => setNewAlert(prev => ({ ...prev, description: e.target.value }))} placeholder="Detailed description of the alert..." rows={3} className="w-full px-3 py-2 bg-slate-50 text-sm rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white resize-none" /></div>
                        <div className="sm:col-span-2"><label className="text-[10px] font-semibold text-slate-500 block mb-1">AI Advice</label><textarea value={newAlert.aiAdvice} onChange={e => setNewAlert(prev => ({ ...prev, aiAdvice: e.target.value }))} placeholder="Safety advice for students..." rows={2} className="w-full px-3 py-2 bg-slate-50 text-sm rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white resize-none" /></div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAlertForm(false)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleCreateAlert} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><BellRing size={12} /><span>Broadcast Alert</span></button>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-slate-100 rounded-2xl shadow-xs divide-y divide-slate-50">
                    {alerts.map(a => (
                      <div key={a.id} className="p-4 md:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap"><h4 className="text-sm font-bold text-slate-900">{a.title}</h4><span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${severityColor(a.severity)}`}>{a.severity}</span></div>
                            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><MapPin size={10} /> {a.location} • {a.timestamp}</p>
                            <p className="text-xs text-slate-600 mt-1">{a.description}</p>
                            {a.aiAdvice && <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100"><p className="text-[10px] font-semibold text-purple-700">AI Advice: {a.aiAdvice}</p></div>}
                          </div>
                          <button onClick={() => onDismissAlert?.(a.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"><XCircle size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "applications" && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <div className="p-4 md:p-6 border-b border-slate-100"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Applications ({applications.length})</h3></div>
                  <div className="divide-y divide-slate-50">
                    {applications.map(app => (
                      <div key={app.id} className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900">{app.hostelName}</h4>
                            <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">{app.roomType} • Applied {app.appliedDate}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${appStatusColor(app.status)}`}>{app.status}</span>
                              <span className="text-xs font-bold text-slate-900">₦{app.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-3">
                              {[1, 2, 3, 4].map(step => (
                                <div key={step} className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${step <= app.stepIndex ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-400"}`}>{step <= app.stepIndex ? <CheckCircle size={10} /> : step}</div>
                                  {step < 4 && <div className={`w-6 md:w-8 h-0.5 ${step < app.stepIndex ? "bg-purple-600" : "bg-slate-100"}`} />}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(["Submitted", "Documents Verified", "Payment Completed", "Booking Confirmed"] as const).map((s, i) => (
                              <button key={s} onClick={() => onUpdateApplicationStatus?.(app.id, s, i + 1)} className={`px-2 py-1 text-[9px] font-bold rounded-lg border transition-colors whitespace-nowrap ${app.status === s ? "bg-purple-600 text-white border-purple-600" : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"}`}>{i + 1}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "community" && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-xs">
                    <div className="p-4 md:p-6 border-b border-slate-100"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Discussions ({discussions.length})</h3></div>
                    <div className="divide-y divide-slate-50">
                      {discussions.map(d => (
                        <div key={d.id} className="p-4 md:p-6">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2"><h4 className="text-sm font-bold text-slate-900">{d.title}</h4><span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-bold">{d.category}</span></div>
                              <p className="text-xs text-slate-500 mt-1">{d.author} • {d.replies} replies • {d.upvotes} upvotes</p>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-1">{d.content}</p>
                            </div>
                            <button onClick={() => onDeleteDiscussion?.(d.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl shadow-xs">
                    <div className="p-4 md:p-6 border-b border-slate-100"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lost & Found Items ({lostFoundItems.length})</h3></div>
                    <div className="divide-y divide-slate-50">
                      {lostFoundItems.map(item => (
                        <div key={item.id} className="p-4 md:p-6">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2"><h4 className="text-sm font-bold text-slate-900">{item.title}</h4><span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${item.status === "Lost" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{item.status}</span></div>
                              <p className="text-xs text-slate-500 mt-1">{item.location} • {item.date} • {item.category}</p>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.description}</p>
                            </div>
                            <button onClick={() => onDeleteLostFound?.(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
