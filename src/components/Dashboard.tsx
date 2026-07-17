import React, { useState } from "react";
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Lightbulb, 
  Zap, 
  AlertTriangle,
  MapPin,
  TrendingUp,
  Heart,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Hostel, SafetyAlert } from "../types";

interface DashboardProps {
  hostels: Hostel[];
  alerts: SafetyAlert[];
  onNavigateToTab: (tabId: string, searchPhrase?: string) => void;
  onToggleSaveHostel: (id: string) => void;
  savedHostelIds: string[];
  currentUser?: {
    uid: string;
    email: string | null;
    displayName: string;
    university: string;
    avatarUrl?: string;
  } | null;
}

export default function Dashboard({ 
  hostels, 
  alerts, 
  onNavigateToTab, 
  onToggleSaveHostel, 
  savedHostelIds,
  currentUser
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<{ text: string; matches: Hostel[] } | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Filter out the best hostel for Timothy
  const recommendedHostel = hostels.find(h => h.id === "h1") || hostels[0];
  const secondaryRecommended = hostels.find(h => h.id === "h2") || hostels[1];

  const suggestedPrompts = [
    "Find hostels below ₦200,000",
    "Which hostel has reliable electricity?",
    "Safest hostel near Engineering?",
    "Best hostel with WiFi?"
  ];

  const handlePromptClick = (prompt: string) => {
    setSearchQuery(prompt);
    triggerAISearch(prompt);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    triggerAISearch(searchQuery);
  };

  const triggerAISearch = (query: string) => {
    setIsTyping(true);
    setAiResponse(null);

    // Simulate smart AI understanding and matching
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      let matchedList: Hostel[] = [];
      let aiAnalysisText = "";

      if (lowercaseQuery.includes("200") || lowercaseQuery.includes("below")) {
        matchedList = hostels.filter(h => h.price <= 210000);
        aiAnalysisText = `I found **${matchedList.length} hostels** that are budget-friendly (close to or under ₦200,000). While affordable, Apex Scholar Quarters offers 2-min walking access to classes, whereas Emerald Court requires a short shuttle.`;
      } else if (lowercaseQuery.includes("electricity") || lowercaseQuery.includes("power")) {
        matchedList = hostels.filter(h => h.electricityReliability === "Excellent" || h.electricityReliability === "Good");
        aiAnalysisText = `I filtered **${matchedList.length} hostels** with the strongest electricity profiles. Crown Heights Premium Lodge leads with 20h+ daily uptime, which perfectly safeguards your Computer Science programming runs!`;
      } else if (lowercaseQuery.includes("safest") || lowercaseQuery.includes("safety") || lowercaseQuery.includes("engineering")) {
        matchedList = hostels.filter(h => h.safetyScore >= 90);
        aiAnalysisText = `Here are the top-rated safety lodges. Crown Heights and Ivory Heights boast **96%+ Safety Scores** with armed patrols, and are nearest to the technology & engineering blocks.`;
      } else if (lowercaseQuery.includes("wifi") || lowercaseQuery.includes("internet")) {
        matchedList = hostels.filter(h => h.wifiAvailable);
        aiAnalysisText = `Found **${matchedList.length} premium hostels** with active high-speed WiFi networks. Both Crown Heights and Lighthouse suites provide steady fiber connections ideal for student developers.`;
      } else {
        matchedList = hostels.slice(0, 2);
        aiAnalysisText = `Scanning for '${query}'... Based on your CS major, I recommend lodging at Crown Heights or Lighthouse suites due to reliable electricity profiles and secure walk-paths.`;
      }

      setAiResponse({
        text: aiAnalysisText,
        matches: matchedList
      });
      setIsTyping(false);
    }, 900);
  };

  // Quick stats calculations
  const totalVerified = hostels.length;
  const avgSafetyScore = Math.round(hostels.reduce((sum, h) => sum + h.safetyScore, 0) / totalVerified);
  const activeAlertsCount = alerts.filter(a => a.severity === "critical" || a.severity === "warning").length;
  const criticalAlertsCount = alerts.filter(a => a.severity === "critical").length;

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header section with User Greeting */}
      <div className="flex flex-col justify-between items-start gap-6 pb-2">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-slate-950 leading-tight">Welcome back, {currentUser?.displayName || "Student"}</h1>
          <p className="text-xs md:text-base text-slate-500 leading-relaxed max-w-2xl">
            Your AI-powered housing and campus safety control center is fully operational.
          </p>
        </div>
      </div>

      {/* AI Assistant Hero search card */}
      <div className="bg-gradient-to-tr from-slate-950 via-purple-950 to-slate-900 rounded-2xl p-5 md:p-10 text-white shadow-lg relative overflow-hidden">
        {/* Subtle glowing overlay */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl leading-tight">Find your perfect hostel with AI.</h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
              Describe what you need in plain English. I'll automatically analyze electricity uptime, water pressure, safety history, and walk distances to campus for you.
            </p>
          </div>

          {/* Large AI Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 md:left-4 text-slate-300" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Hostels with constant light, fiber internet..."
              className="w-full pl-9 md:pl-12 pr-28 md:pr-32 py-3 md:py-4 bg-slate-950/50 hover:bg-slate-950/65 backdrop-blur-md text-white focus:bg-white focus:text-slate-950 rounded-xl border border-white/20 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-sm md:text-base placeholder-slate-400 focus:placeholder-slate-500 transition-all outline-none shadow-inner"
            />
            <button 
              type="submit"
              disabled={isTyping}
              className="absolute right-1.5 md:right-2.5 px-3 md:px-5 py-1.5 md:py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-700 text-white font-semibold text-[10px] md:text-xs rounded-lg transition-colors flex items-center gap-1 md:gap-1.5 shadow-md"
            >
              {isTyping ? "..." : "Ask AI"}
              <ArrowRight size={10} className="hidden md:inline" />
            </button>
          </form>

          {/* Suggested Prompts */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">Suggested Prompts</span>
            <div className="flex flex-wrap gap-2.5">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(p)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-medium text-slate-200 hover:text-white transition-all duration-150"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Interactive Search Results Panel */}
      {(isTyping || aiResponse) && (
        <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-purple-800 font-semibold text-sm">
            <Sparkles size={16} className="text-purple-600 animate-spin-slow" />
            <span>CampusAI Search Response</span>
          </div>

          {isTyping ? (
            <div className="flex items-center gap-3 py-3">
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Analyzing student reviews, grid logs, and geofencing coordinates...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {aiResponse?.text}
              </p>

              {aiResponse?.matches && aiResponse.matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiResponse.matches.map(h => (
                    <div key={h.id} className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-3 shadow-xs">
                      <img src={h.images[0]} alt={h.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{h.name}</h4>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-sm">
                            {h.aiMatchScore}% Match
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{h.location}</p>
                        <p className="text-xs font-semibold text-slate-800 mt-1">₦{h.price.toLocaleString()} / year</p>
                        <button 
                          onClick={() => onNavigateToTab("browse")}
                          className="mt-1.5 text-[10px] text-purple-600 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          View Details <ChevronRight size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">No matches found. Try relaxing your constraints!</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Statistics Row (Reference image style but customized) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: "Verified Hostels", value: totalVerified, sub: "Directly verified", icon: ShieldCheck, color: "text-purple-600 bg-purple-50 border-purple-100" },
          { label: "Campus Safety Score", value: `${avgSafetyScore}%`, sub: "+3.4% vs last week", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Live Safety Alerts", value: activeAlertsCount, sub: "Last updated 1h ago", icon: AlertTriangle, color: activeAlertsCount > 0 ? "text-amber-600 bg-amber-50 border-amber-100" : "text-slate-500 bg-slate-50 border-slate-100" },
          { label: "Live Safety Feed", value: criticalAlertsCount, sub: `${criticalAlertsCount} critical active`, icon: AlertTriangle, color: criticalAlertsCount > 0 ? "text-red-600 bg-red-50 border-red-100 animate-pulse" : "text-slate-500 bg-slate-50 border-slate-100" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-1.5 md:p-2 rounded-xl border ${stat.color}`}>
                  <Icon size={14} />
                </div>
              </div>
              <div className="mt-3 md:mt-5 space-y-0.5 md:space-y-1">
                <h3 className="text-lg md:text-2xl font-bold text-slate-950 tracking-tight">{stat.value}</h3>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Content: AI Recommended vs Safety Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Recommended Hostel + Safety News */}
        <div className="lg:col-span-2 space-y-8">
          
            {/* AI Recommended Hostel - Dynamic Spotlight */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-8 shadow-xs space-y-4 md:space-y-6">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600" />
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">AI Recommended Spotlight</h3>
              </div>
              <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100/50">
                {recommendedHostel.aiMatchScore}% Best Match
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {/* Image Container with relative badges */}
              <div className="relative w-full overflow-hidden rounded-2xl">
                <img 
                  src={recommendedHostel.images[0]} 
                  alt={recommendedHostel.name} 
                  className="w-full h-56 sm:h-72 lg:h-80 object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
                <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-wider uppercase">Spotlight Match</span>
                </div>
              </div>

              {/* Details and Actions Stack */}
              <div className="w-full space-y-5">
                {/* Name & Location */}
                <div>
                  <h4 className="text-2xl font-bold text-slate-950 tracking-tight leading-tight">{recommendedHostel.name}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    {recommendedHostel.location}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-950">₦{recommendedHostel.price.toLocaleString()}</span>
                  <span className="text-slate-400 text-sm font-medium">/ year</span>
                </div>

                {/* AI Reasoning Block with elegant left border */}
                <div className="relative pl-4 border-l-2 border-purple-500 py-0.5">
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{recommendedHostel.aiReasoning}"
                  </p>
                </div>

                {/* Features & Key Details */}
                <div className="flex flex-wrap gap-2">
                  {recommendedHostel.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                      {f}
                    </span>
                  ))}
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100/50 px-3 py-1.5 rounded-xl flex items-center gap-1">
                    ⚡ {recommendedHostel.electricityReliability} Electricity
                  </span>
                </div>

                {/* Bottom Row Buttons and Actions */}
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <button 
                    onClick={() => onNavigateToTab("browse")}
                    className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-purple-500/10 flex items-center justify-center gap-2"
                  >
                    Browse Details
                    <ExternalLink size={14} />
                  </button>
                  <button 
                    onClick={() => onToggleSaveHostel(recommendedHostel.id)}
                    title={savedHostelIds.includes(recommendedHostel.id) ? "Remove from Watchlist" : "Save to Watchlist"}
                    className={`px-7 py-3 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                      savedHostelIds.includes(recommendedHostel.id) 
                        ? "bg-red-50 border-red-100 text-red-500 shadow-sm" 
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 hover:border-slate-200"
                    }`}
                  >
                    <Heart size={18} fill={savedHostelIds.includes(recommendedHostel.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby & Alternate Accommodation Recommendations */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-4 md:pb-5 border-b border-slate-100">
              <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Alternative AI Match Candidates</h3>
              <button 
                onClick={() => onNavigateToTab("browse")}
                className="text-[10px] md:text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                View all hostels
              </button>
            </div>
            <div className="mt-4 md:mt-6 grid grid-cols-1 gap-3 md:gap-4">
              {[secondaryRecommended, hostels[4]].filter(Boolean).map((h) => (
                <div key={h.id} className="border border-slate-100 hover:border-purple-200 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 transition-all bg-slate-50/30 hover:bg-white hover:shadow-xs">
                  <img src={h.images[0]} alt={h.name} className="w-16 md:w-20 h-16 md:h-20 rounded-lg md:rounded-xl object-cover flex-shrink-0 shadow-xs" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-950 truncate">{h.name}</h4>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100/50">
                          {h.aiMatchScore}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{h.location}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/50">
                      <span className="text-xs font-bold text-slate-950">₦{h.price.toLocaleString()}</span>
                      <span className="text-xs text-emerald-600 font-medium">⚡ {h.electricityReliability}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights & Alerts Widget */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-8 shadow-xs">
            <div className="flex items-center gap-2 pb-5 border-b border-slate-100">
              <Lightbulb size={16} className="text-amber-500" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Regional Insights</h3>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex gap-4 p-4.5 rounded-2xl bg-amber-50/30 border border-amber-100/60 text-slate-700">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 h-fit shadow-xs">
                  <Zap size={16} />
                </div>
                <div className="text-sm leading-relaxed space-y-1.5">
                  <span className="font-bold text-slate-900 block">South Gate Feeder Strain Detected</span>
                  <p className="text-slate-600">Our machine learning logs indicate a 7% voltage fluctuation around South Gate residential lanes this Tuesday afternoon. Apex and Crown Heights buildings remain protected on local backups.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4.5 rounded-2xl bg-purple-50/30 border border-purple-100/60 text-slate-700">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 h-fit shadow-xs">
                  <ShieldCheck size={16} />
                </div>
                <div className="text-sm leading-relaxed space-y-1.5">
                  <span className="font-bold text-slate-900 block">Safety Score Upgrades</span>
                  <p className="text-slate-600">Increased student patrol escorts around the West Gate pedestrian bridge have successfully lowered risk coordinates. Local Safety index improved to 92/100 today.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Safety Alert Feeds + Recent Activity */}
        <div className="space-y-6">
          
          {/* Activity Timeline */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-8 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-5 border-b border-slate-100">
              {currentUser?.displayName || "Student"}'s Activity Timeline
            </h3>

            <div className="mt-6 relative border-l border-slate-100 pl-6 space-y-6">
              {[
                { title: "Hostel Saved", desc: "Saved 'Ivory Private Heights' to watchlist.", date: "Today, 10:45 AM", color: "bg-purple-600" },
                { title: "Scam Audit Checked", desc: "Uploaded screenshot of Facebook lister Kalu Prince. Scam risk computed at 84% (High Risk).", date: "Yesterday, 3:20 PM", color: "bg-red-500" },
                { title: "Discussion Started", desc: "Asked about steady MTN/Airtel coverage around West Gate lodges.", date: "July 12, 1:12 PM", color: "bg-blue-500" },
                { title: "Profile Initialized", desc: "Updated course preferences to Computer Science, requesting constant power utilities.", date: "July 10, 9:00 AM", color: "bg-emerald-500" }
              ].map((act, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline bullet dot */}
                  <span className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white ${act.color}`} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-950">{act.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{act.desc}</p>
                    <span className="text-[10px] font-medium text-slate-400 block">{act.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
