export interface Hostel {
  id: string;
  name: string;
  location: string;
  distanceToCampus: string; // e.g., "5 mins walk from West Gate"
  price: number; // in Naira, e.g., 220000
  rating: number;
  electricityReliability: "Excellent" | "Good" | "Average" | "Poor";
  wifiAvailable: boolean;
  waterSupply: "24/7 Constant" | "Morning & Evening" | "Irregular";
  securityLevel: "Very High" | "High" | "Moderate";
  images: string[];
  aiMatchScore: number; // Percentage
  aiReasoning: string;
  reviewsCount: number;
  roomsLeft: number;
  features: string[];
  scamRiskScore: number; // Percentage, low is good
  safetyScore: number; // Out of 100
}

export interface SafetyAlert {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  location: string;
  description: string;
  aiAdvice: string;
}

export interface IncidentReport {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status: "Under Review" | "Investigating" | "Resolved";
  isAnonymous: boolean;
  reporterName?: string;
  upvotes: number;
}

export interface RoommateProfile {
  id: string;
  name: string;
  course: string;
  gender: string;
  level: string;
  cleanliness: "Very Clean" | "Moderate" | "Relaxed";
  sleepSchedule: "Early Bird" | "Night Owl" | "Flexible";
  studyHabit: "Quiet Library" | "In-room Study" | "Group Study";
  personality: string[];
  hobbies: string[];
  budgetRange: string;
  matchScore: number;
  avatar: string;
}

export interface DiscussionThread {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  avatar: string;
  content: string;
  category: "General" | "Safety" | "Housing Tips" | "Marketplace";
  replies: number;
  upvotes: number;
  timestamp: string;
}

export interface LostFoundItem {
  id: string;
  title: string;
  status: "Lost" | "Found";
  location: string;
  date: string;
  contact: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface BookingApplication {
  id: string;
  hostelId: string;
  hostelName: string;
  roomType: string;
  price: number;
  appliedDate: string;
  status: "Submitted" | "Documents Verified" | "Payment Completed" | "Booking Confirmed";
  stepIndex: number; // 1 to 4
}

export interface NotificationItem {
  id: string;
  title: string;
  details: string;
  timestamp: string;
  type: "alert" | "match" | "info";
  isRead: boolean;
}

