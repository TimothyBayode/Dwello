import React, { useState, useMemo } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Heart, 
  Sparkles, 
  Star, 
  Zap, 
  Wifi, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Droplet,
  Grid,
  List,
  Map,
  X,
  Phone,
  Calendar,
  CheckCircle,
  FileCheck,
  Compass,
  ArrowUpDown,
  Sliders,
  HelpCircle,
  TrendingUp,
  Activity,
  Award
} from "lucide-react";
import { Hostel } from "../types";

interface BrowseHostelsProps {
  hostels: Hostel[];
  savedHostelIds: string[];
  onToggleSaveHostel: (id: string) => void;
  onApplyBooking: (hostelId: string, roomType: string) => void;
  isSavedOnlyPage?: boolean;
}

export default function BrowseHostels({ 
  hostels, 
  savedHostelIds, 
  onToggleSaveHostel,
  onApplyBooking,
  isSavedOnlyPage = false
}: BrowseHostelsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [selectedPower, setSelectedPower] = useState<string>("All");
  const [selectedSecurity, setSelectedSecurity] = useState<string>("All");
  const [mustHaveWifi, setMustHaveWifi] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [sortBy, setSortBy] = useState<"match" | "price-asc" | "price-desc" | "safety">("match");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  // Booking fields
  const [bookingRoomType, setBookingRoomType] = useState("Single Self-Contain");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (maxPrice < 500000) count++;
    if (selectedPower !== "All") count++;
    if (selectedSecurity !== "All") count++;
    if (mustHaveWifi) count++;
    return count;
  }, [searchQuery, maxPrice, selectedPower, selectedSecurity, mustHaveWifi]);

  // Filter logic
  const filteredHostels = useMemo(() => {
    let result = hostels.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            h.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = h.price <= maxPrice;
      const matchesPower = selectedPower === "All" || h.electricityReliability === selectedPower;
      const matchesSecurity = selectedSecurity === "All" || h.securityLevel === selectedSecurity;
      const matchesWifi = !mustHaveWifi || h.wifiAvailable;

      return matchesSearch && matchesPrice && matchesPower && matchesSecurity && matchesWifi;
    });

    // Sorting logic
    if (sortBy === "match") {
      result = [...result].sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    } else if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "safety") {
      result = [...result].sort((a, b) => b.safetyScore - a.safetyScore);
    }

    return result;
  }, [hostels, searchQuery, maxPrice, selectedPower, selectedSecurity, mustHaveWifi, sortBy]);

  const handleBookSubmit = (hostelId: string) => {
    onApplyBooking(hostelId, bookingRoomType);
    setBookingSuccessMsg(true);
    setTimeout(() => {
      setBookingSuccessMsg(false);
      setSelectedHostel(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Premium Top Section with Banner background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-4 md:p-8 shadow-md border border-purple-500/10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 z-10">
          <div className="space-y-1 md:space-y-2 max-w-xl">
            <h1 className="text-lg md:text-3xl font-extrabold tracking-tight text-white">
              {isSavedOnlyPage ? "My Saved Hostels Watchlist" : "Explore Premium Student Hostels"}
            </h1>
            <p className="text-slate-300 text-[11px] md:text-sm leading-relaxed">
              {isSavedOnlyPage 
                ? "Manage, compare, and monitor your shortlisted accommodation options. Complete your booking application whenever you are ready." 
                : "Every single listing undergoes rigorous on-site inspection. Rest easy knowing safety standards, power quality, and facilities are fully verified."}
            </p>
          </div>

          {/* Quick Stats Banner inside */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0">
            {!isSavedOnlyPage && (
              <div className="text-center px-2 md:px-3 border-r border-white/10">
                <span className="block text-base md:text-xl font-bold text-white leading-none">100%</span>
                <span className="text-[8px] md:text-[9px] font-semibold text-slate-300 uppercase tracking-wider">
                  Inspected
                </span>
              </div>
            )}
            <div className={`text-center px-2 md:px-3 ${!isSavedOnlyPage ? "border-r border-white/10" : ""}`}>
              <span className="block text-base md:text-xl font-bold text-purple-300 leading-none">{hostels.length}</span>
              <span className="text-[8px] md:text-[9px] font-semibold text-slate-300 uppercase tracking-wider">
                {isSavedOnlyPage ? "Saved Lodges" : "Active Lodges"}
              </span>
            </div>
            {!isSavedOnlyPage && (
              <div className="text-center px-2">
                <span className="block text-base md:text-xl font-bold text-emerald-400 leading-none">0%</span>
                <span className="text-[8px] md:text-[9px] font-semibold text-slate-300 uppercase tracking-wider">
                  Scam Rate
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar for Filter view choices */}
      <div className="bg-white border border-slate-100 p-3 md:p-4 rounded-2xl flex flex-wrap gap-2 md:gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Sorting Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl px-3.5 py-1.5 cursor-pointer text-xs font-semibold text-slate-700 transition-colors"
            >
              <ArrowUpDown size={13} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sort:</span>
              <span className="text-slate-800">
                {sortBy === "match" && "Best AI Match"}
                {sortBy === "price-asc" && "Price: Low to High"}
                {sortBy === "price-desc" && "Price: High to Low"}
                {sortBy === "safety" && "Highest Safety Score"}
              </span>
            </button>

            {isSortOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20 cursor-default" 
                  onClick={() => setIsSortOpen(false)} 
                />
                <div 
                  className="absolute z-30 mt-2 top-full left-0 bg-slate-950/95 backdrop-blur-md text-white text-xs p-1.5 rounded-xl shadow-lg border border-white/10 flex flex-col gap-0.5 min-w-[190px] animate-in fade-in-0 zoom-in-95 duration-100"
                >
                  {[
                    { value: "match", label: "Best AI Match" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                    { value: "safety", label: "Highest Safety Score" }
                  ].map((option) => {
                    const isActive = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as any);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isActive 
                            ? "bg-purple-600/90 text-white font-semibold" 
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Advanced Filters Popover */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl px-3.5 py-1.5 cursor-pointer text-xs font-semibold text-slate-700 transition-colors"
            >
              <SlidersHorizontal size={13} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filters:</span>
              <span className="text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100 text-[10px]">
                {activeFiltersCount}
              </span>
            </button>

            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20 cursor-default" 
                  onClick={() => setIsFilterOpen(false)} 
                />
                <div 
                  className="absolute z-30 mt-2 top-full left-0 bg-slate-950/95 backdrop-blur-md text-white text-xs p-5 rounded-2xl shadow-xl border border-white/10 flex flex-col gap-4 w-[calc(100vw-32px)] max-w-[360px] animate-in fade-in-0 zoom-in-95 duration-100"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider text-purple-400">
                      <SlidersHorizontal size={13} />
                      <span>Search Filters</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSearchQuery("");
                        setMaxPrice(500000);
                        setSelectedPower("All");
                        setSelectedSecurity("All");
                        setMustHaveWifi(false);
                      }}
                      className="text-[10px] font-bold text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Keyword search */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Search size={11} className="text-slate-500" />
                      <span>Search Locations</span>
                    </label>
                    <div className="relative flex items-center">
                      <Search className="absolute left-3 text-slate-500 pointer-events-none" size={13} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Name, area, gate, distance..."
                        className="w-full pl-9 pr-3 py-2 bg-white/5 hover:bg-white/10 text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Price Range Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Max Budget</label>
                      <span className="font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20 text-[10px]">
                        ₦{maxPrice.toLocaleString()}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min={150000} 
                      max={500000} 
                      step={10000}
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                      <span>₦150,000</span>
                      <span>₦320,000</span>
                      <span>₦500,000+</span>
                    </div>
                  </div>

                  {/* Electricity Reliability filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Electricity Quality</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["All", "Excellent", "Good", "Average"].map((pow) => (
                        <button
                          key={pow}
                          onClick={() => setSelectedPower(pow)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold transition-all border cursor-pointer ${
                            selectedPower === pow 
                              ? "bg-purple-600 border-purple-600 text-white font-bold shadow-xs shadow-purple-600/10" 
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {pow === "All" ? "Any Grid" : pow}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Security Levels */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Level</label>
                    <select
                      value={selectedSecurity}
                      onChange={(e) => setSelectedSecurity(e.target.value)}
                      className="w-full p-2.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 font-semibold cursor-pointer transition-all"
                    >
                      <option value="All" className="bg-slate-900 text-white">Any Security Profile</option>
                      <option value="Very High" className="bg-slate-900 text-white">🛡️ Very High (Guarded & Gated)</option>
                      <option value="High" className="bg-slate-900 text-white">🔒 High (Fully Fenced, CCTV)</option>
                      <option value="Moderate" className="bg-slate-900 text-white">🚪 Moderate (Basic Gates)</option>
                    </select>
                  </div>

                  {/* WiFi Toggle */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Requires WiFi</span>
                      <span className="text-[9px] text-slate-500 block">Must have study internet</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={mustHaveWifi} 
                        onChange={() => setMustHaveWifi(!mustHaveWifi)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          <span className="text-[10px] md:text-xs font-semibold text-slate-400">
            Showing <strong className="text-slate-700">{filteredHostels.length}</strong> of {hostels.length} hostels
          </span>
        </div>

        {/* View Mode & Map Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-purple-600 shadow-2xs" : "text-slate-400 hover:text-slate-600"}`}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-purple-600 shadow-2xs" : "text-slate-400 hover:text-slate-600"}`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>

          <button 
            onClick={() => setShowMap(true)}
            className="px-3 md:px-4 py-1.5 rounded-xl border text-[10px] md:text-xs font-bold flex items-center gap-1 md:gap-1.5 transition-all shadow-2xs cursor-pointer bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
          >
            <Map size={12} className="text-purple-600" />
            <span className="hidden sm:inline">Show Map View</span>
            <span className="sm:hidden">Map</span>
          </button>
        </div>
      </div>

      {/* Main Listings Display Area */}
      <div className="space-y-5">
        {filteredHostels.length === 0 ? (
          <div className="bg-white border border-slate-100 p-12 text-center rounded-2xl space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Hostels Match Your Criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Try relaxing the filters: widen your price limit, choose "Any Grid" or lower the security profile constraints to see more options.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setMaxPrice(500000);
                setSelectedPower("All");
                setSelectedSecurity("All");
                setMustHaveWifi(false);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
              {filteredHostels.map((h) => {
                const isSaved = savedHostelIds.includes(h.id);
                return (
                  <div 
                    key={h.id} 
                    onClick={() => setSelectedHostel(h)}
                    className={`bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-purple-200 transition-all duration-300 group flex flex-col cursor-pointer ${
                      viewMode === "list" ? "md:flex-row h-full" : ""
                    }`}
                  >
                    {/* Media Card */}
                    <div className={`relative ${viewMode === "list" ? "md:w-60 shrink-0" : "w-full"}`}>
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={h.images[0]} 
                          alt={h.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
                      </div>

                      {/* Translucent Favorite Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveHostel(h.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 md:p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 transition-all shadow-xs backdrop-blur-xs cursor-pointer hover:scale-110 active:scale-95 z-10"
                        title={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
                      >
                        <Heart size={12} className={isSaved ? "text-red-500 fill-red-500" : ""} />
                      </button>
                    </div>

                    {/* Description Details */}
                    <div className="p-4 md:p-5 space-y-2.5 md:space-y-3.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5 md:space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] md:text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 md:px-2.5 py-0.5 rounded-lg">
                            🛡️ {h.safetyScore} Safety Rating
                          </span>
                          <span className="text-[9px] md:text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 md:px-2 py-0.5 rounded-lg flex items-center gap-1">
                            ⭐ {h.rating} ({h.reviewsCount} reviews)
                          </span>
                        </div>

                        <h3 className="text-xs md:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors leading-snug">
                          {h.name}
                        </h3>
                        
                        <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed">
                          {h.aiReasoning}
                        </p>
                      </div>

                      {/* Micro interaction link */}
                      <div className="pt-2 md:pt-2.5 border-t border-slate-50 flex items-center justify-between text-[9px] md:text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">
                        <span>Click for details</span>
                        <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          View <ChevronRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      {/* Map Modal Popup */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-3xs">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                <Map size={14} className="text-purple-600 animate-pulse" />
                <span>Zone Map Tracker</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[9px] uppercase tracking-wide">
                  Campus Grid
                </span>
                <button 
                  onClick={() => setShowMap(false)}
                  className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all border border-slate-100 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Custom SVG radar map designed with editorial precision */}
            <div className="flex-1 min-h-[250px] md:min-h-[460px] relative bg-slate-100 p-4 overflow-hidden flex items-center justify-center">
              {/* Fake blueprints gridlines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-30">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-slate-300" />
                ))}
              </div>
              
              {/* Clean concentric radar circles for layout reference */}
              <div className="absolute w-40 h-40 rounded-full border border-purple-400/20" />
              <div className="absolute w-64 h-64 rounded-full border border-purple-400/10" />
              <div className="absolute w-80 h-80 rounded-full border border-purple-400/5 animate-pulse" />

              {/* Campus Hub Center Pin */}
              <div className="absolute flex flex-col items-center hover:scale-105 transition-transform cursor-help z-10">
                <div className="w-7 h-7 rounded-full bg-slate-950 text-slate-900 font-extrabold text-xs flex items-center justify-center border-2 border-slate-950/20 shadow-md">
                  ★
                </div>
                <span className="text-[8px] font-bold text-slate-700 bg-white border border-slate-100 px-2 py-0.5 rounded-md shadow-2xs mt-1 uppercase tracking-wider">
                  Campus Gate
                </span>
              </div>

              {/* Hostels mapped on polar Coordinates */}
              {filteredHostels.map((h, i) => {
                const angles = [30, 150, 240, 310, 80, 190, 110, 340];
                const angle = angles[i % angles.length] * (Math.PI / 180);
                const radius = 60 + (i * 15);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div 
                    key={h.id}
                    className="absolute cursor-pointer group hover:z-20 transition-all duration-300"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    onClick={() => {
                      setSelectedHostel(h);
                      setShowMap(false);
                    }}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Floating Pin Card Preview */}
                      <div className="absolute bottom-7 scale-0 group-hover:scale-100 origin-bottom bg-slate-900 text-white rounded-xl p-2 text-[9px] font-medium w-28 pointer-events-none transition-all duration-200 shadow-md border border-white/10 z-30">
                        <div className="font-extrabold truncate text-white">{h.name}</div>
                        <div className="text-purple-300 font-bold">₦{h.price.toLocaleString()}</div>
                        <div className="text-[8px] text-slate-400 mt-0.5">{h.distanceToCampus}</div>
                      </div>
                      
                      {/* Neon Pin Dot */}
                      <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[9px] border-2 border-white shadow-sm hover:bg-purple-500 group-hover:scale-110 group-hover:bg-indigo-600 transition-all">
                        {h.aiMatchScore}%
                      </div>
                      <div className="w-0.5 h-1.5 bg-purple-600 group-hover:bg-indigo-600" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Zone Legend</span>
                <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-500 font-bold mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    <span>Hostel Location (% Match Score)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950 text-slate-900 border border-slate-950/20 flex items-center justify-center text-[7px]">★</span>
                    <span>Main Campus Entry/Hub Gate</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowMap(false)}
                className="px-4 py-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail & Booking Modal (Immersive modal interface) */}
      {selectedHostel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto overflow-x-hidden shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 no-scrollbar">
            
            {/* Header image banner */}
            <div className="relative h-44 md:h-64">
              <img 
                src={selectedHostel.images[0]} 
                alt={selectedHostel.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/30" />
              
              <button 
                onClick={() => setSelectedHostel(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-[10px] font-black text-white bg-purple-600/90 backdrop-blur-md rounded-xl border border-purple-400/30 flex items-center gap-1 shadow-sm">
                    <Sparkles size={10} />
                    {selectedHostel.roomsLeft} Rooms Left
                  </span>
                  <span className="px-3 py-1 text-[10px] font-black text-white bg-emerald-600/90 backdrop-blur-md rounded-xl border border-emerald-400/30 flex items-center gap-1 shadow-sm">
                    🛡️ {selectedHostel.safetyScore} Safety Rating
                  </span>
                </div>

                <div className="text-[11px] font-bold text-white bg-slate-900/60 px-2.5 py-1 rounded-xl border border-white/10 backdrop-blur-md uppercase tracking-wider">
                  📍 {selectedHostel.distanceToCampus}
                </div>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 md:p-8 space-y-5 md:space-y-6">
              
              {/* Title section */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    {selectedHostel.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" />
                  <span className="font-semibold text-slate-600">{selectedHostel.location}</span>
                </p>
              </div>



              {/* AI MATCH REASONING HIGHLIGHT */}
              <div className="bg-gradient-to-br from-purple-500/[0.04] to-indigo-500/[0.04] border border-purple-100/70 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
                  <Sparkles className="text-purple-600 animate-pulse" size={48} />
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-800 uppercase tracking-wider">
                  <Award size={14} className="text-purple-600" />
                  <span>AI Review Summary</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                  "{selectedHostel.aiReasoning}"
                </p>
                <div className="pt-3 border-t border-purple-100/60 flex flex-wrap gap-2 text-[10px] font-bold text-slate-600">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-100">Rooms left: {selectedHostel.roomsLeft} units</span>
                </div>
              </div>

              {/* Features Lists */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Lodge Amenities & Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedHostel.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-bold bg-slate-50/50 px-3 py-1.5 rounded-xl border border-slate-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shadow-xs" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOOKING INTERACTIVE ACTION CONTAINER */}
              <div className="p-5 bg-slate-900 text-white rounded-3xl border border-white/10 shadow-lg space-y-4 relative">
                <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-[11px] font-black uppercase tracking-widest text-purple-400 pb-2 border-b border-white/10 flex items-center gap-1.5">
                  <Activity size={12} className="animate-pulse" />
                  <span>Secure Online Rental Application</span>
                </h3>
                
                {bookingSuccessMsg ? (
                  <div className="flex flex-col items-center gap-3 py-6 justify-center text-center animate-in zoom-in-95">
                    <div className="w-12 h-12 bg-emerald-500/15 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="animate-bounce" size={24} />
                    </div>
                    <div className="space-y-1">
                      <span className="font-extrabold text-sm text-white block">Application Submitted Successfully!</span>
                      <span className="text-[11px] text-slate-400 block">Timothy, please proceed to 'My Applications' to track your verified review status.</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Select Room Category</label>
                        <button
                          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                          className="flex items-center justify-between gap-2 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 cursor-pointer text-xs font-bold text-white transition-colors w-full"
                        >
                          <span className="truncate max-w-[130px] sm:max-w-[150px] block text-left">
                            {bookingRoomType}
                          </span>
                          <ChevronDown size={13} className="text-slate-400 shrink-0" />
                        </button>
 
                        {isCategoryOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-20 cursor-default" 
                              onClick={() => setIsCategoryOpen(false)} 
                            />
                            <div 
                              className="absolute z-30 mt-2 top-full left-0 bg-slate-950/95 backdrop-blur-md text-white text-xs p-1.5 rounded-xl shadow-lg border border-white/10 flex flex-col gap-0.5 w-full md:w-64 animate-in fade-in-0 zoom-in-95 duration-100 max-h-36 overflow-y-auto custom-scrollbar"
                            >
                              {[
                                { value: "Single Self-Contain", label: "Single Self-Contain (1 Student) - 100% price" },
                                { value: "Double Shared Room", label: "Double Shared Room (2 Students) - 60% price" },
                                { value: "Executive Suite", label: "Executive Suite (AC/Balcony) - 130% price" }
                              ].map((option) => {
                                const isActive = bookingRoomType === option.value;
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      setBookingRoomType(option.value);
                                      setIsCategoryOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                      isActive 
                                        ? "bg-purple-600/90 text-white font-semibold" 
                                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                                    }`}
                                  >
                                    <span className="truncate pr-2">{option.label}</span>
                                    {isActive && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleBookSubmit(selectedHostel.id)}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                      >
                        <FileCheck size={14} />
                        <span>Book Now (₦{selectedHostel.price.toLocaleString()})</span>
                      </button>
                    </div>
                    {/* No escrow note */}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
