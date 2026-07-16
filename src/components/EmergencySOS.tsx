import React, { useState, useEffect } from "react";
import { PhoneCall, ShieldAlert, AlertOctagon, HeartHandshake, Compass, Volume2, HelpCircle, Send, Check } from "lucide-react";

export default function EmergencySOS() {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const [secMessages, setSecMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const [replyInput, setReplyInput] = useState("");

  const hotlines = [
    { name: "Campus Security Central Dispatch", num: "+234 803 111 2222", role: "Armed patrol & gate intercept" },
    { name: "University Medical Ambulance", num: "+234 805 333 4444", role: "24/7 First Aid & clinical transfer" },
    { name: "Dean of Student Affairs", num: "+234 701 555 6666", role: "Student welfare & hostel regulatory" },
    { name: "Local Area Division Command", num: "+234 812 777 8888", role: "External police support" }
  ];

  // SOS Countdown Timer
  useEffect(() => {
    let timer: any;
    if (sosActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (sosActive && countdown === 0) {
      setIsTriggered(true);
      setSosActive(false);
      // Initialize warden response message
      setSecMessages([
        { 
          sender: "Marshal Kunle (Security Hub)", 
          text: "TIMOTHY, distress ping registered at West Gate coordinate node near Crown Heights. A safety response vehicle has been dispatched. Are you in a secure compound? Respond here.", 
          time: "Just Now" 
        }
      ]);
    }
    return () => clearTimeout(timer);
  }, [sosActive, countdown]);

  const handleTriggerSOS = () => {
    setSosActive(true);
    setCountdown(5);
    setIsTriggered(false);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setCountdown(5);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    const userMsg = replyInput;
    setSecMessages(prev => [...prev, { sender: "Timothy Bayode (User)", text: userMsg, time: "Just Now" }]);
    setReplyInput("");

    // Simulate marshal response
    setTimeout(() => {
      setSecMessages(prev => [
        ...prev, 
        { 
          sender: "Marshal Kunle (Security Hub)", 
          text: "Copy that. Stay inside the lodge compound. The response patrol cart is passing the North Gate feeder junction now. Est. arrival in 3 minutes.", 
          time: "Just Now" 
        }
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <AlertOctagon className="text-red-600 animate-pulse" size={24} />
          <span>Emergency SOS Center</span>
        </h1>
        <p className="text-sm text-slate-500">
          Immediate, high-priority emergency support. Triggering distress beacons broadcasts encrypted geofence coordinates to all security patrol trucks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Distress Beacon Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs text-center">
          
          {!sosActive && !isTriggered ? (
            <div className="space-y-6 py-6 animate-fadeIn">
              <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-50 text-red-600 animate-pulse">
                <ShieldAlert size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900">Need Immediate Safety Support?</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Pressing the button below locks onto your location and coordinates. It alerts the security control board and nearby student wardens.
                </p>
              </div>
              <button
                onClick={handleTriggerSOS}
                className="mx-auto px-6 md:px-8 py-3 md:py-5 bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 text-white font-extrabold text-xs md:text-sm rounded-2xl transition-all shadow-lg shadow-red-600/30 tracking-wider uppercase flex items-center gap-2"
              >
                <AlertOctagon size={16} className="animate-pulse" />
                <span>Emergency SOS</span>
              </button>
            </div>
          ) : sosActive ? (
            <div className="space-y-6 py-8 animate-scaleIn bg-red-50/50 rounded-2xl border border-red-100">
              <div className="text-5xl font-black text-red-600 animate-bounce">
                {countdown}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-red-900 uppercase tracking-wide">Broadcasting Beacon in...</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click 'Cancel Signal' immediately if you misclicked. Otherwise, dispatch units will head to your IP geofence.
                </p>
              </div>
              <button
                onClick={handleCancelSOS}
                className="mx-auto px-4 md:px-6 py-2 md:py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] md:text-xs rounded-xl transition-all uppercase tracking-wider"
              >
                Cancel Signal
              </button>
            </div>
          ) : (
            <div className="space-y-6 py-6 animate-fadeIn bg-emerald-50/30 rounded-2xl border border-emerald-100">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-emerald-50 text-emerald-600 animate-pulse">
                <Check size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-emerald-900 uppercase">Emergency Distress Active</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your coordinates are locked. Campus safety patrol team has acknowledged and marked Timothy Bayode as priority response.
                </p>
              </div>

              {/* Secure Chat Liaison with Security Hub */}
              <div className="bg-white border border-slate-100 rounded-xl p-4 text-left max-w-md mx-auto space-y-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-b pb-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>Security Hub Live Terminal</span>
                </div>

                <div className="space-y-3 max-h-[150px] overflow-y-auto">
                  {secMessages.map((msg, i) => (
                    <div key={i} className="text-xs space-y-0.5">
                      <span className="font-bold text-slate-800 text-[10px] block">{msg.sender}</span>
                      <p className="bg-slate-100 text-slate-700 p-2.5 rounded-lg font-medium leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Provide safety update (e.g. Locked in room)"
                    className="flex-1 bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs focus:outline-none"
                  />
                  <button type="submit" className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500">
                    <Send size={12} />
                  </button>
                </form>
              </div>

              <button
                onClick={resetDistress}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Mark Incident as Safe & Resolved
              </button>
            </div>
          )}

          {/* GPS Coordinates telemetry indicators (Reference image style but simplified) */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <Compass className="text-purple-600" size={18} />
              <div className="text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Latitude / Longitude</span>
                <span className="text-xs font-extrabold text-slate-800">7.5258° N, 4.5230° E</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <Volume2 className="text-purple-600" size={18} />
              <div className="text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Lodge Sector</span>
                <span className="text-xs font-extrabold text-slate-800">West Gate North</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Hotlines list */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Emergency Directory</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Instant telephone dispatch hotline routing.</p>
          </div>

          <div className="space-y-4">
            {hotlines.map((hot, idx) => (
              <div key={idx} className="space-y-1 pb-3 last:pb-0 border-b last:border-b-0 border-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{hot.name}</span>
                  <a 
                    href={`tel:${hot.num}`}
                    className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    <PhoneCall size={12} />
                  </a>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">{hot.role}</p>
                <span className="text-[11px] font-extrabold text-slate-700 block">{hot.num}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );

  function resetDistress() {
    setIsTriggered(false);
    setSosActive(false);
    setCountdown(5);
    setSecMessages([]);
  }
}
