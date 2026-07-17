import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Search, 
  Sparkles, 
  Heart, 
  GitCompare, 
  Map, 
  BellRing, 
  AlertTriangle, 
  PhoneCall, 
  MessageSquareCode, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  FileText, 
  FolderLock, 
  User, 
  Settings2,
  MessageCircle,
  HelpCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  notificationsCount: number;
  applicationsCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentUser: {
    uid: string;
    email: string | null;
    displayName: string;
    university: string;
    avatarUrl?: string;
  } | null;
  onLogout: () => Promise<void>;
}

interface HoveredItem {
  label: string;
  tooltip: string;
  rect: DOMRect;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  savedCount, 
  notificationsCount, 
  applicationsCount,
  isOpen,
  setIsOpen,
  currentUser,
  onLogout
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar_collapsed", String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, label: string, tooltip: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({ label, tooltip, rect });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const navGroups = [
    {
      title: "MAIN",
      items: [
        { 
          id: "dashboard", 
          label: "Dashboard", 
          icon: LayoutDashboard,
          tooltip: "View housing overview, match highlights, and security alerts."
        },
      ]
    },
    {
      title: "ACCOMMODATION",
      items: [
        { 
          id: "browse", 
          label: "Browse Hostels", 
          icon: Search,
          tooltip: "Search and explore verified premium hostels around campus."
        },
        { 
          id: "matchmaker", 
          label: "AI Matchmaker", 
          icon: Sparkles, 
          badge: "NEW",
          tooltip: "Find your ideal accommodation using our AI match algorithm."
        },
        { 
          id: "saved", 
          label: "Saved Hostels", 
          icon: Heart, 
          count: savedCount,
          tooltip: "Manage your bookmarked and watched hostel properties."
        },
        { 
          id: "compare", 
          label: "Compare Hostels", 
          icon: GitCompare,
          tooltip: "Compare prices, distances, and safety scores side-by-side."
        },
      ]
    },
    {
      title: "SAFETY",
      items: [
        { 
          id: "safety-map", 
          label: "Safety Map", 
          icon: Map,
          tooltip: "Explore real-time security heatmaps and verified safe paths."
        },
        { 
          id: "live-alerts", 
          label: "Live Alerts", 
          icon: BellRing, 
          badge: "LIVE", 
          badgeColor: "bg-red-500 text-white animate-pulse",
          tooltip: "Get real-time security logs, patrol updates, and warnings."
        },
        { 
          id: "incidents", 
          label: "Incident Reports", 
          icon: AlertTriangle,
          tooltip: "Report safety concerns or read student-verified logs."
        },
        { 
          id: "sos", 
          label: "Emergency SOS", 
          icon: PhoneCall, 
          badgeColor: "bg-red-600 text-white animate-pulse",
          tooltip: "Access panic buttons and campus emergency responder lines."
        },
      ]
    },
    {
      title: "AI TOOLS",
      items: [
        { 
          id: "assistant", 
          label: "Campus Assistant", 
          icon: MessageSquareCode, 
          badge: "AI",
          tooltip: "Chat with CampusAI to resolve hostel, life, or study queries."
        },
        { 
          id: "insights", 
          label: "Review Insights", 
          icon: BarChart3,
          tooltip: "Explore AI-synthesized student reviews and ratings."
        },
        { 
          id: "scam-detector", 
          label: "Scam Detector", 
          icon: ShieldCheck,
          tooltip: "Analyze rental posts and agent credentials for fraud risk."
        },
        { 
          id: "roommate-match", 
          label: "Roommate Match", 
          icon: Users,
          tooltip: "Match with compatible students based on lifestyle habits."
        },
      ]
    },
    {
      title: "COMMUNITY",
      items: [
        { 
          id: "community-feed", 
          label: "Community Feed", 
          icon: MessageCircle,
          tooltip: "Post updates, share news, and check active campus happenings."
        },
        { 
          id: "discussions", 
          label: "Discussions", 
          icon: MessageCircle,
          tooltip: "Join open forums for student advice, housing tips, and chat."
        },
        { 
          id: "lost-found", 
          label: "Lost & Found", 
          icon: HelpCircle,
          tooltip: "Report lost items or claim items found near hostel areas."
        },
      ]
    },
    {
      title: "ACCOUNT",
      items: [
        { 
          id: "applications", 
          label: "My Applications", 
          icon: FileText, 
          count: applicationsCount,
          tooltip: "Track status of your ongoing hostel rental applications."
        },
        { 
          id: "notifications", 
          label: "Notifications", 
          icon: BellRing, 
          count: notificationsCount,
          tooltip: "View your personal account and emergency notices."
        },
        { 
          id: "profile", 
          label: "Profile", 
          icon: User,
          tooltip: "Manage verified student credentials and preferences."
        },
        { 
          id: "settings", 
          label: "Settings", 
          icon: Settings2,
          tooltip: "Configure active campus zone and notification setups."
        },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-100 transition-all duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:h-screen
        ${isCollapsed ? "w-72 lg:w-20" : "w-72 lg:w-72"}
      `}>
        {/* Header Branding */}
        <div className={`flex items-center ${isCollapsed ? "justify-center py-6 px-2" : "justify-between p-5"} border-b border-slate-50 relative`}>
          
          {isCollapsed ? (
            /* Collapsed Logo with Hover Expand Button */
            <div 
              className="relative group cursor-pointer" 
              onClick={toggleCollapse}
            >
              <img src="/logo.png" alt="CampusAI" className="w-20 h-20 rounded-lg object-contain shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double toggling
                  toggleCollapse();
                }}
                className="absolute inset-0 flex items-center justify-center bg-purple-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xs shadow-purple-500/20 focus:opacity-100"
                title="Expand Sidebar"
              >
                <ChevronRight size={16} className="stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* Fully Expanded Logo & Branding */
            <div className="flex items-center">
              <img src="/logo.png" alt="CampusAI" className="w-20 h-20 rounded-lg object-contain shrink-0" />
            </div>
          )}

          {/* Toggle Collapse Button for Expanded State (only show when not collapsed) */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 p-1.5 rounded-lg border border-slate-100 shadow-2xs transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Close button for Mobile drawer */}
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 lg:hidden absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav 
          onScroll={handleMouseLeave}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-5 custom-scrollbar"
        >
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </h3>
              )}
              {isCollapsed && group !== navGroups[0] && (
                <div className="border-t border-slate-100 my-3 mx-2" />
              )}
              <div className="space-y-[2px]">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                        handleMouseLeave();
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, item.label, item.tooltip)}
                      onMouseLeave={handleMouseLeave}
                      className={`
                        w-full flex items-center relative cursor-pointer ${isCollapsed ? "justify-center py-2.5" : "justify-between px-3 py-[7px]"} rounded-lg text-sm font-medium transition-all group duration-150
                        ${isActive 
                          ? "bg-purple-50 text-purple-700 font-semibold shadow-xs" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"}`}>
                        <Icon 
                          size={17} 
                          className={`transition-colors ${isActive ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"}`}
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>

                      {/* Badges and Counts */}
                      {!isCollapsed && (
                        <>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-sm ${item.badgeColor || "bg-purple-100 text-purple-700"}`}>
                              {item.badge}
                            </span>
                          )}
                          {item.count !== undefined && item.count > 0 && (
                            <span className={`flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-semibold rounded-full ${isActive ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                              {item.count}
                            </span>
                          )}
                        </>
                      )}

                      {/* Collapsed Badge Indicators */}
                      {isCollapsed && ((item.count !== undefined && item.count > 0) || item.badge) && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-600 border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom User Card */}
        <div className={`p-4 border-t border-slate-50 bg-slate-50/50 flex flex-col gap-2.5 ${isCollapsed ? "items-center" : ""}`}>
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 p-1 rounded-xl"}`}>
            <div className="relative">
              <img 
                src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                alt={currentUser?.displayName || "Timothy Bayode"} 
                className="w-10 h-10 rounded-full object-cover border-2 border-white ring-2 ring-purple-100"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 truncate">{currentUser?.displayName || "Timothy Bayode"}</h4>
                <p className="text-[10px] text-slate-500 truncate">{currentUser?.university || "LAUTECH"} Student</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[9px] font-medium text-emerald-600 uppercase tracking-wider">Online Status</span>
                </div>
              </div>
            )}
          </div>
          {!isCollapsed ? (
            <button
              onClick={onLogout}
              className="w-full text-center py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-55 hover:text-red-700 bg-red-50/40 rounded-lg transition-colors border border-red-100 cursor-pointer flex items-center justify-center gap-1"
            >
              <LogOut size={12} />
              <span>Sign Out Account</span>
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </aside>

      {/* Floating Viewport Tooltip */}
      {hoveredItem && (
        <div 
          className="fixed z-50 bg-slate-950/95 backdrop-blur-xs text-white text-xs py-2 px-3 rounded-xl shadow-lg border border-white/10 flex flex-col gap-0.5 pointer-events-none transition-all duration-150 animate-in fade-in-0 zoom-in-95"
          style={{
            top: hoveredItem.rect.top + (hoveredItem.rect.height / 2),
            left: hoveredItem.rect.right + 12,
            transform: "translateY(-50%)",
          }}
        >
          <div className="font-bold text-[10px] tracking-wider text-purple-400 uppercase">
            {hoveredItem.label}
          </div>
          <div className="text-slate-200 text-[11px] leading-snug max-w-[200px] font-medium">
            {hoveredItem.tooltip}
          </div>
          {/* Small arrow */}
          <div 
            className="absolute w-2 h-2 bg-slate-950 border-l border-b border-white/10 rotate-45"
            style={{
              left: "-4.5px",
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
            }}
          />
        </div>
      )}
    </>
  );
}
