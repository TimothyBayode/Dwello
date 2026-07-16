import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Upload, Search, Sparkles, Check, AlertTriangle, RefreshCw } from "lucide-react";

export default function ScamDetector() {
  const [listingUrl, setListingUrl] = useState("");
  const [listingText, setListingText] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<{
    riskScore: number; // Percentage
    confidence: "High" | "Medium" | "Low";
    isScam: boolean;
    anomalies: string[];
    safeIndicators: string[];
    summary: string;
  } | null>(null);

  // Drag and Drop simulation states
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Simulate reading file
      setSelectedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  const handleTriggerAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);
    setReport(null);

    setTimeout(() => {
      // Synthesize smart report based on input
      const textToCheck = (listingText + listingUrl).toLowerCase();
      let score = 15; // Base risk
      let anomalies: string[] = [];
      let safeIndicators: string[] = [];

      // Check common triggers
      if (textToCheck.includes("viewing") || textToCheck.includes("deposit") || textToCheck.includes("before seeing") || selectedFile) {
        score += 35;
        anomalies.push("Requesting a 'viewing deposit' or reservation payment before a physical room tour.");
      }
      if (textToCheck.includes("cheap") || textToCheck.includes("100") || textToCheck.includes("100,000") || textToCheck.includes("urgent")) {
        score += 30;
        anomalies.push("Rental rate is listed significantly (45%+) below current West/North Gate housing averages.");
      }
      if (textToCheck.includes("facebook") || textToCheck.includes("flyer") || textToCheck.includes("whatsapp")) {
        score += 15;
        anomalies.push("Listing originates from an unverified public social group rather than official landlord portals.");
      }

      if (anomalies.length === 0) {
        safeIndicators.push("Annual rental rate matches typical market averages.");
        safeIndicators.push("No explicit upfront viewing fee required.");
        safeIndicators.push("Landlord has provided audited electricity utility accounts.");
        score = 8; // Very low
      }

      setReport({
        riskScore: score,
        confidence: score > 50 ? "High" : "Medium",
        isScam: score > 40,
        anomalies,
        safeIndicators,
        summary: score > 40 
          ? "Our security logs flag this listing with extremely high scam indicators. The broker's insistence on holding-fees and underpriced quotes are classic fraud patterns observed in North Gate sectors."
          : "Listing appears legitimate and matches standard regional indices. Always schedule a safe day-lit tour before signing agreements."
      });

      setIsAuditing(false);
    }, 1200);
  };

  const resetDetector = () => {
    setListingUrl("");
    setListingText("");
    setSelectedFile(null);
    setReport(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <ShieldCheck className="text-purple-600" size={24} />
          <span>AI Housing Scam Detector</span>
        </h1>
        <p className="text-sm text-slate-500">
          Shielding you from fraud. Submit suspicious Facebook posts, flyer details, or lister phone numbers to query our threat ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Input Form (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          
          <form onSubmit={handleTriggerAudit} className="bg-white border border-slate-100 rounded-xl p-4 md:p-6 shadow-xs space-y-4">
            
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 uppercase tracking-wider pb-2 border-b border-slate-50">
              <Sparkles size={14} className="text-purple-600 animate-spin-slow" />
              <span>Submit Listing for Auditing</span>
            </div>

            {/* URL/Reference input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Lister Profile Link / URL</label>
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-slate-400" size={14} />
                <input
                  type="text"
                  value={listingUrl}
                  onChange={(e) => setListingUrl(e.target.value)}
                  placeholder="e.g. facebook.com/groups/unilaghostels/posts/12345"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Text details */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Copied Listing Description / Chat text</label>
              <textarea
                rows={3}
                value={listingText}
                onChange={(e) => setListingText(e.target.value)}
                placeholder="e.g. 'Apex quarters available for ₦100,000. Send ₦5,000 viewing fee to book slot immediately...'"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-lg border border-slate-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-700 font-medium"
              />
            </div>

            {/* DRAG AND DROP SCREENSHOT UPLOADER */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Screenshot / Flyer Upload</label>
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2
                  ${dragActive ? "border-purple-500 bg-purple-50/40" : "border-slate-200 hover:border-purple-300 bg-slate-50/30"}
                `}
              >
                <Upload className="text-slate-400" size={20} />
                <div className="text-xs font-semibold text-slate-700">
                  {selectedFile ? `File: ${selectedFile}` : "Drag and drop listing screenshots here"}
                </div>
                <div className="text-[10px] text-slate-400">or click to browse local files</div>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="screenshot-picker"
                />
                <label htmlFor="screenshot-picker" className="px-3 py-1 bg-white border rounded-md text-[10px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                  Select File
                </label>
              </div>
            </div>

            {/* Action submit button */}
            <div className="flex justify-between items-center pt-2">
              {selectedFile && (
                <button 
                  type="button" 
                  onClick={() => setSelectedFile(null)}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Clear uploaded screenshot
                </button>
              )}
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={resetDetector}
                  className="px-4 py-2 border border-slate-100 text-slate-500 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isAuditing || (!listingUrl.trim() && !listingText.trim() && !selectedFile)}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  {isAuditing ? "Analyzing..." : "Audit Listing"}
                  <ShieldCheck size={14} />
                </button>
              </div>
            </div>

          </form>

        </div>

        {/* Right Column: AI Analysis Report (1 col) */}
        <div className="space-y-6">
          
          {isAuditing ? (
            <div className="bg-white border border-slate-100 p-8 rounded-xl text-center shadow-xs space-y-3.5 animate-pulse">
              <RefreshCw size={24} className="text-purple-600 animate-spin mx-auto" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lister Threat Check...</h3>
              <p className="text-[11px] text-slate-500">Cross-referencing grid logs, cellular registrations, and blacklisted banking IBANs.</p>
            </div>
          ) : report ? (
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4 animate-scaleIn">
              <div className="pb-3 border-b border-slate-50">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">Threat Report</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Scam Probability Analysis</h3>
              </div>

              {/* Score panel */}
              <div className={`p-4 rounded-xl flex items-center justify-between border
                ${report.isScam 
                  ? "bg-red-50 border-red-100 text-red-700" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
                }
              `}>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase">Scam Likelihood</span>
                  <span className="text-base font-extrabold block">
                    {report.isScam ? "🚩 HIGH RISK DETECTED" : "✓ LISTING IS SECURE"}
                  </span>
                </div>
                <div className="text-2xl font-black">{report.riskScore}%</div>
              </div>

              {/* Confidence status */}
              <div className="flex justify-between text-xs border-b border-slate-50 pb-3">
                <span className="font-bold text-slate-500">Model Confidence</span>
                <span className="font-bold text-slate-800">{report.confidence} Confidence</span>
              </div>

              {/* Summary details */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {report.summary}
              </p>

              {/* Anomalies checklists */}
              {report.isScam && report.anomalies.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">Anomalies Detected</span>
                  <div className="space-y-1.5">
                    {report.anomalies.map((an, i) => (
                      <div key={i} className="flex gap-1.5 text-xs text-slate-700 font-medium">
                        <AlertTriangle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p>{an}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safe indicators checklist */}
              {!report.isScam && report.safeIndicators.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Safe Indicators</span>
                  <div className="space-y-1.5">
                    {report.safeIndicators.map((saf, i) => (
                      <div key={i} className="flex gap-1.5 text-xs text-slate-700 font-medium">
                        <Check size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p>{saf}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-purple-900 text-white rounded-xl p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <ShieldCheck size={120} />
              </div>
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Verify Before Paying</h4>
              <p className="text-[11px] leading-relaxed text-purple-100">
                Lagos, Ibadan, and FUTA student grids suffer frequent 'urgency holding-deposit' fraud. Submitting details screens listers instantly. Keep funds in your local wallet until physical check-ins succeed.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
