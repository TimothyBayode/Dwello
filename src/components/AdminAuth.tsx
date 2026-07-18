import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { getFirebaseAuth, getFirebaseDb } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AdminAuthProps {
  onLoginSuccess: (user: { uid: string; email: string | null; displayName: string }) => void;
  onBack: () => void;
}

export default function AdminAuth({ onLoginSuccess, onBack }: AdminAuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your admin email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error("Firebase is not configured. Use demo mode below.");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check Firestore admins collection for role verification
      const db = getFirebaseDb();
      let isAdmin = false;

      if (db) {
        const docRef = doc(db, "admins", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data()?.role === "admin") {
          isAdmin = true;
        }

        // Also check an admins-by-email collection as fallback
        if (!isAdmin) {
          const emailDocRef = doc(db, "admins", user.email?.replace(/\./g, ",") || "");
          const emailDocSnap = await getDoc(emailDocRef);
          if (emailDocSnap.exists() && emailDocSnap.data()?.role === "admin") {
            isAdmin = true;
          }
        }
      }

      if (!isAdmin) {
        await auth.signOut();
        setError("Access Denied — this account does not have admin privileges.");
        setIsLoading(false);
        return;
      }

      onLoginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Admin",
      });
    } catch (err: any) {
      if (err.message === "Firebase is not configured. Use demo mode below.") {
        setError(err.message);
      } else {
        const code = err.code;
        if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
          setError("No admin account found with these credentials.");
        } else if (code === "auth/wrong-password") {
          setError("Incorrect password.");
        } else if (code === "auth/too-many-requests") {
          setError("Too many attempts. Please try again later.");
        } else {
          setError(err.message || "Authentication failed.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      uid: "admin-demo-001",
      email: "admin@dwello",
      displayName: "Super Admin",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to home</span>
        </button>

        {/* Auth card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-200">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
              <p className="text-xs text-slate-500 mt-1">Sign in with your admin credentials</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-medium">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Admin Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@dwello"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800 placeholder-slate-400"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-400 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> Verifying...</>
              ) : (
                <><ShieldCheck size={14} /> Sign in as Admin</>
              )}
            </button>
          </form>

          {/* Demo mode */}
          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl border border-slate-100 transition-colors cursor-pointer"
          >
            Continue as Demo Admin
          </button>
        </div>
      </div>
    </div>
  );
}
