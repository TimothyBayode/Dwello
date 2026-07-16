import React, { useState } from "react";
import { Map, ShieldAlert, Zap, Users, AlertTriangle, HelpCircle, Eye, Info } from "lucide-react";

interface SafetyMapProps {
  onNavigateToTab: (tabId: string) => void;
}

export default function SafetyMap({ onNavigateToTab }: SafetyMapProps) {
  const [selectedZone, setSelectedZone] = useState<string>("West Gate Sector");
  const [showHeatmap, setShowHeatmap] = useState(false);

  const zonesData: Record<string, {
    score: number;
    status: "Very Safe" | "Safe" | "Caution" | "Hazardous";
    lighting: "100% Operational" | "85% Functional" | "40% Damaged (Dark Corner)" | "100% Solar Gated";
    patrols: "Active (Every 30m)" | "Active (Hourly)" | "Stationary Gate Only" | "On-Demand Escort Only";
    incidentsCount: number;
    tip: string;
  }> = {
    "West Gate Sector": {
      score: 94,
      status: "Very Safe",
      lighting: "100% Solar Gated",
      patrols: "Active (Every 30m)",
      incidentsCount: 1,
      tip: "The walk path from Crown Heights to West Gate is fully lighted and monitored by armed campus guards. Safe at all hours."
    },
    "North Gate Tech Sector": {
      score: 88,
      status: "Safe",
      lighting: "85% Functional",
      patrols: "Active (Hourly)",
      incidentsCount: 3,
      tip: "Minor crowd congestions occur near the shuttle stop. Beware of suspicious booking brokers on the pavement."
    },
    "South Gate Residential Area": {
      score: 74,
      status: "Caution",
      lighting: "40% Damaged (Dark Corner)",
      patrols: "On-Demand Escort Only",
      incidentsCount: 8,
      tip: "Lacks sufficient streetlamps. Avoid walking back alone after 8 PM. Trigger 'Safe-Walk' night escort services if needed."
    },
    "Central Library & Admin Zone": {
      score: 98,
      status: "Very Safe",
      lighting: "100% Operational",
      patrols: "Active (Every 30m)",
      incidentsCount: 0,
      tip: "The campus core is heavily illuminated with 24/7 solar backups and high-frequency foot patrols."
    }
  };

  const currentZone = zonesData[selectedZone] || zonesData["West Gate Sector"];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Map className="text-purple-600" size={24} />
            <span>Campus Safety Map Visualizer</span>
          </h1>
          <p className="text-sm text-slate-500">
            Real-time visual security dashboard tracking illumination levels, shuttle waiting corridors, and reported incident markers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Heatmap Layer:</span>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${showHeatmap ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"}`}
          >
            {showHeatmap ? "Disable Risk Heatmap" : "Enable Risk Heatmap"}
          </button>
        </div>
      </div>

      {/* Main Map Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Interactive Vector Map (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Campus Map Grid</span>
            <span className="text-[10px] text-slate-400 font-medium">Click on nodes to query sector security index</span>
          </div>

          {/* Interactive SVG Map Visualizer */}
          <div className="relative h-[280px] md:h-[420px] bg-slate-900 overflow-hidden p-4 md:p-6 flex flex-col justify-between">
            {/* Dark grid background for premium dashboard aesthetic */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />

            {/* Simulated Radar Ring sweep */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-purple-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-purple-500/10 pointer-events-none" />

            {/* Heatmap blur circles if enabled */}
            {showHeatmap && (
              <>
                <div className="absolute top-[65%] left-[25%] w-40 h-40 rounded-full bg-red-600/30 blur-2xl animate-pulse pointer-events-none" />
                <div className="absolute top-[25%] left-[65%] w-24 h-24 rounded-full bg-yellow-500/20 blur-xl pointer-events-none" />
              </>
            )}

            {/* Zones Layout inside map container */}
            <div className="relative z-10 w-full h-full">
              
              {/* Central Library Zone */}
              <button 
                onClick={() => setSelectedZone("Central Library & Admin Zone")}
                className={`absolute top-[40%] left-[45%] p-2 md:p-4 rounded-full border backdrop-blur-md transition-all flex flex-col items-center gap-1 md:gap-1.5
                  ${selectedZone === "Central Library & Admin Zone" 
                    ? "bg-purple-600 border-white text-white shadow-lg scale-110" 
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }
                `}
              >
                <Users size={14} />
                <span className="text-[8px] md:text-[9px] font-bold">Library Hub</span>
                <span className="text-[7px] md:text-[8px] font-bold px-1 md:px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">98%</span>
              </button>

              {/* West Gate Sector */}
              <button 
                onClick={() => setSelectedZone("West Gate Sector")}
                className={`absolute top-[60%] left-[15%] p-2 md:p-4 rounded-full border backdrop-blur-md transition-all flex flex-col items-center gap-1 md:gap-1.5
                  ${selectedZone === "West Gate Sector" 
                    ? "bg-purple-600 border-white text-white shadow-lg scale-110" 
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }
                `}
              >
                <Zap size={14} />
                <span className="text-[8px] md:text-[9px] font-bold">West Gate</span>
                <span className="text-[7px] md:text-[8px] font-bold px-1 md:px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">94%</span>
              </button>

              {/* North Gate Sector */}
              <button 
                onClick={() => setSelectedZone("North Gate Tech Sector")}
                className={`absolute top-[20%] left-[60%] p-2 md:p-4 rounded-full border backdrop-blur-md transition-all flex flex-col items-center gap-1 md:gap-1.5
                  ${selectedZone === "North Gate Tech Sector" 
                    ? "bg-purple-600 border-white text-white shadow-lg scale-110" 
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }
                `}
              >
                <ShieldAlert size={14} />
                <span className="text-[8px] md:text-[9px] font-bold">North Gate</span>
                <span className="text-[7px] md:text-[8px] font-bold px-1 md:px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">88%</span>
              </button>

              {/* South Gate Sector */}
              <button 
                onClick={() => setSelectedZone("South Gate Residential Area")}
                className={`absolute top-[70%] left-[65%] p-2 md:p-4 rounded-full border backdrop-blur-md transition-all flex flex-col items-center gap-1 md:gap-1.5
                  ${selectedZone === "South Gate Residential Area" 
                    ? "bg-purple-600 border-white text-white shadow-lg scale-110" 
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }
                  ${showHeatmap ? "ring-4 ring-red-500/50 animate-bounce" : ""}
                `}
              >
                <AlertTriangle size={14} className={showHeatmap ? "text-red-400" : "text-amber-400"} />
                <span className="text-[8px] md:text-[9px] font-bold">South Gate</span>
                <span className="text-[7px] md:text-[8px] font-bold px-1 md:px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300">74%</span>
              </button>

              {/* Path Linking indicators */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line x1="25%" y1="65%" x2="52%" y2="48%" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4" />
                <line x1="52%" y1="48%" x2="68%" y2="28%" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4" />
                <line x1="52%" y1="48%" x2="73%" y2="78%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
              </svg>

            </div>

            {/* HUD Status Bar overlay */}
            <div className="relative z-10 bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-white flex justify-between items-center text-xs">
              <span className="flex items-center gap-2">
                <Info size={14} className="text-purple-400 animate-pulse" />
                <span>Sector Active Patrol count: <strong>12 vehicles active</strong></span>
              </span>
              <span className="text-[10px] text-slate-300">Last updated: Just Now</span>
            </div>
          </div>
        </div>

        {/* Safety Metric Sidebar (1 col) */}
        <div className="space-y-6">
          
          {/* Selected Zone Report Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-50 pb-3">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">Selected Sector</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{selectedZone}</h3>
            </div>

            <div className="space-y-3.5">
              
              {/* Large Score indicator */}
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-50">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sector Safety index</span>
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">Status: {currentZone.status}</span>
                </div>
                <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-black text-lg
                  ${currentZone.score >= 90 
                    ? "border-emerald-500 text-emerald-600 bg-emerald-50" 
                    : currentZone.score >= 80 
                      ? "border-blue-500 text-blue-600 bg-blue-50" 
                      : "border-amber-400 text-amber-600 bg-amber-50"
                  }
                `}>
                  {currentZone.score}%
                </div>
              </div>

              {/* Grid factors */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Street Lamp Status</span>
                  <span className="font-semibold text-slate-800">{currentZone.lighting}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Night Escort Patrols</span>
                  <span className="font-semibold text-slate-800">{currentZone.patrols}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Active Risk Points</span>
                  <span className="font-semibold text-slate-800">{currentZone.incidentsCount} reports</span>
                </div>
              </div>

              {/* Safety advice */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-slate-700 space-y-1.5">
                <span className="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                  <Eye size={12} />
                  AI Guard Alert Advice
                </span>
                <p className="text-[11px] leading-relaxed">
                  {currentZone.tip}
                </p>
              </div>

              {/* Action Liaison buttons */}
              {currentZone.score < 80 && (
                <button 
                  onClick={() => onNavigateToTab("sos")}
                  className="w-full py-2 bg-red-600 hover:bg-red-500 animate-pulse text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle size={14} />
                  <span>Request Escort to South Gate</span>
                </button>
              )}

            </div>
          </div>

          {/* Quick tips card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-50">Safety Map Guidelines</h4>
            <div className="mt-3 space-y-2 text-[11px] text-slate-500 font-medium">
              <p>🟢 <strong>90% - 100% (Green)</strong>: Heavy solar backup, armed gates, frequent security tours.</p>
              <p>🟡 <strong>80% - 89% (Blue)</strong>: Basic compound lighting, typical shuttle stops, secure.</p>
              <p>🔴 <strong>Below 80% (Red/Amber)</strong>: High dark corners, pending streetlight fixes. Take extra caution walking late.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
