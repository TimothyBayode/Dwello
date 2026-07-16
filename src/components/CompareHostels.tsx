import React, { useState } from "react";
import { Hostel } from "../types";
import { GitCompare, Sparkles, Check, X, ShieldAlert, Zap, TrendingUp, HelpCircle } from "lucide-react";

interface CompareHostelsProps {
  hostels: Hostel[];
  onNavigateToTab: (tabId: string) => void;
}

export default function CompareHostels({ hostels, onNavigateToTab }: CompareHostelsProps) {
  const [hostelAId, setHostelAId] = useState<string>("h1");
  const [hostelBId, setHostelBId] = useState<string>("h2");

  const hostelA = hostels.find(h => h.id === hostelAId) || hostels[0];
  const hostelB = hostels.find(h => h.id === hostelBId) || hostels[1];

  // Smart comparison synthesis
  const comparisonReport = React.useMemo(() => {
    if (hostelA.id === hostelB.id) {
      return "Select two different hostels to generate a comparative analysis.";
    }

    let winner = hostelA.name;
    let reason = "";

    if (hostelA.aiMatchScore > hostelB.aiMatchScore) {
      winner = hostelA.name;
      reason = `Timothy, our model strongly favors **${hostelA.name}** for your Computer Science requirements. Its **${hostelA.electricityReliability} electricity profile** provides far more stable coding runtimes compared to ${hostelB.name}'s ${hostelB.electricityReliability} profile. Furthermore, its shorter distance (${hostelA.distanceToCampus}) eliminates transportation bottlenecks.`;
    } else {
      winner = hostelB.name;
      reason = `Our algorithm recommends **${hostelB.name}** over ${hostelA.name}. The budget saving of **₦${(hostelA.price - hostelB.price).toLocaleString()}** provides massive financial relief, while maintaining solid utilities (like ${hostelB.electricityReliability} light and ${hostelB.wifiAvailable ? "High-Speed WiFi" : "irregular internet"}).`;
    }

    return {
      winner,
      reason,
      priceDiff: Math.abs(hostelA.price - hostelB.price),
      safetyDiff: Math.abs(hostelA.safetyScore - hostelB.safetyScore)
    };
  }, [hostelA, hostelB]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <GitCompare className="text-purple-600" size={24} />
          <span>Compare Hostels Matrix</span>
        </h1>
        <p className="text-sm text-slate-500">
          Compare key technical specs, student review trends, and dynamic AI compatibility scores side-by-side.
        </p>
      </div>

      {/* Comparison Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Select Hostel A</label>
          <select
            value={hostelAId}
            onChange={(e) => setHostelAId(e.target.value)}
            className="w-full p-2.5 bg-white text-xs font-semibold rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 shadow-xs"
          >
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name} (₦{h.price.toLocaleString()})</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Select Hostel B</label>
          <select
            value={hostelBId}
            onChange={(e) => setHostelBId(e.target.value)}
            className="w-full p-2.5 bg-white text-xs font-semibold rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 shadow-xs"
          >
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name} (₦{h.price.toLocaleString()})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50">
              <th className="p-4 font-bold text-slate-400 uppercase tracking-wider w-1/3">Criteria</th>
              <th className="p-4 font-bold text-purple-900 w-1/3 text-center bg-purple-50/20">{hostelA.name}</th>
              <th className="p-4 font-bold text-purple-900 w-1/3 text-center bg-blue-50/20">{hostelB.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            
            {/* AI Compatibility */}
            <tr>
              <td className="p-4 font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles size={13} className="text-purple-600" />
                AI Match Index
              </td>
              <td className="p-4 text-center font-extrabold text-purple-700 bg-purple-50/10">
                {hostelA.aiMatchScore}% Match
              </td>
              <td className="p-4 text-center font-extrabold text-blue-700 bg-blue-50/10">
                {hostelB.aiMatchScore}% Match
              </td>
            </tr>

            {/* Price */}
            <tr>
              <td className="p-4 font-bold text-slate-600">Annual Rent</td>
              <td className="p-4 text-center font-bold text-slate-900">
                ₦{hostelA.price.toLocaleString()}
              </td>
              <td className="p-4 text-center font-bold text-slate-900">
                ₦{hostelB.price.toLocaleString()}
              </td>
            </tr>

            {/* Commute Distance */}
            <tr>
              <td className="p-4 font-bold text-slate-600">Commute to Campus</td>
              <td className="p-4 text-center text-slate-700 font-medium">{hostelA.distanceToCampus}</td>
              <td className="p-4 text-center text-slate-700 font-medium">{hostelB.distanceToCampus}</td>
            </tr>

            {/* Electricity */}
            <tr>
              <td className="p-4 font-bold text-slate-600 flex items-center gap-1.5">
                <Zap size={13} className="text-amber-500" />
                Electricity Quality
              </td>
              <td className="p-4 text-center font-bold">
                <span className={`px-2 py-0.5 rounded text-[10px] ${hostelA.electricityReliability === "Excellent" ? "bg-amber-100 text-amber-800" : hostelA.electricityReliability === "Good" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                  {hostelA.electricityReliability}
                </span>
              </td>
              <td className="p-4 text-center font-bold">
                <span className={`px-2 py-0.5 rounded text-[10px] ${hostelB.electricityReliability === "Excellent" ? "bg-amber-100 text-amber-800" : hostelB.electricityReliability === "Good" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                  {hostelB.electricityReliability}
                </span>
              </td>
            </tr>

            {/* Water */}
            <tr>
              <td className="p-4 font-bold text-slate-600">Water Availability</td>
              <td className="p-4 text-center text-slate-700 font-medium">{hostelA.waterSupply}</td>
              <td className="p-4 text-center text-slate-700 font-medium">{hostelB.waterSupply}</td>
            </tr>

            {/* High speed Wifi */}
            <tr>
              <td className="p-4 font-bold text-slate-600">High-Speed WiFi</td>
              <td className="p-4 text-center">
                {hostelA.wifiAvailable ? (
                  <span className="inline-block p-1 bg-emerald-50 text-emerald-600 rounded-full font-bold">✓ Yes</span>
                ) : (
                  <span className="inline-block p-1 bg-red-50 text-red-500 rounded-full font-bold">✗ No</span>
                )}
              </td>
              <td className="p-4 text-center">
                {hostelB.wifiAvailable ? (
                  <span className="inline-block p-1 bg-emerald-50 text-emerald-600 rounded-full font-bold">✓ Yes</span>
                ) : (
                  <span className="inline-block p-1 bg-red-50 text-red-500 rounded-full font-bold">✗ No</span>
                )}
              </td>
            </tr>

            {/* Safety Rating */}
            <tr>
              <td className="p-4 font-bold text-slate-600">Safety Index</td>
              <td className="p-4 text-center font-bold text-emerald-600">{hostelA.safetyScore} / 100</td>
              <td className="p-4 text-center font-bold text-emerald-600">{hostelB.safetyScore} / 100</td>
            </tr>

            {/* Scam Risk */}
            <tr>
              <td className="p-4 font-bold text-slate-600">Scam Risk Factor</td>
              <td className="p-4 text-center font-bold text-slate-600">{hostelA.scamRiskScore}% Risk</td>
              <td className="p-4 text-center font-bold text-slate-600">{hostelB.scamRiskScore}% Risk</td>
            </tr>

            {/* Reviews Count */}
            <tr>
              <td className="p-4 font-bold text-slate-600">Audit Reviews Count</td>
              <td className="p-4 text-center text-slate-600">{hostelA.reviewsCount} audits</td>
              <td className="p-4 text-center text-slate-600">{hostelB.reviewsCount} audits</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* AI Comparative Report Card */}
      {typeof comparisonReport !== "string" && (
        <div className="bg-gradient-to-tr from-slate-900 to-purple-950 text-white rounded-xl p-5 border border-purple-900 shadow-md space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <GitCompare size={120} />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider relative z-10">
            <Sparkles size={14} className="text-purple-400 animate-spin-slow" />
            <span>AI Synthesis Report</span>
          </div>
          <div className="space-y-1.5 relative z-10">
            <h3 className="text-sm font-bold text-white">
              Why our AI model flags <span className="text-purple-300 font-extrabold">{comparisonReport.winner}</span> as highly optimal
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {comparisonReport.reason}
            </p>
          </div>
          <div className="pt-3 border-t border-purple-900 flex flex-wrap gap-4 text-[10px] text-slate-300 relative z-10">
            <span>Price divergence: <strong>₦{comparisonReport.priceDiff.toLocaleString()}</strong> difference</span>
            <span>Safety divergence: <strong>{comparisonReport.safetyDiff} points</strong> difference</span>
          </div>
        </div>
      )}

    </div>
  );
}
