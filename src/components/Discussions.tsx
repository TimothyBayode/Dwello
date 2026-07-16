import React, { useState } from "react";
import { DiscussionThread } from "../types";
import { MessageSquare, ThumbsUp, Search, Pin, User, Filter } from "lucide-react";

interface DiscussionsProps {
  discussions: DiscussionThread[];
}

export default function Discussions({ discussions }: DiscussionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All" || d.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-purple-600" size={24} />
            <span>Academic & Safety Forums</span>
          </h1>
          <p className="text-sm text-slate-500">
            Participate in structured university forums. Read pin notifications from administrators or ask upperclassmen for accommodation guides.
          </p>
        </div>
        <div className="relative flex items-center w-full md:w-64">
          <Search className="absolute left-3 text-slate-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search discussion threads..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
          />
        </div>
      </div>

      {/* Forums category filters tabs */}
      <div className="border-b border-slate-100 flex gap-4 overflow-x-auto text-xs font-bold text-slate-400 pb-2">
        {["All", "Safety", "Housing Tips", "General"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 px-1 relative transition-colors ${activeTab === tab ? "text-purple-600 font-extrabold" : "hover:text-slate-700"}`}
          >
            {tab === "All" ? "All Channels" : tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Pins and Thread lists */}
      <div className="space-y-4">
        
        {/* Pinned Announcement */}
        {activeTab === "All" && (
          <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-5 space-y-3 shadow-2xs relative">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-700 uppercase tracking-widest">
              <Pin size={12} className="text-purple-600 rotate-45" />
              <span>Pinned Announcement</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900">CampusAI Scam Registry Active for 2026/2027 leases</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Our team has compiled and flagged over 45 blacklisted telephone profiles active in social networks. If a broker requires payments via digital credit cards or insists on rapid deposit completions, flag it immediately under the Scam Detector tab!
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <span>CSO Administration</span>
              <span>•</span>
              <span>Yesterday</span>
            </div>
          </div>
        )}

        {/* Regular discussions lists */}
        {filteredDiscussions.map((disc) => (
          <div key={disc.id} className="bg-white border border-slate-100 hover:border-purple-100 rounded-xl p-5 transition-all shadow-2xs flex flex-col md:flex-row justify-between md:items-center gap-4">
            
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 uppercase">
                  #{disc.category}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Started by: {disc.author} ({disc.authorRole})</span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 hover:text-purple-600 cursor-pointer transition-colors leading-snug">
                {disc.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-2xl">{disc.content}</p>
            </div>

            <div className="flex items-center gap-5 text-xs font-bold text-slate-400 justify-end flex-shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-50">
              <span className="flex items-center gap-1">
                <ThumbsUp size={12} />
                {disc.upvotes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={12} />
                {disc.replies} Replies
              </span>
              <span className="text-[10px] font-medium text-slate-400">{disc.timestamp}</span>
            </div>

          </div>
        ))}

        {filteredDiscussions.length === 0 && (
          <div className="text-center p-12 text-slate-400 text-xs italic">
            No matching forum threads found. Expand your filters.
          </div>
        )}

      </div>

    </div>
  );
}
