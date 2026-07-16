import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  ArrowRight, 
  Check, 
  Bell, 
  MessageSquare, 
  Lock, 
  Star, 
  ExternalLink,
  ShieldAlert,
  Users,
  Search,
  Zap,
  Globe,
  Database,
  Grid,
  User,
  Mail,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingPageProps {
  onNavigateToTab: (tabId: string) => void;
  savedCount: number;
}

export default function LandingPage({ onNavigateToTab, savedCount }: LandingPageProps) {
  const [activeModule, setActiveModule] = useState<string>("overview");
  const [textIndex, setTextIndex] = useState(0);
  const scrollingTexts = [
    "Find Hostels",
    "Compare Options",
    "Match Roommates",
    "Report Incidents"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % scrollingTexts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentText = scrollingTexts[textIndex];
  const firstSpaceIndex = currentText.indexOf(" ");
  const firstWord = firstSpaceIndex !== -1 ? currentText.substring(0, firstSpaceIndex) : currentText;
  const restOfText = firstSpaceIndex !== -1 ? currentText.substring(firstSpaceIndex + 1) : "";

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!newsletterEmail.trim()) {
      setValidationError("Please fill out this field.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      if (!newsletterEmail.includes("@")) {
        setValidationError(`Please include an '@' in the email address. '${newsletterEmail}' is missing an '@'.`);
      } else {
        setValidationError("Please enter a valid email address.");
      }
      return;
    }

    setNewsletterStatus("success");
    setNewsletterEmail("");
    setTimeout(() => {
      setNewsletterStatus("idle");
    }, 4000);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletterEmail(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  // Testimonials
  const testimonials = [
    {
      quote: "CampusAI replaced four uncoordinated WhatsApp groups and sketchy agents. I found my Crown Heights room and completed my escrow payment safely in 10 minutes!",
      author: "Timothy Bayode",
      dept: "Computer Science Student (FUTA)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "The real-time safety heatmaps and instant emergency SOS triggers give my parents total peace of mind while I reside off-campus. Truly game-changing for students.",
      author: "Seyi Alao",
      dept: "Biochemistry Student (UNILAG)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "As a verified landlord, this platform eliminates time-wasters. The tenant matching system connects me only with responsible, compatible student applicants.",
      author: "Chief J. Ogunleye",
      dept: "Property Owner (FUTA North Gate)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Premium Landing Page Navigation Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigateToTab("landing")}>
            <img src="/logo.png" alt="CampusAI OS" className="h-20 w-20 rounded-xl object-contain" />
          </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[10px] lg:text-xs font-semibold text-slate-500 tracking-wider uppercase">
          <button 
            onClick={() => onNavigateToTab("browse")} 
            className="relative py-1.5 cursor-pointer transition-colors hover:text-slate-900 group"
          >
            <span>Browse Hostels</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
          </button>
          <button 
            onClick={() => onNavigateToTab("matchmaker")} 
            className="relative py-1.5 cursor-pointer transition-colors hover:text-slate-900 group"
          >
            <span>AI Matchmaker</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
          </button>
          <button 
            onClick={() => onNavigateToTab("safety-map")} 
            className="relative py-1.5 cursor-pointer transition-colors hover:text-slate-900 group"
          >
            <span>Safety Map</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
          </button>
          <button 
            onClick={() => onNavigateToTab("scam-detector")} 
            className="relative py-1.5 cursor-pointer transition-colors hover:text-slate-900 group"
          >
            <span>Scam Shield</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => onNavigateToTab("auth-signin")}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/80 text-[10px] md:text-xs font-extrabold rounded-md transition-all cursor-pointer shadow-md hover:scale-[1.02] flex items-center gap-1 md:gap-1.5"
          >
            <User size={12} className="text-slate-700" />
            <span>Sign In</span>
          </button>
          <button 
            onClick={() => onNavigateToTab("auth-signup")}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-black hover:bg-slate-900 text-white text-[10px] md:text-xs font-extrabold rounded-md transition-all cursor-pointer shadow-sm hover:scale-[1.02] flex items-center gap-1 md:gap-1.5"
          >
            <span className="hidden sm:inline">Start For Free</span>
            <span className="sm:hidden">Join</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </header>

      <div className="space-y-16 pb-12 animate-in fade-in duration-500 flex-1">
        
        {/* 1. HERO HEADER AREA & NAVBAR LOGO */}
        <div className="text-center space-y-6 pt-12 max-w-4xl mx-auto px-4">

        {/* Big Display Headline with Scroll Effect */}
        <div className="h-16 sm:h-24 overflow-hidden flex items-center justify-center relative">
          <AnimatePresence mode="popLayout">
            <motion.h1
              key={textIndex}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-center flex items-center justify-center gap-x-3 select-none"
            >
              <motion.span
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -70, opacity: 0 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-slate-900 inline-block"
              >
                {firstWord}
              </motion.span>
              <motion.span
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -70, opacity: 0 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent px-1 inline-block"
              >
                {restOfText}
              </motion.span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Dynamic Description */}
        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Browse verified listings, run AI roommate compatibility, monitor live crime heatmaps, detect scam postings, and coordinate secure rentals—all with a unified student platform built for secure modern living.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <button 
            onClick={() => onNavigateToTab("browse")}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-purple-500/25 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Search size={14} />
            <span>Browse Verified Hostels</span>
            <ArrowRight size={14} />
          </button>
        </div>


      </div>

      {/* 2. HIGH-FIDELITY INTERACTIVE BROWSER MOCKUP (DASHBOARD) */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
          {/* Browser Header Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
            {/* Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            {/* URL bar */}
            <div className="flex-1 max-w-md mx-auto bg-white border border-slate-200/60 rounded-lg px-3 py-1 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-1">
                <Lock size={10} className="text-emerald-500" />
                <span>campusai.portal/dashboard</span>
              </div>
              <ExternalLink size={10} className="opacity-40" />
            </div>
          </div>

          {/* Browser Dashboard Visual */}
          <div className="p-6 bg-slate-50/50 space-y-6">
            {/* Mock Header Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="space-y-1">
                <div className="text-xs font-bold text-purple-600 tracking-wider uppercase">Welcome Back, Timothy</div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Active Roommate & Hostel Console</h2>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigateToTab("dashboard")} 
                  className="px-4 py-2 bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Enter Portal Dashboard
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Verified Lodges</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">42</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">100% Inspected</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">AI Matching Rate</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">96.4%</span>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">High compatibility</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Escrow Holds</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-purple-700">₦320K</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">In Trust</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Alerts</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-amber-600">0</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">All Safe Today</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Alert Log & Match preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Top Hostel Highlight matching your profile</h3>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80" 
                    alt="Lodge preview" 
                    className="w-full sm:w-36 h-28 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-purple-600 font-bold">
                      <MapPin size={10} />
                      <span>FUTA North Gate Sector (2 mins walk)</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">Crown Heights Premium Lodge</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      High-security perimeter fencing, verified stable grid transformer with automatic 10KVA solar backup, pristine treated water system.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-semibold text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">Solar Back-up</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">Verified Gate Patrol</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">Treated Borehole</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Live Security Scanner</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-emerald-800">North Gate Security Clear</div>
                      <p className="text-[9px] text-emerald-600 font-medium">Campus security patrol verified zero threats in area. (5 mins ago)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* 3. FOUR CORE GRID FEATURES */}
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-purple-600 tracking-wider uppercase">Modern Housing. Smarter Search.</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Why Students Choose CampusAI</h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
            We bypass middlemen, remove visual speculation, and build layers of protection directly into the student rental flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-purple-100 transition-all shadow-xs hover:shadow-md group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Search size={18} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-2">Verified Only</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Every single hostel goes through rigorous on-site verification before publication. We check water quality, power, and structure.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-purple-100 transition-all shadow-xs hover:shadow-md group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-2">Escrow Protection</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Payments are secured in our secure trust escrow. Rent is only released to the landlord after you receive and confirm occupancy keys.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-purple-100 transition-all shadow-xs hover:shadow-md group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
              <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-2">AI Matchmaker</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Input your major, budget, noise tolerance, and utility habits to matching engine. Instantly see top accommodation options.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-purple-100 transition-all shadow-xs hover:shadow-md group">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <Users size={18} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-2">Roommate Hub</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Avoid rooming friction. Review verified profiles of fellow students seeking shared spaces, sorted by departmental habits.
            </p>
          </div>
        </div>
      </div>

      {/* 5. TESTIMONIALS SLIDER */}
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-purple-600 tracking-wider uppercase font-sans">Student Stories</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Trusted by Modern Students</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs flex flex-col justify-between hover:border-purple-100 hover:shadow-xs transition-all duration-200">
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-600 text-xs leading-relaxed italic font-medium">
                  "{test.quote}"
                </p>
              </div>

              {/* Author Card */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-50">
                <img 
                  src={test.avatar} 
                  alt={test.author} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{test.author}</h4>
                  <p className="text-[10px] font-semibold text-slate-400">{test.dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      </div>

      {/* Modern High-End Footer */}
      <footer className="bg-slate-950 text-slate-200 mt-20 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            
            {/* Brand / Description Section */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center cursor-pointer" onClick={() => onNavigateToTab("landing")}>
                <img src="/logo.png" alt="CampusAI OS" className="h-20 w-20 rounded-lg object-contain" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-medium">
                Simplifying off-campus student accommodation. Search verified hostels, match with compatible roommates, and navigate campus safety with secure peer-to-peer assurance.
              </p>
            </div>

            {/* Quick Links Group */}
            <div className="md:col-span-4 grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-widest">Platform</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li>
                    <button onClick={() => onNavigateToTab("browse")} className="hover:text-purple-400 transition-colors cursor-pointer text-left">
                      Browse Hostels
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigateToTab("matchmaker")} className="hover:text-purple-400 transition-colors cursor-pointer text-left">
                      AI Matchmaker
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigateToTab("safety-map")} className="hover:text-purple-400 transition-colors cursor-pointer text-left">
                      Live Safety Map
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigateToTab("scam-detector")} className="hover:text-purple-400 transition-colors cursor-pointer text-left">
                      Scam Shield Check
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-widest">Resources</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li>
                    <button onClick={() => onNavigateToTab("dashboard")} className="hover:text-purple-400 transition-colors cursor-pointer text-left">
                      Control Panel
                    </button>
                  </li>
                  <li>
                    <a href="#help" className="hover:text-purple-400 transition-colors text-left">
                      Student Guides
                    </a>
                  </li>
                  <li>
                    <a href="#terms" className="hover:text-purple-400 transition-colors text-left">
                      Campus Code
                    </a>
                  </li>
                  <li>
                    <a href="#privacy" className="hover:text-purple-400 transition-colors text-left">
                      Safety Protocol
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-widest">Stay Updated</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Join our newsletter to receive the latest off-campus hostel availabilities, rent price shifts, and security updates directly in your student inbox.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} noValidate className="space-y-2 relative">
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-slate-500 pointer-events-none">
                    <Mail size={14} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter student email..."
                    value={newsletterEmail}
                    onChange={handleEmailChange}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl py-2.5 pl-9 pr-24 focus:outline-hidden focus:border-purple-500 placeholder-slate-500 font-medium transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Subscribe</span>
                    <Send size={10} />
                  </button>

                  <AnimatePresence>
                    {validationError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-3 w-full z-10 bg-slate-900 border border-purple-500/30 text-white rounded-xl p-3 shadow-xl flex items-start gap-2.5"
                      >
                        {/* Little arrow at the bottom */}
                        <div className="absolute top-full left-6 w-3 h-3 bg-slate-900 border-r border-b border-purple-500/30 transform rotate-45 -translate-y-1.5" />
                        
                        <ShieldAlert size={14} className="text-purple-400 shrink-0 mt-0.5" />
                        <div className="text-[11px] font-bold text-slate-100 leading-tight">
                          {validationError}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {newsletterStatus === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[10px] font-bold text-emerald-400"
                    >
                      ✓ Subscription successful! Welcome aboard.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>

          </div>

          {/* Divider Line */}
          <div className="h-[1px] bg-slate-900 my-10" />

          {/* Copyright Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-semibold text-slate-500">
            <div>
              © 2026 CampusAI OS. Created for safe, modern student living.
            </div>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#conduct" className="hover:text-slate-400 transition-colors">Student Conduct</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
