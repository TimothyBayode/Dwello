import React, { useState } from "react";
import { LostFoundItem } from "../types";
import { HelpCircle, Plus, Search, MapPin, Phone, Check, HelpCircle as HelpIcon } from "lucide-react";

interface LostAndFoundProps {
  items: LostFoundItem[];
  onSubmitItem: (item: Omit<LostFoundItem, "id" | "date">) => void;
}

export default function LostAndFound({ items, onSubmitItem }: LostAndFoundProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"Lost" | "Found">("Lost");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal Items");
  const [success, setSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !contact.trim()) return;

    onSubmitItem({
      title,
      status,
      location,
      contact,
      description,
      category
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowForm(false);
      setTitle("");
      setLocation("");
      setContact("");
      setDescription("");
    }, 1500);
  };

  const filteredItems = items.filter(it => {
    if (activeTab === "All") return true;
    return it.status === activeTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <HelpCircle className="text-purple-600" size={24} />
            <span>Campus Lost & Found Ledger</span>
          </h1>
          <p className="text-sm text-slate-500">
            Lost your school ID card, keys, or chargers? Post them here. Verified students can contact you directly to return them.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus size={16} />
          <span>{showForm ? "Cancel Reporting" : "Report Lost/Found Item"}</span>
        </button>
      </div>

      {/* Report Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-purple-100 rounded-2xl p-4 md:p-6 shadow-sm space-y-4 animate-scaleIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 uppercase tracking-wider">
            <span>Report Item Entry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Item Name / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Brown leather wallet containing ID card"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-800 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white text-slate-700 font-semibold"
              >
                <option value="Lost">I Lost This (Lost)</option>
                <option value="Found">I Found This (Found)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white text-slate-700 font-semibold"
              >
                <option value="Personal Items">Personal Items</option>
                <option value="Electronics">Electronics</option>
                <option value="Keys">Keys</option>
                <option value="Books / Documents">Books / Documents</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Last Seen / Found Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Faculty of Technology Shuttle Stop"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Your Contact Info</label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. Phone number or hostel address"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Item Description / Details</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Wallet contains student ID for Timothy Bayode. Found keys have a red keychain..."
              className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-700"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-50">
            {success ? (
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <Check size={14} />
                <span>Report Logged!</span>
              </div>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Publish Ledger Entry
              </button>
            )}
          </div>
        </form>
      )}

      {/* Filter Category tabs */}
      <div className="flex gap-2">
        {["All", "Lost", "Found"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 bg-white border text-xs font-semibold rounded-lg transition-all
              ${activeTab === tab 
                ? "bg-purple-50 border-purple-200 text-purple-700" 
                : "border-slate-100 text-slate-500 hover:bg-slate-50"
              }
            `}
          >
            {tab === "All" ? "All Bulletins" : tab === "Lost" ? "Lost Items 🔍" : "Found Items ✅"}
          </button>
        ))}
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((it) => (
          <div key={it.id} className="bg-white border border-slate-100 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide
                  ${it.status === "Lost" ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}
                >
                  {it.status}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{it.date}</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{it.title}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin size={10} />
                  Last seen: {it.location}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{it.description}</p>
              </div>

              <div className="text-[10px] font-bold text-slate-400">Category: {it.category}</div>
            </div>

            <div className="pt-3.5 border-t border-slate-50 mt-4 flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-slate-800">{it.contact}</span>
              <a 
                href={`tel:${it.contact}`}
                className="px-2.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <Phone size={10} />
                <span>Claim / Contact</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
