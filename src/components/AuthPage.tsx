import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Building, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { registerStudent, loginStudent, isFirebaseConfigured, loginWithGoogle } from "../lib/firebase";

interface AuthPageProps {
  initialMode: "signin" | "signup";
  onNavigateToTab: (tabId: string) => void;
  onLoginSuccess: (user: { uid: string; email: string | null; displayName: string; university: string; avatarUrl?: string }) => void;
}

export default function AuthPage({ initialMode, onNavigateToTab, onLoginSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("LAUTECH");
  const [isUniDropdownOpen, setIsUniDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleMode = () => {
    setMode(prev => prev === "signin" ? "signup" : "signin");
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Form Validations
    if (mode === "signup") {
      if (!fullName.trim()) {
        setErrorMsg("Full name is required.");
        return;
      }
      if (!agreeTerms) {
        setErrorMsg("You must agree to the Campus Code & Safety Protocols.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid student email address.");
      return;
    }

    setIsLoading(true);

    try {
      let userProfile: any;
      if (mode === "signup") {
        userProfile = await registerStudent(email, password, fullName, university);
        setSuccessMsg(
          isFirebaseConfigured()
            ? "Account created in Firebase! Preparing your secure dashboard..."
            : "Offline simulator: Account created! Preparing your secure dashboard..."
        );
      } else {
        userProfile = await loginStudent(email, password);
        setSuccessMsg(
          isFirebaseConfigured()
            ? "Successfully authenticated via Firebase! Redirecting..."
            : "Offline simulator: Successfully authenticated! Redirecting..."
        );
      }

      if (userProfile) {
        onLoginSuccess(userProfile);
      }

      // Auto-redirect to dashboard after success
      setTimeout(() => {
        setIsLoading(false);
        onNavigateToTab("dashboard");
      }, 1500);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || "Authentication failed. Please verify credentials or settings.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Mobile Full Background Image */}
      <div className="md:hidden absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80" 
            alt="" 
            className="w-full h-full object-cover opacity-60 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/30" />
          <div className="absolute inset-0 bg-purple-950/20 mix-blend-overlay" />
        </div>
      </div>

      {/* LEFT SIDEBAR: Visual Showcase (hidden on mobile, matches premium split screen style) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[45%] bg-slate-900 relative flex-col justify-between p-12 lg:p-16 text-white overflow-hidden shrink-0">
        
        {/* Background Image of a Cozy Room / Hostel Living Space */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80" 
            alt="Cozy student study and living space" 
            className="w-full h-full object-cover opacity-60 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Multi-layered premium overlay gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/30 z-10" />
          <div className="absolute inset-0 bg-purple-950/10 mix-blend-overlay z-15" />
        </div>

        {/* Brand & Welcoming copy on top of background image */}
        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CampusAI" className="h-20 w-20 rounded-lg object-contain" />
          </div>

          <div className="my-auto space-y-4 max-w-sm">
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Your trusted gateway to premium campus life.
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              Join our verified student housing network. Browse inspected accommodations, discover compatible housemates, and enjoy real-time safety alerts.
            </p>
          </div>


        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Form (centers form beautifully) */}
      <div className="flex-1 flex flex-col justify-between py-4 md:py-12 px-6 sm:px-12 md:px-16 lg:px-20 z-10 relative overflow-y-auto bg-transparent md:bg-slate-50">
        
        {/* Subtle top decoration for mobile */}
        <div className="md:hidden flex justify-center items-center w-full max-w-md mx-auto pb-3 pt-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CampusAI OS" className="h-24 w-24 rounded-lg object-contain" />
          </div>
        </div>

        {/* Form Container (perfectly centered vertically/horizontally) */}
        <div className="my-auto w-full max-w-md mx-auto py-4">
          
          {/* Main Card */}
          <div className="bg-white border border-slate-100/80 shadow-2xl rounded-3xl p-8 space-y-6">
            
            {/* Success Splash Screen Overlay */}
            {successMsg ? (
              <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
                <div className="mx-auto h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900">Success</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                    {successMsg}
                  </p>
                </div>
                <div className="pt-2">
                  <div className="inline-block h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : (
              <>
                {/* Header Title */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {mode === "signin" ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">
                    {mode === "signin" 
                      ? "Sign in to access your verified hostels & roommates" 
                      : "Join thousands of students finding safe off-campus housing"
                    }
                  </p>
                </div>

                {/* Switch Tabs */}
                <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/40">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg(null);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      mode === "signin" 
                        ? "bg-white text-slate-900 shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMsg(null);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      mode === "signup" 
                        ? "bg-white text-slate-900 shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Error banner */}
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-start gap-2 animate-in slide-in-from-top-2 duration-200">
                    <span className="shrink-0 text-red-500 font-bold">⚠</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name (Sign Up only) */}
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <User size={15} />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Timothy Bayode"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 text-xs text-slate-950 rounded-xl py-3 pl-10 pr-4 focus:outline-hidden focus:border-purple-600 focus:bg-white placeholder-slate-400 font-medium transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Student Email Address</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="e.g. t.bayode@student.futa.edu.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/80 text-xs text-slate-950 rounded-xl py-3 pl-10 pr-4 focus:outline-hidden focus:border-purple-600 focus:bg-white placeholder-slate-400 font-medium transition-all"
                      />
                    </div>
                  </div>

                  {/* University Campus Selection (Sign Up only) */}
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Campus / University</label>
                      <div className="relative w-fit max-w-full">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                          <Building size={15} />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsUniDropdownOpen(prev => !prev)}
                          className={`w-fit max-w-full bg-slate-50 border text-xs text-slate-950 rounded-xl py-3 pl-10 pr-10 font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 relative z-0 ${
                            isUniDropdownOpen ? 'border-purple-600 bg-white ring-1 ring-purple-600' : 'border-slate-200/80 hover:bg-slate-100/50'
                          }`}
                        >
                          <span className="max-w-[180px] sm:max-w-[220px] truncate block text-left">
                            {university === "LAUTECH" ? "Ladoke Akintola University of Technology (LAUTECH), Ogbomoso" : university}
                          </span>
                        </button>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px] z-10">
                          ▼
                        </div>

                        {isUniDropdownOpen && (
                          <>
                            {/* Backdrop to close the dropdown */}
                            <div 
                              className="fixed inset-0 z-30" 
                              onClick={() => setIsUniDropdownOpen(false)} 
                            />
                            {/* Dropdown Options box styled exactly like inputs */}
                            <div className="absolute left-0 mt-1.5 z-40 bg-white text-slate-950 text-xs rounded-xl shadow-lg border border-slate-200/80 py-1.5 min-w-[240px] max-w-xs animate-in fade-in-0 zoom-in-95 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setUniversity("LAUTECH");
                                  setIsUniDropdownOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-[11px] font-semibold text-slate-800 transition-colors flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                                <span className="truncate">LAUTECH, Ogbomoso</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Password</label>
                      {mode === "signin" && (
                        <button 
                          type="button" 
                          className="text-[10px] font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                          onClick={() => alert("Password recovery code sent to verified student mail address.")}
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Lock size={15} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/80 text-xs text-slate-950 rounded-xl py-3 pl-10 pr-10 focus:outline-hidden focus:border-purple-600 focus:bg-white placeholder-slate-400 font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Sign Up only) */}
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <Lock size={15} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 text-xs text-slate-950 rounded-xl py-3 pl-10 pr-10 focus:outline-hidden focus:border-purple-600 focus:bg-white placeholder-slate-400 font-medium transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Checkboxes */}
                  {mode === "signin" ? (
                    <div className="flex items-center">
                      <input
                        id="remember_me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-purple-600 border-slate-300 rounded-sm focus:ring-purple-500 focus:outline-hidden cursor-pointer"
                      />
                      <label htmlFor="remember_me" className="ml-2 block text-xs text-slate-600 font-medium select-none cursor-pointer">
                        Keep me signed in on this device
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <input
                        id="agree_terms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="h-4 w-4 mt-0.5 text-purple-600 border-slate-300 rounded-sm focus:ring-purple-500 focus:outline-hidden cursor-pointer shrink-0"
                      />
                      <label htmlFor="agree_terms" className="ml-2 block text-xs text-slate-600 font-medium leading-normal select-none cursor-pointer">
                        I agree to the <span className="font-semibold text-purple-600 hover:underline">Campus Code of Conduct</span> & <span className="font-semibold text-purple-600 hover:underline">Safety Protocols</span>
                      </label>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-400 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-purple-500/15 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                </form>

                {/* Social / SSO Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-extrabold">
                    <span className="bg-white px-3 text-slate-400">Or connect with</span>
                  </div>
                </div>

                {/* SSO Buttons */}
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      setErrorMsg(null);
                      try {
                        const userProfile = await loginWithGoogle();
                        setSuccessMsg(
                          isFirebaseConfigured()
                            ? "Successfully authenticated via Google! Redirecting..."
                            : "Offline Mode: Simulated Google authentication success!"
                        );
                        if (userProfile) {
                          onLoginSuccess(userProfile);
                        }
                        setTimeout(() => {
                          setIsLoading(false);
                          onNavigateToTab("dashboard");
                        }, 1200);
                      } catch (err: any) {
                        setErrorMsg(err.message || "Google sign-in failed.");
                        setIsLoading(false);
                      }
                    }}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-3 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" className="shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Google Account</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-50/50 border border-slate-200/50 text-slate-400 text-xs font-bold rounded-xl shadow-xs cursor-not-allowed opacity-75"
                  >
                    <span>Student Portal</span>
                    <span className="px-1.5 py-0.5 text-[8px] bg-slate-100 text-slate-400 border border-slate-200/60 rounded-md font-extrabold uppercase tracking-wide">Soon</span>
                  </button>
                </div>

                {/* Switch Mode Footer Text */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500 font-medium">
                    {mode === "signin" ? "Don't have an account yet?" : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={handleToggleMode}
                      className="font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                    >
                      {mode === "signin" ? "Create one free" : "Sign in here"}
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Branding (Sticky-ish bottom) */}
        <div className="w-full max-w-md mx-auto text-center pt-6 shrink-0">
          <p className="text-[10px] text-slate-400 font-semibold leading-normal">
            © 2026 CampusAI OS. Shielding peer-to-peer student accommodations.
          </p>
        </div>

      </div>

    </div>
  );
}
