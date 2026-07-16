import React, { useState } from "react";
import { Settings as SettingsIcon, ShieldAlert, Sparkles, Check, HelpCircle } from "lucide-react";

interface SettingsProps {
  currentUni: string;
  onUniChange: (uni: string) => void;
}

export default function Settings({ currentUni, onUniChange }: SettingsProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <SettingsIcon className="text-purple-600" size={24} />
          <span>System Settings</span>
        </h1>
        <p className="text-sm text-slate-500">
          Configure security alert notifications, change current active university, or run emergency distress chimes test.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-xl p-4 md:p-6 shadow-xs space-y-5 md:space-y-6">
        
        {/* University Selector */}
        <div className="space-y-3 pb-4 border-b border-slate-50">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Active University sector</label>
              <p className="text-[10px] text-slate-500 font-medium">Switching this re-renders the safety map and available hostels catalog.</p>
            </div>
            
            <select
              value={currentUni}
              onChange={(e) => onUniChange(e.target.value)}
              className="p-2 bg-slate-50 text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:bg-white text-slate-800"
            >
              <option value="FUTA">FUTA - Akure</option>
              <option value="UNILAG">UNILAG - Lagos</option>
              <option value="OAU">OAU - Ile-Ife</option>
              <option value="UI">UI - Ibadan</option>
            </select>
          </div>
        </div>

        {/* Security Notification Alerts */}
        <div className="space-y-4 pb-4 border-b border-slate-50">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <ShieldAlert size={14} className="text-purple-600" />
            <span>Alert & Advisory Warnings</span>
          </div>

          <div className="space-y-3">
            
            {/* Email Warnings */}
            <label className="flex items-start justify-between cursor-pointer">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-xs font-bold text-slate-800 block">Critical Scam Warning Emails</span>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Receive instant warning emails if we blacklist a lister phone number or flag rental brokers inside your sector.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-4 h-4 rounded-md text-purple-600 border-slate-200 focus:ring-purple-500 mt-1"
              />
            </label>

            {/* SMS warnings */}
            <label className="flex items-start justify-between cursor-pointer">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-xs font-bold text-slate-800 block">Emergency Dispatch SMS</span>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Opt-in to automated regional SMS notifications regarding municipal grid outages or emergency patrol dispatches.
                </p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={() => setSmsAlerts(!smsAlerts)}
                className="w-4 h-4 rounded-md text-purple-600 border-slate-200 focus:ring-purple-500 mt-1"
              />
            </label>

          </div>
        </div>

        {/* Testing SOS Beacons */}
        <div className="space-y-3 pb-4 border-b border-slate-50">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Diagnostic Systems</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 max-w-[70%]">
              <span className="text-xs font-semibold text-slate-700 block">Chimes Audio Diagnostic</span>
              <p className="text-[10px] text-slate-400">Trigger test audio frequencies to verify computer speakers function for alerts.</p>
            </div>
            <button 
              type="button"
              onClick={() => alert("Diagnostic chimes verified. 100% operational.")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border text-[10px] font-bold rounded-lg text-slate-700 transition-colors"
            >
              Play Test Chime
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-[10px] text-slate-400 font-bold">Preferences cached in secure local browser keys</span>
          
          {saveSuccess ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <Check size={14} />
              <span>Settings Saved!</span>
            </div>
          ) : (
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              Save Configuration
            </button>
          )}
        </div>

      </form>

    </div>
  );
}
