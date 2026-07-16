import React, { useState, useRef, useEffect } from "react";
import { MessageSquareCode, Send, Sparkles, User, HelpCircle, ArrowRight } from "lucide-react";
import { ChatMessage } from "../types";

export default function CampusAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "ai",
      content: "Hello Timothy! I am your CampusAI Assistant. I can help you search for hostels with constant electricity, analyze campus crime maps, audit suspicious listings for scams, or summarize student feedback. What would you like to explore today?",
      timestamp: "09:30 AM"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "What documents do I need for hostel bookings?",
    "Tell me about the power grid at South Gate",
    "How does the Scam Detector algorithm calculate risk?",
    "How can I request a late-night security escort?"
  ];

  const handlePromptClick = (p: string) => {
    sendMessage(p);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
  };

  const sendMessage = (text: string) => {
    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 2. Generate simulated intelligent response after delay
    setTimeout(() => {
      let responseText = "";
      const query = text.toLowerCase();

      if (query.includes("document") || query.includes("book")) {
        responseText = "To finalize a hostel booking on CampusAI, you will need:\n1. Your **University Admission Letter** (or current Student ID)\n2. A signed digital **Lodge Conduct Agreement**\n3. Proof of rent payment (held securely in our escrow ledger until you physically move in).\nWe do not release funds to the landlord until your 48-hour check-in inspection succeeds!";
      } else if (query.includes("power") || query.includes("electricity") || query.includes("south gate")) {
        responseText = "South Gate relies primarily on the municipal grid feeder, resulting in approx. 8-10 hours of daily electricity (often irregular). This is why buildings like **Emerald Court** have lower AI compatibility scores (78%) for Computer Science majors. If power is crucial, I recommend focusing on **Crown Heights Premium Lodge** which operates 24/7 solar-inverter and generator back-ups.";
      } else if (query.includes("scam") || query.includes("algorithm")) {
        responseText = "Our **Scam Detector engine** parses listing texts and uploaded screenshots. It calculates risk by checking for:\n- Requesting 'viewing deposits' before room checks (high risk indicator)\n- Rent prices 30%+ below local market standards\n- Blacklisted phone numbers or suspicious lister profiles.\nIf a listing is safe, we display a high confidence score!";
      } else if (query.includes("escort") || query.includes("walk") || query.includes("patrol")) {
        responseText = "To request a late-night security escort, you can use the **Emergency SOS** tab in this applet. The 'Safe-Walk' team is active between 9:00 PM and 2:00 AM daily. Simply trigger a SOS ping or dial **+234 803 111 2222** directly from the sidebar directory to summon a guard escort.";
      } else {
        responseText = "That is a great question, Timothy! Based on your Computer Science major, I am constantly monitoring local accommodations for high fiber-optic internet availability and backup solar rigs. Let me know if you would like me to list hostels with active fiber WiFi or compare pricing profiles.";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl h-[calc(100vh-120px)] flex flex-col shadow-xs overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
            <MessageSquareCode size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
              <span>Campus Assistant</span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[8px]">ACTIVE AI</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Synced with university safety and utility logs</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "self-end ml-auto flex-row-reverse"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border shadow-xs
                ${isAI ? "bg-purple-50 border-purple-100 text-purple-700" : "bg-slate-900 border-slate-800 text-white"}
              `}>
                {isAI ? <Sparkles size={14} className="animate-spin-slow" /> : <User size={14} />}
              </div>

              <div className="space-y-1">
                <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs
                  ${isAI 
                    ? "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100" 
                    : "bg-purple-600 text-white rounded-tr-none"
                  }
                `}>
                  {/* Handle newlines nicely */}
                  {msg.content.split("\n").map((para, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-2" : ""}>{para}</p>
                  ))}
                </div>
                <span className={`text-[9px] font-medium text-slate-400 block ${isAI ? "text-left" : "text-right"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%] self-start animate-fadeIn">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-50 border border-purple-100 text-purple-700 shadow-xs">
              <Sparkles size={14} className="animate-spin-slow" />
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-[10px] text-slate-400 font-semibold pl-1">Assistant is reasoning...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested quick Prompts Overlay & Input */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3.5">
        
        {/* Quick buttons */}
        {messages.length < 5 && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Suggested Queries</span>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(p)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-100 hover:border-purple-200 text-[11px] font-semibold text-slate-600 hover:text-purple-700 transition-all text-left flex items-center gap-1 shadow-2xs"
                >
                  <span>{p}</span>
                  <ArrowRight size={10} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question about hostels, safety escorts, or roommate criteria..."
            className="flex-1 bg-white border border-slate-100 p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-slate-800 placeholder-slate-400 transition-all shadow-2xs"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-300 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <span>Send</span>
            <Send size={12} />
          </button>
        </form>
      </div>

    </div>
  );
}
