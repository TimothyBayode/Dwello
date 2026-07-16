import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import BrowseHostels from "./components/BrowseHostels";
import AIMatchmaker from "./components/AIMatchmaker";
import CompareHostels from "./components/CompareHostels";
import SafetyMap from "./components/SafetyMap";
import LiveAlerts from "./components/LiveAlerts";
import IncidentReports from "./components/IncidentReports";
import EmergencySOS from "./components/EmergencySOS";
import CampusAssistant from "./components/CampusAssistant";
import ReviewInsights from "./components/ReviewInsights";
import ScamDetector from "./components/ScamDetector";
import RoommateMatch from "./components/RoommateMatch";
import CommunityFeed from "./components/CommunityFeed";
import Discussions from "./components/Discussions";
import LostAndFound from "./components/LostAndFound";
import MyApplications from "./components/MyApplications";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import AuthPage from "./components/AuthPage";

// Import Firebase handlers
import { getFirebaseAuth, getFirebaseDb, logoutUser } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Import mock data and types
import { 
  hostelsData, 
  safetyAlertsData, 
  initialIncidents, 
  roommatesData, 
  initialDiscussions, 
  initialLostFound 
} from "./data/mockData";
import { Hostel, IncidentReport, DiscussionThread, LostFoundItem, BookingApplication, NotificationItem } from "./types";
import { Menu, Bell, User, MapPin } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentUni, setCurrentUni] = useState<string>("LAUTECH");

  const [currentUser, setCurrentUser] = useState<{
    uid: string;
    email: string | null;
    displayName: string;
    university: string;
    avatarUrl?: string;
  } | null>(null);

  // Sync auth state
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let displayName = user.displayName || "Student";
        let university = "LAUTECH";
        let avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

        const db = getFirebaseDb();
        if (db) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              displayName = data.fullName || displayName;
              university = data.university || university;
              avatarUrl = data.avatarUrl || avatarUrl;
            }
          } catch (e) {
            console.error("Error fetching user profile from Firestore:", e);
          }
        }

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName,
          university,
          avatarUrl
        });
        setCurrentUni(university);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setActiveTab("landing");
  };

  const handleUpdateProfile = async (updated: { displayName?: string; university?: string; avatarUrl?: string }) => {
    setCurrentUser(prev => prev ? { ...prev, ...updated } : null);
    if (updated.university) {
      setCurrentUni(updated.university);
    }
  };

  const handleNavigateToTab = (tabId: string) => {
    if (tabId === "auth-signin") {
      setAuthMode("signin");
      setActiveTab("auth");
    } else if (tabId === "auth-signup") {
      setAuthMode("signup");
      setActiveTab("auth");
    } else {
      setActiveTab(tabId);
    }
  };

  // Centralized state repositories
  const [savedHostelIds, setSavedHostelIds] = useState<string[]>(["h1", "h4"]);
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialIncidents);
  const [discussions, setDiscussions] = useState<DiscussionThread[]>(initialDiscussions);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(initialLostFound);
  
  const [applications, setApplications] = useState<BookingApplication[]>([
    {
      id: "app-308",
      hostelId: "h1",
      hostelName: "Crown Heights Premium Lodge",
      roomType: "Single Premium Studio (with Solar back-up)",
      price: 320000,
      appliedDate: "2026-07-12",
      status: "Payment Completed",
      stepIndex: 3
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: "Document Verification Success",
      details: "Your student card credentials have been verified by our Safety Board.",
      timestamp: "1 hour ago",
      type: "info",
      isRead: false
    },
    {
      id: "n2",
      title: "🚩 Active Rent Scam Warning",
      details: "Security patrols flagged an unverified agent requesting deposits at North Gate. Always use Escrow!",
      timestamp: "4 hours ago",
      type: "alert",
      isRead: false
    }
  ]);

  // Saved Hostels filtering
  const savedHostels = hostelsData.filter(h => savedHostelIds.includes(h.id));

  // Toggle Saved Handler
  const handleToggleSave = (id: string) => {
    setSavedHostelIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddIncident = (newInc: Omit<IncidentReport, "id" | "timestamp" | "status" | "upvotes">) => {
    const report: IncidentReport = {
      ...newInc,
      id: `r-${Date.now()}`,
      timestamp: new Date().toISOString().split("T")[0],
      status: "Under Review",
      upvotes: 1
    };
    setIncidents(prev => [report, ...prev]);
  };

  const handleAddDiscussion = (newDisc: Omit<DiscussionThread, "id" | "replies" | "upvotes" | "timestamp" | "avatar">) => {
    const disc: DiscussionThread = {
      ...newDisc,
      id: `d-${Date.now()}`,
      replies: 0,
      upvotes: 1,
      timestamp: "Just Now",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    };
    setDiscussions(prev => [disc, ...prev]);
  };

  const handleAddLostFound = (newItem: Omit<LostFoundItem, "id" | "date">) => {
    const item: LostFoundItem = {
      ...newItem,
      id: `lf-${Date.now()}`,
      date: new Date().toISOString().split("T")[0]
    };
    setLostFoundItems(prev => [item, ...prev]);
  };

  const handleApplyHostel = (hostelId: string, roomType: string) => {
    const hostel = hostelsData.find(h => h.id === hostelId) || hostelsData[0];
    const newApp: BookingApplication = {
      id: `app-${Math.floor(100 + Math.random() * 900)}`,
      hostelId,
      hostelName: hostel.name,
      roomType,
      price: hostel.price,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Submitted",
      stepIndex: 1
    };
    setApplications(prev => [newApp, ...prev]);
    
    // Auto trigger notification
    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        title: "Application Logged Successfully",
        details: `Your booking application for ${hostel.name} has been created in status 'Submitted'.`,
        timestamp: "Just Now",
        type: "info",
        isRead: false
      },
      ...prev
    ]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Active Tab Rendering block
  const renderActivePage = () => {
    switch (activeTab) {
      case "landing":
        return (
          <LandingPage 
            onNavigateToTab={handleNavigateToTab} 
            savedCount={savedHostelIds.length} 
          />
        );
      case "auth":
        return (
          <AuthPage 
            initialMode={authMode} 
            onNavigateToTab={handleNavigateToTab} 
            onLoginSuccess={(profile) => {
              setCurrentUser(profile);
              setCurrentUni(profile.university);
            }}
          />
        );
      case "dashboard":
        return (
          <Dashboard 
            hostels={hostelsData} 
            alerts={safetyAlertsData} 
            onNavigateToTab={handleNavigateToTab} 
            onToggleSaveHostel={handleToggleSave}
            savedHostelIds={savedHostelIds}
          />
        );
      case "browse":
        return (
          <BrowseHostels 
            hostels={hostelsData} 
            savedHostelIds={savedHostelIds}
            onToggleSaveHostel={handleToggleSave}
            onApplyBooking={handleApplyHostel}
          />
        );
      case "matchmaker":
        return (
          <AIMatchmaker 
            hostels={hostelsData} 
            onNavigateToTab={handleNavigateToTab}
          />
        );
      case "saved":
        return (
          <BrowseHostels 
            hostels={savedHostels} 
            savedHostelIds={savedHostelIds}
            onToggleSaveHostel={handleToggleSave}
            onApplyBooking={handleApplyHostel}
            isSavedOnlyPage={true}
          />
        );
      case "compare":
        return (
          <CompareHostels 
            hostels={hostelsData} 
            onNavigateToTab={handleNavigateToTab}
          />
        );
      case "safety-map":
        return (
          <SafetyMap 
            onNavigateToTab={handleNavigateToTab} 
          />
        );
      case "live-alerts":
        return <LiveAlerts alerts={safetyAlertsData} />;
      case "incidents":
        return <IncidentReports incidents={incidents} onSubmitIncident={handleAddIncident} />;
      case "sos":
        return <EmergencySOS />;
      case "assistant":
        return <CampusAssistant />;
      case "insights":
        return <ReviewInsights hostels={hostelsData} />;
      case "scam-detector":
        return <ScamDetector />;
      case "roommate-match":
        return <RoommateMatch roommates={roommatesData} />;
      case "community-feed":
        return <CommunityFeed discussions={discussions} onSubmitDiscussion={handleAddDiscussion} />;
      case "discussions":
        return <Discussions discussions={discussions} />;
      case "lost-found":
        return <LostAndFound items={lostFoundItems} onSubmitItem={handleAddLostFound} />;
      case "applications":
        return <MyApplications applications={applications} />;
      case "notifications":
        return (
          <Notifications 
            notifications={notifications} 
            onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
            onClearNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
          />
        );
      case "profile":
        return <Profile currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />;
      case "settings":
        return <Settings currentUni={currentUni} onUniChange={setCurrentUni} />;
      default:
        return (
          <Dashboard 
            hostels={hostelsData} 
            alerts={safetyAlertsData} 
            onNavigateToTab={(tabId) => setActiveTab(tabId)} 
            onToggleSaveHostel={handleToggleSave}
            savedHostelIds={savedHostelIds}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar navigation panel */}
      {activeTab !== "landing" && activeTab !== "auth" && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          savedCount={savedHostelIds.length} 
          notificationsCount={unreadNotificationsCount} 
          applicationsCount={applications.length} 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

        {/* Main content body viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Universal Top Header */}
        {activeTab !== "landing" && activeTab !== "auth" && (
          <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-6 z-10">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-1 text-slate-500 hover:text-slate-800 lg:hidden focus:outline-none shrink-0"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={14} className="text-purple-600 shrink-0" />
                <span className="text-[10px] md:text-xs text-slate-600 tracking-tight truncate">
                  <span className="font-light hidden sm:inline">Active Zone:</span> <span className="font-bold text-slate-900">{currentUni}</span>
                  <span className="hidden sm:inline"> Campus Sector</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab("notifications")}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg relative transition-colors cursor-pointer"
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                )}
              </button>

              <button 
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-2 text-left focus:outline-none group"
              >
                <img 
                  src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                  alt={currentUser?.displayName || "Timothy Bayode"} 
                  className="w-8 h-8 rounded-full object-cover border border-slate-100 group-hover:border-purple-200 transition-colors"
                />
              </button>
            </div>
          </header>
        )}

        {/* Dynamic component routing panels */}
        <main className={`flex-1 overflow-y-auto ${(activeTab === "landing" || activeTab === "auth") ? "p-0" : "p-4 md:p-8 space-y-4 md:space-y-6"}`}>
          {renderActivePage()}
        </main>

      </div>

    </div>
  );
}
