import React, { useState } from "react";
import { SafetyAlert } from "../types";
import { BellRing, ShieldCheck, AlertTriangle, Info, Volume2, Search, Calendar, EyeOff } from "lucide-react";

interface LiveAlertsProps {
  alerts: SafetyAlert[];
  onDismissAlert?: (id: string) => void;
}

export default function LiveAlerts({ alerts }: LiveAlertsProps) {
  const [activeSeverity, setActiveSeverity] = useState<string>("All");
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const filteredAlerts = alerts.filter(a => {
    if (dismissedIds.includes(a.id)) return false;
    if (activeSeverity === "All") return true;
    return a.severity === activeSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BellRing className="text-red-500 animate-pulse" size={24} />
            <span>Real-time Safety Alert Feed</span>
          </h1>
          <p className="text-sm text-slate-500">
            Official emergency alerts and student-reported safety bulletins audited by campus safety wardens.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${soundEnabled ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"}`}
          >
            <Volume2 size={16} className={soundEnabled ? "animate-bounce" : ""} />
            <span>{soundEnabled ? "Alert Chimes Active" : "Mute Chimes"}</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Bars */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 w-fit">
        {["All", "critical", "warning", "info"].map((sev) => (
          <button
            key={sev}
            onClick={() => setActiveSeverity(sev)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors
              ${activeSeverity === sev 
                ? sev === "critical" 
                  ? "bg-red-500 text-white shadow-xs"
                  : sev === "warning"
                    ? "bg-amber-500 text-white shadow-xs"
                    : sev === "info"
                      ? "bg-blue-500 text-white shadow-xs"
                      : "bg-purple-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }
            `}
          >
            {sev === "All" ? "All Advisories" : sev}
          </button>
        ))}
      </div>

      {/* Alert Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: The Active Feed */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white border border-slate-100 p-12 text-center rounded-2xl space-y-3.5">
              <ShieldCheck className="mx-auto text-emerald-500" size={36} />
              <h3 className="text-base font-bold text-slate-800">Your Sector is Quiet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">No unread safety alerts or housing warnings are active around your current geofence profile.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCrit = alert.severity === "critical";
              const isWarn = alert.severity === "warning";
              
              return (
                <div 
                  key={alert.id}
                  className={`border rounded-2xl p-5 bg-white transition-all shadow-xs relative overflow-hidden flex gap-4 items-start
                    ${isCrit 
                      ? "border-red-100 bg-red-50/10" 
                      : isWarn 
                        ? "border-amber-100 bg-amber-50/10" 
                        : "border-slate-100"
                    }
                  `}
                >
                  {/* Left severity indicator badge strip */}
                  <div className={`w-1 self-stretch rounded-full ${isCrit ? "bg-red-500" : isWarn ? "bg-amber-500" : "bg-blue-500"}`} />

                  {/* Body info */}
                  <div className="flex-1 space-y-2.5">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCrit ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle size={10} className="animate-pulse" /> Urgent
                          </span>
                        ) : isWarn ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-extrabold text-[9px] uppercase tracking-wider">
                            Warning
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-extrabold text-[9px] uppercase tracking-wider">
                            Advisory
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-semibold">{alert.location}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{alert.timestamp}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{alert.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                    </div>

                    {/* AI ASSISTANT EXPLAINED RECOMMENDATION */}
                    <div className="p-3.5 bg-purple-50/70 border border-purple-100/50 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-purple-900 uppercase tracking-wide">
                        <span>🤖 CampusAI Guard Advice</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{alert.aiAdvice}"
                      </p>
                    </div>

                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                    title="Acknowledge alert"
                  >
                    <EyeOff size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Right 1 Column: Emergency Broadcast Stats */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-50">Audited Security Indexes</h3>
            
            <div className="space-y-3">
              {[
                { label: "Active Patrol Vehicles", val: "12 units on patrol" },
                { label: "Critical Escalations", val: "0 Active" },
                { label: "Average Response Time", val: "4.8 minutes" }
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-500">{stat.label}</span>
                  <span className="text-slate-800 font-bold">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety tip bulletin */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-950 p-5 rounded-xl border border-slate-800 text-white space-y-2">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wide">AI Threat Detection Rules</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Our safety models scan community posts, geofenced grid records, and direct scam submissions to flags anomalies. Always verify lease listings electronically before sharing credentials.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
