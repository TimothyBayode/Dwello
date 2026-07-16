import React, { useState } from "react";
import { RoommateProfile } from "../types";
import { Users, Filter, CheckCircle, MessageSquare, Heart, Sparkles, UserCheck } from "lucide-react";

interface RoommateMatchProps {
  roommates: RoommateProfile[];
}

export default function RoommateMatch({ roommates }: RoommateMatchProps) {
  const [selectedCleanliness, setSelectedCleanliness] = useState("All");
  const [selectedSchedule, setSelectedSchedule] = useState("All");
  const [invitationsSent, setInvitationsSent] = useState<string[]>([]);

  const handleConnect = (id: string) => {
    if (invitationsSent.includes(id)) {
      setInvitationsSent(prev => prev.filter(item => item !== id));
    } else {
      setInvitationsSent(prev => [...prev, id]);
    }
  };

  const filteredRoommates = roommates.filter(rm => {
    const matchesClean = selectedCleanliness === "All" || rm.cleanliness === selectedCleanliness;
    const matchesSched = selectedSchedule === "All" || rm.sleepSchedule === selectedSchedule;
    return matchesClean && matchesSched;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="text-purple-600" size={24} />
            <span>AI Roommate Matching Hub</span>
          </h1>
          <p className="text-sm text-slate-500">
            Compare sleeping cycles, study routines, and lifestyle preferences. Avoid roommate friction before signing leases.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 font-medium text-xs border border-purple-100">
          <Sparkles size={14} className="animate-pulse" />
          <span>Compatible Profiles Online</span>
        </div>
      </div>

      {/* Trait Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Cleanliness Standard</label>
          <div className="flex flex-wrap gap-2">
            {["All", "Very Clean", "Moderate", "Relaxed"].map((cl) => (
              <button
                key={cl}
                onClick={() => setSelectedCleanliness(cl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
                  ${selectedCleanliness === cl 
                    ? "bg-purple-600 border-purple-600 text-white" 
                    : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                  }
                `}
              >
                {cl === "All" ? "Any Standard" : cl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Sleeping Pattern</label>
          <div className="flex flex-wrap gap-2">
            {["All", "Early Bird", "Night Owl", "Flexible"].map((sl) => (
              <button
                key={sl}
                onClick={() => setSelectedSchedule(sl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
                  ${selectedSchedule === sl 
                    ? "bg-purple-600 border-purple-600 text-white" 
                    : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                  }
                `}
              >
                {sl === "All" ? "Any Cycle" : sl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roommate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoommates.map((rm) => {
          const sent = invitationsSent.includes(rm.id);
          return (
            <div 
              key={rm.id} 
              className="bg-white border border-slate-100 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Compatible header tag */}
              <div className="absolute top-0 right-0">
                <span className="bg-purple-50 text-purple-700 font-bold text-[10px] px-2.5 py-1 rounded-bl-lg block border-l border-b border-purple-100/50">
                  {rm.matchScore}% Match
                </span>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={rm.avatar} alt={rm.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-100" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{rm.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{rm.course} • {rm.level}</p>
                  </div>
                </div>

                {/* Grid criteria traits */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-50">
                  <span className="block">🧼 Cleanliness: <strong className="text-slate-800">{rm.cleanliness}</strong></span>
                  <span className="block">🌙 Sleeping: <strong className="text-slate-800">{rm.sleepSchedule}</strong></span>
                  <span className="block">📚 Study style: <strong className="text-slate-800">{rm.studyHabit}</strong></span>
                  <span className="block">💰 Budget: <strong className="text-purple-700">{rm.budgetRange}</strong></span>
                </div>

                {/* Personality & Hobbies Tags */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Personality & Hobbies</span>
                  <div className="flex flex-wrap gap-1">
                    {rm.personality.map((p, i) => (
                      <span key={i} className="text-[9px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        {p}
                      </span>
                    ))}
                    {rm.hobbies.map((h, i) => (
                      <span key={i} className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Liaison Connect Button */}
              <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Awaiting connection</span>
                <button
                  onClick={() => handleConnect(rm.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5
                    ${sent 
                      ? "bg-purple-100 text-purple-700 hover:bg-purple-200" 
                      : "bg-purple-600 hover:bg-purple-500 text-white shadow-xs hover:shadow-md"
                    }
                  `}
                >
                  {sent ? (
                    <>
                      <UserCheck size={13} />
                      <span>Request Sent</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={13} />
                      <span>Connect AI Match</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
