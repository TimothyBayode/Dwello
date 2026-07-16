import React, { useState } from "react";
import { Hostel } from "../types";
import { BarChart3, Sparkles, TrendingUp, ThumbsUp, ThumbsDown, Star, RefreshCw } from "lucide-react";

interface ReviewInsightsProps {
  hostels: Hostel[];
}

export default function ReviewInsights({ hostels }: ReviewInsightsProps) {
  const [selectedHostelId, setSelectedHostelId] = useState("h1");
  const selectedHostel = hostels.find(h => h.id === selectedHostelId) || hostels[0];

  // Specific reviews metrics for mock listings
  const reviewStats: Record<string, {
    sentimentPositive: number;
    sentimentNeutral: number;
    sentimentNegative: number;
    pros: string[];
    cons: string[];
    waterRating: number; // out of 100
    powerRating: number;
    securityRating: number;
    noiseRating: number;
    aiSummary: string;
  }> = {
    h1: {
      sentimentPositive: 92,
      sentimentNeutral: 5,
      sentimentNegative: 3,
      pros: ["Constant electricity supply (20h+ generator & grid logs)", "High-speed fiber optic WiFi is highly stable", "Spacious study desk setups inside rooms", "Quick access gate walking path"],
      cons: ["Relatively expensive annual rent", "Shared kitchen is sometimes crowded", "High deposit requirement"],
      waterRating: 95,
      powerRating: 98,
      securityRating: 94,
      noiseRating: 88,
      aiSummary: "Students overwhelmingly praise Crown Heights Lodge for its constant power utilities, which supports seamless programming and lecture research workflows. Noise levels are strictly monitored by management, ensuring quiet nighttime studying, though budget limits remain the single barrier."
    },
    h2: {
      sentimentPositive: 84,
      sentimentNeutral: 11,
      sentimentNegative: 5,
      pros: ["Exceptional solar inverter backups for lighter power loads", "Affordable pricing compared to other tech-vicinity quarters", "Excellent borehole water pumping flow", "Secure fenced gates"],
      cons: ["Heavy AC or hotplate appliances are restricted on solar rigs", "Water is shut off between 1:00 PM and 4:00 PM", "No backup common rooms"],
      waterRating: 80,
      powerRating: 85,
      securityRating: 88,
      noiseRating: 75,
      aiSummary: "A highly favored option for moderate budgets. Students appreciate the eco-friendly solar integration that charges laptops and phones 24/7. Rerouted shuttle routes during storms are minor complaints, but overall satisfaction indexes are high."
    },
    h3: {
      sentimentPositive: 65,
      sentimentNeutral: 20,
      sentimentNegative: 15,
      pros: ["Massively budget-friendly annual rent (₦180,000)", "Highly spacious rooms with individual self-contain plumbing", "Gated compound yard"],
      cons: ["Subject to municipal power schedules (no solar/generator back-ups)", "12 mins shuttle drive required to lecture blocks", "Frequent local cellular network data drops"],
      waterRating: 70,
      powerRating: 48,
      securityRating: 72,
      noiseRating: 60,
      aiSummary: "Best described as an affordable, basic option. The primary complaints center around grid power limits and shuttle wait times. Recommended only if you have active personal data hotpots and are comfortable commuting."
    },
    h4: {
      sentimentPositive: 96,
      sentimentNeutral: 3,
      sentimentNegative: 1,
      pros: ["Exceptional electronic card lock security layers", "Fully serviced unit layout with dedicated in-unit cooling", "Luxury swimming pool and fitness gym access"],
      cons: ["Highest rent price in the sector", "Requires strict curfew check-ins by 10:00 PM", "AC charges are metered separately"],
      waterRating: 98,
      powerRating: 99,
      securityRating: 98,
      noiseRating: 92,
      aiSummary: "The luxury benchmark. Review logs reflect immaculate security and zero utility drops. Curfew regulations are polarizing, but safety indexes remain unmatched."
    },
    h5: {
      sentimentPositive: 72,
      sentimentNeutral: 18,
      sentimentNegative: 10,
      pros: ["Literal 2-min walk distance to central school labs", "Directly supervised by university student housing coordinators", "No transport or shuttle costs required"],
      cons: ["Irregular school-managed generator cycles", "Strict room-sharing guidelines with randomized assignments", "Low water pressure during dry seasons"],
      waterRating: 65,
      powerRating: 55,
      securityRating: 90,
      noiseRating: 82,
      aiSummary: "Extremely practical location directly bordering academic gates. Ideal if you spend long nights inside physical campus labs, but lacks autonomous luxury control (grid power is unstable)."
    }
  };

  const currentStats = reviewStats[selectedHostel.id] || reviewStats["h1"];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-purple-600" size={24} />
            <span>AI Review Insights Engine</span>
          </h1>
          <p className="text-sm text-slate-500">
            Every week our NLP model parses hundreds of student reviews, grid logs, and water reports to extract unvarnished hostel summaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Analyze Lodge:</span>
          <select
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(e.target.value)}
            className="p-2 bg-white text-xs font-semibold rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 shadow-xs"
          >
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sentiment Overview & Satisfaction charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Visual Metrics & AI Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Sentiment Analysis Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Sparkles size={14} className="text-purple-600 animate-spin-slow" />
                <span>Student Sentiment Quotient</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Based on {selectedHostel.reviewsCount} reviews</span>
            </div>

            {/* Custom Horizontal Stacked Bar representing positive/neutral/negative */}
            <div className="space-y-2">
              <div className="h-6 w-full rounded-lg flex overflow-hidden shadow-2xs border border-slate-100">
                <div 
                  style={{ width: `${currentStats.sentimentPositive}%` }} 
                  className="bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center"
                  title="Positive"
                >
                  {currentStats.sentimentPositive}% Pos
                </div>
                <div 
                  style={{ width: `${currentStats.sentimentNeutral}%` }} 
                  className="bg-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center"
                  title="Neutral"
                >
                  {currentStats.sentimentNeutral}%
                </div>
                <div 
                  style={{ width: `${currentStats.sentimentNegative}%` }} 
                  className="bg-red-400 text-white font-bold text-[10px] flex items-center justify-center"
                  title="Negative"
                >
                  {currentStats.sentimentNegative}%
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1">
                <span className="text-emerald-600">👍 Positive Sentiment ({currentStats.sentimentPositive}%)</span>
                <span className="text-slate-400">😐 Neutral ({currentStats.sentimentNeutral}%)</span>
                <span className="text-red-500">👎 Critical ({currentStats.sentimentNegative}%)</span>
              </div>
            </div>

            {/* AI Synthesized Summary */}
            <div className="bg-purple-50/50 border border-purple-100/30 p-4 rounded-xl space-y-2 text-slate-700">
              <span className="text-xs font-bold text-purple-950 block">🤖 NLP Synthesis Report</span>
              <p className="text-xs leading-relaxed italic">
                "{currentStats.aiSummary}"
              </p>
            </div>
          </div>

          {/* Pros & Cons side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pros */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider pb-2 border-b border-slate-50">
                <ThumbsUp size={14} />
                <span>Praise Points (Pros)</span>
              </div>
              <div className="space-y-2">
                {currentStats.pros.map((p, i) => (
                  <div key={i} className="flex gap-2 text-xs text-slate-700 font-medium leading-relaxed">
                    <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                    <p>{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-wider pb-2 border-b border-slate-50">
                <ThumbsDown size={14} />
                <span>Gripe Points (Cons)</span>
              </div>
              <div className="space-y-2">
                {currentStats.cons.map((c, i) => (
                  <div key={i} className="flex gap-2 text-xs text-slate-700 font-medium leading-relaxed">
                    <span className="text-red-400 font-bold flex-shrink-0">✗</span>
                    <p>{c}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right 1 Column: Satisfaction Gauges (Custom SVG progress gauges) */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Utility Reliability Indices</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Physical audited metrics tracking utility performance.</p>
          </div>

          {/* Gauges list */}
          <div className="space-y-4">
            {[
              { label: "Electricity Grid Index", score: currentStats.powerRating, sub: " generator + grid logs uptime", color: "bg-amber-500" },
              { label: "Water Pressure & Vol", score: currentStats.waterRating, sub: " boreholes constant pressure", color: "bg-teal-500" },
              { label: "Compound Security Index", score: currentStats.securityRating, sub: " active guard gate checks", color: "bg-purple-600" },
              { label: "Quietness / Study Suitability", score: currentStats.noiseRating, sub: " local neighborhood volume", color: "bg-blue-500" }
            ].map((g, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-600">{g.label}</span>
                  <span className="font-extrabold text-slate-900">{g.score}%</span>
                </div>
                
                {/* Horizontal progress meter */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${g.score}%` }} 
                    className={`h-full rounded-full transition-all duration-500 ${g.color}`} 
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-medium">Audited {g.score}%{g.sub}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
