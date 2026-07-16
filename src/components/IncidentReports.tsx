import React, { useState } from "react";
import { IncidentReport } from "../types";
import { AlertTriangle, Plus, ShieldCheck, Heart, Flag, MessageSquare, ThumbsUp, HelpCircle, Check, Sparkles } from "lucide-react";

interface IncidentReportsProps {
  incidents: IncidentReport[];
  onSubmitIncident: (report: Omit<IncidentReport, "id" | "timestamp" | "status" | "upvotes">) => void;
}

export default function IncidentReports({ incidents, onSubmitIncident }: IncidentReportsProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("Scam Attempt");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState("Timothy Bayode");
  const [successMsg, setSuccessMsg] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");

  const [upvoteStates, setUpvoteStates] = useState<Record<string, { count: number; voted: boolean }>>({});

  const handleUpvote = (id: string, initialCount: number) => {
    setUpvoteStates(prev => {
      const current = prev[id] || { count: initialCount, voted: false };
      if (current.voted) {
        return {
          ...prev,
          [id]: { count: current.count - 1, voted: false }
        };
      } else {
        return {
          ...prev,
          [id]: { count: current.count + 1, voted: true }
        };
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) return;

    onSubmitIncident({
      category,
      title,
      description,
      location,
      isAnonymous,
      reporterName: isAnonymous ? undefined : reporterName
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setShowForm(false);
      setTitle("");
      setDescription("");
      setLocation("");
    }, 1500);
  };

  const filteredIncidents = incidents.filter(inc => {
    if (activeCategoryFilter === "All") return true;
    return inc.category === activeCategoryFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <AlertTriangle className="text-purple-600" size={24} />
            <span>Campus Incident & Scam Ledger</span>
          </h1>
          <p className="text-sm text-slate-500">
            Report local rental scams, streetlamp outages, or community disturbances. Keep fellow students safe.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus size={16} />
          <span>{showForm ? "Close Report Form" : "File Incident Report"}</span>
        </button>
      </div>

      {/* Dynamic Submit Form */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white border border-purple-100 rounded-2xl p-4 md:p-6 shadow-sm space-y-4 animate-scaleIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 uppercase tracking-wider">
            <Sparkles size={14} className="text-purple-600 animate-spin-slow" />
            <span>Secure Logging Node</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-slate-50 text-xs rounded-lg border focus:outline-none"
              >
                <option value="Scam Attempt">Scam Attempt</option>
                <option value="Safety Hazard">Safety Hazard</option>
                <option value="Disturbance">Disturbance / Noise</option>
                <option value="Theft">Theft / Loss</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Location Sector</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. West Gate dark corner, or Online / Facebook Group"
                className="w-full p-2 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Incident Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fake deposit fee lister posing as Apex quarters manager"
              className="w-full p-2 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 font-bold text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Description of Incident</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details. Include phone numbers or URLs if reporting listing scams..."
              className="w-full p-2 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-700"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="w-4 h-4 rounded-sm text-purple-600 border-slate-200"
                />
                <span className="text-xs font-semibold text-slate-600">File Anonymously</span>
              </label>
              {!isAnonymous && (
                <span className="text-[10px] text-slate-400 font-bold">Logging as: {reporterName}</span>
              )}
            </div>

            {successMsg ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                <Check size={14} />
                <span>Submitted Successfully!</span>
              </div>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Publish Advisory
              </button>
            )}
          </div>
        </form>
      )}

      {/* Categories Filter list */}
      <div className="flex flex-wrap gap-2">
        {["All", "Scam Attempt", "Safety Hazard", "Disturbance", "Theft"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border
              ${activeCategoryFilter === cat 
                ? "bg-purple-50 border-purple-200 text-purple-700" 
                : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
              }
            `}
          >
            {cat === "All" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {/* Incident listings table/cards */}
      <div className="space-y-4">
        {filteredIncidents.map((inc) => {
          const voteState = upvoteStates[inc.id] || { count: inc.upvotes, voted: false };
          return (
            <div key={inc.id} className="bg-white border border-slate-100 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-5 shadow-xs">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide
                    ${inc.category === "Scam Attempt" 
                      ? "bg-red-50 text-red-700 border border-red-100" 
                      : inc.category === "Safety Hazard"
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-blue-50 text-blue-700 border border-blue-100"
                    }
                  `}>
                    {inc.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{inc.timestamp}</span>
                  <span className="text-[10px] text-slate-400 font-bold">•</span>
                  <span className="text-[10px] text-slate-400 font-bold">{inc.location}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{inc.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Reported by:</span>
                  <span className="text-[10px] text-slate-600 font-bold">
                    {inc.isAnonymous ? "Anonymous Student" : inc.reporterName || "Timothy Bayode"}
                  </span>
                </div>
              </div>

              {/* Status and Community Consensus vote */}
              <div className="flex md:flex-col justify-between items-end md:w-36 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50 md:pl-4 md:border-l md:border-slate-50">
                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Audit Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                    ${inc.status === "Resolved" 
                      ? "bg-emerald-50 text-emerald-700" 
                      : inc.status === "Investigating"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-50 text-slate-600"
                    }
                  `}>
                    {inc.status}
                  </span>
                </div>

                <button
                  onClick={() => handleUpvote(inc.id, inc.upvotes)}
                  className={`mt-3 py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors
                    ${voteState.voted 
                      ? "bg-purple-600 border-purple-600 text-white" 
                      : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }
                  `}
                >
                  <ThumbsUp size={12} className={voteState.voted ? "fill-white" : ""} />
                  <span>{voteState.count} Upvotes</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
