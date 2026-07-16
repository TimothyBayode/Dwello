import React from "react";
import { BookingApplication } from "../types";
import { FileText, CheckCircle2, ShieldCheck, Phone, Download, MapPin } from "lucide-react";

interface MyApplicationsProps {
  applications: BookingApplication[];
  onCancelApplication?: (id: string) => void;
}

export default function MyApplications({ applications }: MyApplicationsProps) {
  const steps = [
    { label: "Submitted", desc: "Form & ID received" },
    { label: "Docs Verified", desc: "School records verified" },
    { label: "Payment Settled", desc: "Escrow wallet funded" },
    { label: "Confirmed", desc: "Room keys allocated" }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <FileText className="text-purple-600" size={24} />
          <span>My Rental Applications</span>
        </h1>
        <p className="text-sm text-slate-500">
          Track active housing reservations, document verifications, and secure escrow deposit disbursements.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 text-center rounded-2xl space-y-4 shadow-xs">
          <FileText className="mx-auto text-slate-300" size={48} />
          <h3 className="text-base font-extrabold text-slate-800">No Booking Applications Active</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't initiated any secure bookings yet. Head to the 'Browse Hostels' or 'AI Matchmaker' tabs to find verified student chambers.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              
              {/* Application Header details */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Application Node: #{app.id}</span>
                  <h3 className="text-base font-black text-slate-900">{app.hostelName}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{app.roomType} • Applied: {app.appliedDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Annual Rent Escrow</span>
                  <span className="text-base font-black text-slate-950">₦{app.price.toLocaleString()}</span>
                </div>
              </div>

              {/* PROGRESS BAR TRACKER (SaaS visual layout) */}
              <div className="py-4">
                <div className="grid grid-cols-4 gap-2 relative">
                  
                  {/* Background progress bars */}
                  <div className="absolute top-[14px] left-[12.5%] right-[12.5%] h-1 bg-slate-100 -z-10" />
                  <div 
                    className="absolute top-[14px] left-[12.5%] h-1 bg-purple-600 -z-10 transition-all duration-500" 
                    style={{ width: `${((app.stepIndex - 1) / 3) * 75}%` }}
                  />

                  {steps.map((st, i) => {
                    const isCompleted = i + 1 < app.stepIndex;
                    const isActive = i + 1 === app.stepIndex;
                    return (
                      <div key={i} className="flex flex-col items-center text-center space-y-1">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-colors
                          ${isCompleted 
                            ? "bg-purple-600 border-purple-600 text-white" 
                            : isActive 
                              ? "bg-white border-purple-600 text-purple-700 ring-4 ring-purple-50" 
                              : "bg-white border-slate-200 text-slate-400"
                          }
                        `}>
                          {isCompleted ? "✓" : i + 1}
                        </div>
                        <span className={`text-[10px] font-bold ${isActive ? "text-purple-700" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                          {st.label}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium max-w-[80px] hidden md:block">{st.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contract Liaison & downloads */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <ShieldCheck size={16} className="text-purple-600 flex-shrink-0" />
                  <span>Escrow held securely by CampusAI safety board. Under protection rules.</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3.5 py-1.5 bg-white border hover:bg-slate-50 text-slate-600 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1">
                    <Download size={12} />
                    <span>Download Agreement PDF</span>
                  </button>
                  <button className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1">
                    <Phone size={12} />
                    <span>Contact Auditor Warden</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
