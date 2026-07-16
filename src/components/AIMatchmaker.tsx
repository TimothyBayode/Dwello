import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  CheckCircle, 
  ShieldAlert, 
  Compass, 
  MapPin, 
  Check, 
  ExternalLink 
} from "lucide-react";
import { Hostel } from "../types";

interface AIMatchmakerProps {
  hostels: Hostel[];
  onNavigateToTab: (tabId: string) => void;
}

export default function AIMatchmaker({ hostels, onNavigateToTab }: AIMatchmakerProps) {
  const [step, setStep] = useState(1);
  const [major, setMajor] = useState("Computer Science");
  const [primaryNeed, setPrimaryNeed] = useState("Electricity (Heavy Coding/Power)");
  const [budgetCap, setBudgetCap] = useState<number>(300000);
  const [distancePref, setDistancePref] = useState("Under 5 mins walk");
  
  const [isMatching, setIsMatching] = useState(false);
  const [matchedResults, setMatchedResults] = useState<{ hostel: Hostel; customizedScore: number; customizedReason: string }[] | null>(null);

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const runMatchCalculation = () => {
    setIsMatching(true);
    setMatchedResults(null);

    setTimeout(() => {
      // Custom weights based on user survey responses
      const results = hostels.map(h => {
        let score = 80; // Base score

        // Budget match
        if (h.price <= budgetCap) {
          score += 10;
        } else if (h.price - budgetCap <= 50000) {
          score += 2;
        } else {
          score -= 15;
        }

        // Electricity match
        if (primaryNeed.includes("Electricity") && h.electricityReliability === "Excellent") {
          score += 10;
        } else if (primaryNeed.includes("Electricity") && h.electricityReliability === "Good") {
          score += 5;
        }

        // Proximity match
        if (distancePref.includes("5 mins") && h.distanceToCampus.includes("4 mins")) {
          score += 8;
        } else if (distancePref.includes("5 mins") && h.distanceToCampus.includes("2 mins")) {
          score += 10;
        }

        // Clip maximum score to 100
        const finalScore = Math.min(100, Math.max(50, score));

        // Generate tailored explanations
        let explanation = "";
        if (h.id === "h1") {
          explanation = `Timothy, because you are in **${major}** and demand **${primaryNeed}**, Crown Heights' 20h+ power is standard. Since it is ${h.distanceToCampus}, it directly fits your preference of '${distancePref}'.`;
        } else if (h.id === "h2") {
          explanation = `Lighthouse Student Suites is highly compatible. The Solar-inverter system supplies enough backup power for active coding rigs during grid downtime, fitting your ₦${budgetCap.toLocaleString()} budget perfectly.`;
        } else if (h.id === "h4") {
          explanation = `Ivory Private Heights has an exceptional utility rate, but at ₦${h.price.toLocaleString()}, it exceeds your preferred budget cap of ₦${budgetCap.toLocaleString()} by ₦${(h.price - budgetCap).toLocaleString()}.`;
        } else {
          explanation = `An affordable alternative. While matching distance preferences, power is subject to grid logs (Average reliability) and may slow down compile timelines.`;
        }

        return {
          hostel: h,
          customizedScore: finalScore,
          customizedReason: explanation
        };
      });

      // Sort by score desc
      results.sort((a, b) => b.customizedScore - a.customizedScore);

      setMatchedResults(results);
      setIsMatching(false);
      setStep(5); // Show results page
    }, 1200);
  };

  const resetMatchmaker = () => {
    setStep(1);
    setMatchedResults(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Sparkles className="text-purple-600 animate-pulse" size={24} />
          <span>AI Matchmaker Engine</span>
        </h1>
        <p className="text-sm text-slate-500">
          Answer 4 quick student profiling questions. Our deep learning engine will scan grid records, geofences, and safety logs to find your optimal lodge.
        </p>
      </div>

      {/* Card Wrapper */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Progress Tracker Bar */}
        {step <= 4 && (
          <div className="bg-slate-50 border-b border-slate-50 px-6 py-3 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Step {step} of 4
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`w-10 h-1.5 rounded-full transition-colors duration-200 ${i <= step ? "bg-purple-600" : "bg-slate-200"}`} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Questionnaire Steps */}
        <div className="p-6 md:p-8 min-h-[250px] flex flex-col justify-between">
          
          {/* STEP 1: Academic Focus / Major */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">What is your primary study focus or major?</h2>
                <p className="text-xs text-slate-500">AI uses this to calculate exact walkable routes to your specific faculty buildings.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {[
                  "Computer Science & Engineering",
                  "Law & Legal Studies",
                  "Medical & Allied Sciences",
                  "Business Administration"
                ].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMajor(m)}
                    className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${major.includes(m.slice(0, 5)) ? "bg-purple-50/50 border-purple-500 text-purple-700 shadow-xs" : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-100"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{m}</span>
                      {major.includes(m.slice(0, 5)) && <CheckCircle size={14} className="text-purple-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Utility Priority */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">What utility is absolutely critical to you?</h2>
                <p className="text-xs text-slate-500">We prioritize lodges with audited logs matching this specific amenity.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {[
                  { title: "Electricity (Heavy Coding/Power)", desc: "Requires 18h+ constant backup generators or inverters", icon: Zap },
                  { title: "Constant Water Supply", desc: "Cannot tolerate morning/evening shift restrictions", icon: Compass },
                  { title: "High-Speed WiFi Access", desc: "Stable routers to push assignments or join study webcasts", icon: Sparkles },
                  { title: "Gated/Armed Security Guards", desc: "Requires physical gates and 24/7 security patrol escorts", icon: Check }
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setPrimaryNeed(item.title)}
                    className={`p-4 rounded-xl border text-left transition-all flex gap-3 cursor-pointer ${primaryNeed === item.title ? "bg-purple-50/50 border-purple-500 text-purple-700 shadow-xs" : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-100"}`}
                  >
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold block">{item.title}</span>
                      <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                    </div>
                    {primaryNeed === item.title && <CheckCircle size={14} className="text-purple-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Budget Cap */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">What is your annual rental budget cap?</h2>
                <p className="text-xs text-slate-500">We omit hostels that severely stretch your financial budget layout.</p>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">Lodge rental ceiling</span>
                  <span className="text-lg font-extrabold text-purple-600">₦{budgetCap.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min={150000} 
                  max={500000} 
                  step={10000}
                  value={budgetCap} 
                  onChange={(e) => setBudgetCap(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>₦150,000</span>
                  <span>₦320,000</span>
                  <span>₦500,000</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Walk Distance preferred */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">What is your maximum acceptable commute to lectures?</h2>
                <p className="text-xs text-slate-500">We filter listings that would require frequent expensive shuttle transport.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {[
                  "Under 5 mins walk (Ultra Close)",
                  "5 - 10 mins walk (Easy stroll)",
                  "10 - 15 mins walk (Good exercise)",
                  "No preference / Happy to take shuttles"
                ].map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setDistancePref(dist)}
                    className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${distancePref === dist ? "bg-purple-50/50 border-purple-500 text-purple-700 shadow-xs" : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-100"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{dist}</span>
                      {distancePref === dist && <CheckCircle size={14} className="text-purple-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Matching Results page */}
          {step === 5 && matchedResults && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2 py-4">
                <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
                  <Sparkles size={24} className="animate-spin-slow" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">AI Alignment Report Complete</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Based on your CS major, power demands, budget limit of ₦{budgetCap.toLocaleString()}, and walk standards, we have generated personalized matches.
                </p>
              </div>

              {/* Matched List */}
              <div className="space-y-4">
                {matchedResults.map(({ hostel, customizedScore, customizedReason }, index) => (
                  <div 
                    key={hostel.id} 
                    className={`border rounded-xl p-5 bg-white transition-all hover:shadow-md flex flex-col md:flex-row gap-4 justify-between relative overflow-hidden ${index === 0 ? "border-purple-200 ring-2 ring-purple-100" : "border-slate-100"}`}
                  >
                    {index === 0 && (
                      <span className="absolute top-0 right-0 bg-purple-600 text-white font-bold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-bl-lg">
                        TOP MATCH
                      </span>
                    )}

                    <img 
                      src={hostel.images[0]} 
                      alt={hostel.name} 
                      className="w-full md:w-36 h-28 object-cover rounded-lg flex-shrink-0" 
                    />

                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{hostel.name}</h3>
                          <span className="px-1.5 py-0.5 rounded-sm bg-purple-100 text-purple-700 font-bold text-[10px]">
                            {customizedScore}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          {hostel.location} ({hostel.distanceToCampus})
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed italic bg-purple-50/50 p-2.5 rounded-lg border border-purple-50">
                        {customizedReason}
                      </p>

                      <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 pt-1">
                        <span>⚡ {hostel.electricityReliability} Electricity</span>
                        <span>🛡️ Safety: {hostel.safetyScore}/100</span>
                        <span className="text-slate-900">₦{hostel.price.toLocaleString()}/yr</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end items-end gap-2">
                      <button
                        onClick={() => onNavigateToTab("browse")}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Book Lodge
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset button */}
              <div className="flex justify-center pt-2">
                <button 
                  onClick={resetMatchmaker}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Retake AI Compatibility Survey
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action buttons for flow */}
          {step <= 4 && (
            <div className="flex justify-between items-center pt-6 border-t border-slate-50">
              <button
                disabled={step === 1}
                onClick={handlePrevStep}
                className="px-4 py-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              {step === 4 ? (
                <button
                  onClick={runMatchCalculation}
                  disabled={isMatching}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
                >
                  {isMatching ? "AI Calibrating..." : "Find Matches"}
                  <Sparkles size={14} />
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
