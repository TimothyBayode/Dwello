import React, { useState, useEffect } from "react";
import { User, Phone, Mail, Award, CheckCircle, ShieldCheck, Sparkles, BookOpen, Camera, Loader2 } from "lucide-react";
import { uploadImageToCloudinary } from "../lib/cloudinary";
import { isFirebaseConfigured, getFirebaseDb } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ProfileProps {
  currentUser: {
    uid: string;
    email: string | null;
    displayName: string;
    university: string;
    avatarUrl?: string;
  } | null;
  onUpdateProfile: (updated: { displayName?: string; university?: string; avatarUrl?: string }) => Promise<void>;
}

export default function Profile({ currentUser, onUpdateProfile }: ProfileProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      setUniversity(currentUser.university || "");
      setAvatarUrl(currentUser.avatarUrl || "");
      
      // Fetch other firestore specific details if configured
      if (isFirebaseConfigured()) {
        const db = getFirebaseDb();
        if (db) {
          getDoc(doc(db, "users", currentUser.uid)).then((docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.phone) setPhone(data.phone);
              if (data.emergencyName) setEmergencyName(data.emergencyName);
              if (data.emergencyPhone) setEmergencyPhone(data.emergencyPhone);
            }
          }).catch(err => {
            console.error("Error fetching detailed user profile:", err);
          });
        }
      }
    }
  }, [currentUser?.uid, currentUser?.displayName, currentUser?.email, currentUser?.university, currentUser?.avatarUrl]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (currentUser && isFirebaseConfigured()) {
        const db = getFirebaseDb();
        if (db) {
          await setDoc(doc(db, "users", currentUser.uid), {
            fullName,
            university,
            phone,
            emergencyName,
            emergencyPhone,
            avatarUrl
          }, { merge: true });
        }
      }
      await onUpdateProfile({ displayName: fullName, university, avatarUrl });
      setSaveSuccess(true);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      setAvatarUrl(uploadedUrl);
      
      // Auto save avatarUrl to firestore if authenticated
      if (currentUser && isFirebaseConfigured()) {
        const db = getFirebaseDb();
        if (db) {
          await setDoc(doc(db, "users", currentUser.uid), {
            avatarUrl: uploadedUrl
          }, { merge: true });
        }
      }
      await onUpdateProfile({ avatarUrl: uploadedUrl });
    } catch (err) {
      console.error("Avatar change failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <User className="text-purple-600" size={24} />
          <span>My Verified Profile</span>
        </h1>
        <p className="text-sm text-slate-500">
          Manage your verified credentials, academic affiliation parameters, and emergency distress contact dispatch numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Avatar & Verification status (1 col) */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 md:p-6 shadow-xs text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto group">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={fullName} 
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 group-hover:opacity-80 transition-opacity" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-purple-100 border-4 border-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">
                {fullName?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            {isUploading ? (
              <div className="absolute inset-0 bg-slate-900/50 rounded-full flex items-center justify-center text-white">
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : (
              <label className="absolute inset-0 rounded-full bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                <Camera size={18} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
            )}
            <span className="absolute bottom-1 right-1 p-1 bg-purple-600 text-white rounded-full border border-white" title="Verified Student">
              <CheckCircle size={14} />
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">{fullName}</h3>
            <p className="text-xs text-slate-400 font-semibold">Computer Science • Level 300</p>
            <p className="text-[10px] text-slate-500 font-bold">
              {university === "LAUTECH" ? "Ladoke Akintola University of Technology" : university === "FUTA" ? "Federal University of Technology, Akure" : university} Student
            </p>
          </div>

          <div className="p-3 bg-purple-50/70 border border-purple-100/50 rounded-xl flex items-center gap-2 text-left">
            <ShieldCheck className="text-purple-600 flex-shrink-0" size={16} />
            <div className="text-[10px] font-semibold text-slate-700 leading-relaxed">
              Academic ID verified against school database logs. Verified security level: **Priority Safe-Walk Escort**.
            </div>
          </div>

          {/* Core compatible traits */}
          <div className="space-y-2 text-left pt-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">My Matching Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {["Python", "React", "Night Owl", "Quiet Study", "Boardgames"].map((tag, i) => (
                <span key={i} className="text-[9px] font-bold text-purple-700 bg-purple-50/50 border border-purple-100/40 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Information form (2 cols) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-xl p-4 md:p-6 shadow-xs space-y-5 md:space-y-6">
            
            {/* Account information */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
                <BookOpen size={14} className="text-purple-600" />
                <span>Affiliated Contact Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 text-slate-400" size={14} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">University Affiliation</label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-800 font-bold"
                  >
                    <option value="FUTA">FUTA - Akure</option>
                    <option value="UNILAG">UNILAG - Lagos</option>
                    <option value="OAU">OAU - Ile-Ife</option>
                    <option value="UI">UI - Ibadan</option>
                    <option value="LAUTECH">LAUTECH - Ogbomoso</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Personal Phone Number</label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 text-slate-400" size={14} />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">University Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 text-slate-400" size={14} />
                    <input
                      type="email"
                      required
                      value={email}
                      disabled
                      className="w-full pl-9 pr-3 py-2 bg-slate-100 text-xs rounded-lg border border-slate-100 cursor-not-allowed text-slate-500 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency contacts details */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-1 text-xs font-bold text-red-800 uppercase tracking-wider border-b pb-2">
                <Phone size={14} className="text-red-500" />
                <span>Next-of-Kin Emergency Contacts</span>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                In critical distress scenarios where SOS is triggered and your phone lines are offline, campus marshals call this contact immediately.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Emergency Next of Kin Name</label>
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Kin Telephone Number</label>
                  <input
                    type="text"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-[10px] text-slate-400 font-bold">Modifying these fields re-signs credentials locally</span>
              
              {saveSuccess ? (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle size={14} />
                  <span>Profile Updated!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={12} className="animate-spin" />}
                  <span>Save Profile Settings</span>
                </button>
              )}
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
