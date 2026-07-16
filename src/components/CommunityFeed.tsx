import React, { useState } from "react";
import { DiscussionThread } from "../types";
import { MessageSquare, ThumbsUp, Plus, Sparkles, User, HelpCircle, Check, Award } from "lucide-react";

interface CommunityFeedProps {
  discussions: DiscussionThread[];
  onSubmitDiscussion: (disc: Omit<DiscussionThread, "id" | "replies" | "upvotes" | "timestamp" | "avatar">) => void;
}

export default function CommunityFeed({ discussions, onSubmitDiscussion }: CommunityFeedProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"General" | "Safety" | "Housing Tips" | "Marketplace">("General");
  const [success, setSuccess] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All");

  const [voteStates, setVoteStates] = useState<Record<string, { count: number; voted: boolean }>>({});

  const handleVote = (id: string, initialCount: number) => {
    setVoteStates(prev => {
      const cur = prev[id] || { count: initialCount, voted: false };
      return {
        ...prev,
        [id]: cur.voted 
          ? { count: cur.count - 1, voted: false } 
          : { count: cur.count + 1, voted: true }
      };
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmitDiscussion({
      title,
      content,
      category,
      author: "Timothy Bayode",
      authorRole: "CS Student"
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowAddForm(false);
      setTitle("");
      setContent("");
    }, 1500);
  };

  const filteredFeed = discussions.filter(d => {
    if (selectedCat === "All") return true;
    return d.category === selectedCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-purple-600" size={24} />
            <span>Campus Community Feed</span>
          </h1>
          <p className="text-sm text-slate-500">
            Share housing tips, check local transport availability, or post recommendations. Connect with verified students.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus size={16} />
          <span>{showAddForm ? "Cancel Post" : "Start New Topic"}</span>
        </button>
      </div>

      {/* Dynamic Thread Submitting form */}
      {showAddForm && (
        <form onSubmit={handleCreatePost} className="bg-white border border-purple-100 rounded-2xl p-4 md:p-6 shadow-sm space-y-4 animate-scaleIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 uppercase tracking-wider">
            <Sparkles size={14} className="text-purple-600 animate-spin-slow" />
            <span>Publish Community Broadcast</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Discussion Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fiber internet speeds near West Gate are amazing today!"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-800 font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Category Tag</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white text-slate-700 font-semibold"
              >
                <option value="General">General</option>
                <option value="Safety">Safety</option>
                <option value="Housing Tips">Housing Tips</option>
                <option value="Marketplace">Marketplace</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Content / Message Body</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Keep discussions respectful and helpful..."
              className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-700"
            />
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-50">
            <span className="text-[10px] text-slate-400 font-bold">Posting as: Timothy Bayode (Verified student)</span>
            
            {success ? (
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <Check size={14} />
                <span>Post Published!</span>
              </div>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Publish Topic
              </button>
            )}
          </div>
        </form>
      )}

      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {["All", "General", "Safety", "Housing Tips", "Marketplace"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors
              ${selectedCat === cat 
                ? "bg-purple-50 border-purple-200 text-purple-700" 
                : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
              }
            `}
          >
            {cat === "All" ? "All Channels" : cat}
          </button>
        ))}
      </div>

      {/* Discussions Grid and Side list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredFeed.map((disc) => {
            const vote = voteStates[disc.id] || { count: disc.upvotes, voted: false };
            return (
              <div key={disc.id} className="bg-white border border-slate-100 rounded-xl p-5 space-y-4 shadow-xs">
                
                {/* Author profile row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={disc.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} alt={disc.author} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{disc.author}</h4>
                      <p className="text-[9px] text-slate-400 font-medium">{disc.authorRole} • {disc.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    #{disc.category}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{disc.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{disc.content}</p>
                </div>

                {/* Actions (Vote & Reply counts) */}
                <div className="pt-3.5 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVote(disc.id, disc.upvotes)}
                      className={`py-1 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors
                        ${vote.voted 
                          ? "bg-purple-600 border-purple-600 text-white" 
                          : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                        }
                      `}
                    >
                      <ThumbsUp size={12} className={vote.voted ? "fill-white" : ""} />
                      <span>{vote.count} Upvotes</span>
                    </button>
                    
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <MessageSquare size={12} />
                      {disc.replies} Replies
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Right column: Popular tags & Tips (1 col) */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-50">Trending Tags</h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {["#MTN-WestGate", "#SolarLodges", "#ScamAlert", "#FUTALandlords", "#SafeWalk"].map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 hover:text-purple-600 border border-slate-100 rounded-md cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-tr from-purple-900 to-purple-950 p-5 rounded-xl text-white space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-5">
              <Award size={100} />
            </div>
            <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">Verified Badges</h4>
            <p className="text-[11px] text-purple-100 leading-relaxed">
              Every profile displaying a verification badge has confirmed their university registration card and physical compound ID. Always check for badges before conducting peer trades!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
