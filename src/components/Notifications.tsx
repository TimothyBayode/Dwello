import React, { useState } from "react";
import { NotificationItem } from "../types";
import { Bell, Check, Trash2, ShieldAlert, Sparkles, UserPlus, Info } from "lucide-react";

interface NotificationsProps {
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onClearNotification?: (id: string) => void;
}

export default function Notifications({ notifications, onMarkAllAsRead, onClearNotification }: NotificationsProps) {
  const [unreadList, setUnreadList] = useState<string[]>(notifications.filter(n => !n.isRead).map(n => n.id));
  const [items, setItems] = useState<NotificationItem[]>(notifications);

  const handleMarkAll = () => {
    setUnreadList([]);
    if (onMarkAllAsRead) onMarkAllAsRead();
  };

  const handleClearItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (onClearNotification) onClearNotification(id);
  };

  const toggleReadItem = (id: string) => {
    setUnreadList(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bell className="text-purple-600" size={24} />
            <span>Alert & Safety Inbox</span>
          </h1>
          <p className="text-sm text-slate-500">
            Real-time notifications regarding rent verifications, emergency updates, or compatibility matches.
          </p>
        </div>
        <button
          onClick={handleMarkAll}
          disabled={unreadList.length === 0}
          className="px-3 py-1.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors flex items-center gap-1 border border-purple-100/50"
        >
          <Check size={14} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs italic">
            Your notifications feed is currently empty. Keep an eye out for security warnings!
          </div>
        ) : (
          items.map((not) => {
            const isUnread = unreadList.includes(not.id);
            return (
              <div 
                key={not.id}
                onClick={() => toggleReadItem(not.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3.5 items-start relative overflow-hidden
                  ${isUnread 
                    ? "bg-purple-50/20 border-purple-100/40 shadow-2xs font-semibold" 
                    : "bg-white border-slate-50 shadow-3xs"
                  }
                `}
              >
                {/* Visual Unread dot indicator */}
                {isUnread && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-600" />
                )}

                {/* Left categorised icon */}
                <div className={`p-2 rounded-lg flex-shrink-0
                  ${not.type === "alert" 
                    ? "bg-red-50 text-red-600" 
                    : not.type === "match" 
                      ? "bg-purple-50 text-purple-600" 
                      : "bg-blue-50 text-blue-600"
                  }
                `}>
                  {not.type === "alert" ? (
                    <ShieldAlert size={16} />
                  ) : not.type === "match" ? (
                    <UserPlus size={16} />
                  ) : (
                    <Info size={16} />
                  )}
                </div>

                {/* Body info */}
                <div className="flex-1 space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{not.title}</h3>
                    <span className="text-[9px] text-slate-400 font-bold">{not.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{not.details}</p>
                </div>

                {/* Clear action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearItem(not.id);
                  }}
                  className="text-slate-300 hover:text-red-500 p-1 rounded-md transition-colors"
                  title="Remove notification"
                >
                  <Trash2 size={13} />
                </button>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
