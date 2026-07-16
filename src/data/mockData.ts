import { Hostel, SafetyAlert, IncidentReport, RoommateProfile, DiscussionThread, LostFoundItem } from "../types";

export const hostelsData: Hostel[] = [
  {
    id: "h1",
    name: "Crown Heights Premium Lodge",
    location: "West Gate Area, 4 mins walk to Campus",
    distanceToCampus: "4 mins walk (West Gate)",
    price: 320000,
    rating: 4.8,
    electricityReliability: "Excellent",
    wifiAvailable: true,
    waterSupply: "24/7 Constant",
    securityLevel: "Very High",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
    ],
    aiMatchScore: 98,
    aiReasoning: "Excellent electricity (20h+/day) is perfect for your computer science programming rigs, and its proximity to West Gate gives you a direct, safe pathway to the Computer Science & Engineering labs.",
    reviewsCount: 42,
    roomsLeft: 3,
    features: ["Prepaid Meter", "Standby Generator", "High-speed Fiber WiFi", "24/7 Armed Security", "Study Common Room"],
    scamRiskScore: 2,
    safetyScore: 96
  },
  {
    id: "h2",
    name: "Lighthouse Student Suites",
    location: "North Gate, near Faculty of Technology",
    distanceToCampus: "6 mins walk (North Gate)",
    price: 240000,
    rating: 4.5,
    electricityReliability: "Good",
    wifiAvailable: true,
    waterSupply: "Morning & Evening",
    securityLevel: "High",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
    ],
    aiMatchScore: 91,
    aiReasoning: "A great value option. Strong solar-inverter power backup for light and laptops is a huge plus. Conveniently close to the tech wing, though water is supplied in shift hours.",
    reviewsCount: 31,
    roomsLeft: 5,
    features: ["Solar Inverter Setup", "Fenced & Gated", "Water Borehole", "CCTV Surveillance", "Shared Kitchen"],
    scamRiskScore: 5,
    safetyScore: 89
  },
  {
    id: "h3",
    name: "Emerald Court Residency",
    location: "South Gate Residential Layout",
    distanceToCampus: "12 mins shuttle ride",
    price: 180000,
    rating: 4.2,
    electricityReliability: "Average",
    wifiAvailable: false,
    waterSupply: "Morning & Evening",
    securityLevel: "Moderate",
    images: [
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80"
    ],
    aiMatchScore: 78,
    aiReasoning: "Highly affordable, but electricity is subject to the local grid schedule (approx. 8 hours/day) and requires a shuttle ride. Might require you to purchase a personal router/data plan.",
    reviewsCount: 19,
    roomsLeft: 8,
    features: ["Gated Compound", "Spacious Rooms", "Borehole Water", "Self-Contain Units"],
    scamRiskScore: 12,
    safetyScore: 75
  },
  {
    id: "h4",
    name: "Ivory Private Heights",
    location: "Estate Phase II, East Gate vicinity",
    distanceToCampus: "8 mins walk (East Gate)",
    price: 450000,
    rating: 4.9,
    electricityReliability: "Excellent",
    wifiAvailable: true,
    waterSupply: "24/7 Constant",
    securityLevel: "Very High",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    ],
    aiMatchScore: 94,
    aiReasoning: "Luxurious, fully serviced apartment with dedicated AC, generator, and high-speed internet. Exceptional security (electronic card gates). The premium pricing is the only hurdle for a student budget.",
    reviewsCount: 28,
    roomsLeft: 2,
    features: ["Dedicated Generator", "In-unit Kitchen", "Air Conditioning", "Card Access Control", "Gym & Lounge Access"],
    scamRiskScore: 1,
    safetyScore: 98
  },
  {
    id: "h5",
    name: "Apex Scholar Quarters",
    location: "Academic Boulevard (Near Main Library)",
    distanceToCampus: "2 mins walk (Central)",
    price: 210000,
    rating: 4.0,
    electricityReliability: "Average",
    wifiAvailable: false,
    waterSupply: "Irregular",
    securityLevel: "High",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80"
    ],
    aiMatchScore: 84,
    aiReasoning: "Unmatched library and lab proximity, but water pressure is irregular, and power relies strictly on school generator schedules. Safe and strictly regulated by the student affairs board.",
    reviewsCount: 15,
    roomsLeft: 12,
    features: ["School-managed Safety", "Library Access", "Central Waste System", "No Shuttle Costs"],
    scamRiskScore: 0,
    safetyScore: 92
  }
];

export const safetyAlertsData: SafetyAlert[] = [
  {
    id: "a1",
    title: "Suspicious Solicitation Reported",
    severity: "critical",
    timestamp: "1 hour ago",
    location: "North Gate Shuttle Stop",
    description: "Two individuals pretending to be housing agents are collecting cash payments for non-existent rooms in North Gate area. They claim to be working with 'Varsity Estates Ltd'.",
    aiAdvice: "Do not pay any agent cash directly on the street. All verified CampusAI landlords handle bookings electronically through the platform secure escrow portal."
  },
  {
    id: "a2",
    title: "Active Power Grid Maintenance",
    severity: "info",
    timestamp: "4 hours ago",
    location: "South Gate Feeder",
    description: "Local utility company is conducting transformer upgrades affecting South Gate residential quarters. Supply will be restored by 6:00 PM.",
    aiAdvice: "If you have coding assignments or lectures, head to the Main Library common rooms or Crown Heights Lodge lobby which has active generator backup."
  },
  {
    id: "a3",
    title: "Inclement Weather: Street Flooding",
    severity: "warning",
    timestamp: "Yesterday",
    location: "Underpass linking West Gate to Market Road",
    description: "Heavy downpours have caused minor flooding. Shuttles are currently rerouting through the Main Gate express lane.",
    aiAdvice: "Pedestrians should avoid the Underpass route. Use the pedestrian overhead bridge for safety."
  },
  {
    id: "a4",
    title: "Late-Night Escort Patrols Active",
    severity: "info",
    timestamp: "2 days ago",
    location: "All Campus Gates",
    description: "University Security has activated the 'Safe-Walk' night escort services between 9:00 PM and 2:00 AM daily.",
    aiAdvice: "Call Campus Security on emergency hotlines or press the Emergency SOS button in this app to request an escort if walking alone."
  }
];

export const initialIncidents: IncidentReport[] = [
  {
    id: "r1",
    category: "Scam Attempt",
    title: "Fake Facebook Lister 'Kalu Prince'",
    description: "Offered a room at Apex Quarters for ₦100,000. Insisted I transfer a 'viewing deposit' before seeing the room. Disappeared when I asked for a CampusAI verification code.",
    location: "Online / Facebook Group",
    timestamp: "2026-07-13",
    status: "Resolved",
    isAnonymous: false,
    reporterName: "Timothy Bayode",
    upvotes: 24
  },
  {
    id: "r2",
    category: "Safety Hazard",
    title: "Broken Streetlight at West Gate dark corner",
    description: "The streetlamp near the junction leading to Crown Heights is completely dead, making the walk very dark after 7 PM.",
    location: "West Gate Pathway Junction",
    timestamp: "2026-07-12",
    status: "Investigating",
    isAnonymous: true,
    upvotes: 45
  },
  {
    id: "r3",
    category: "Disturbance",
    title: "Heavy Noise from Event Center on Weekdays",
    description: "A local bar near South Gate is blasting music till 2:00 AM on Wednesday exam nights, disturbing students in nearby lodges.",
    location: "South Gate Main Road",
    timestamp: "2026-07-11",
    status: "Under Review",
    isAnonymous: false,
    reporterName: "Sarah Alao",
    upvotes: 18
  }
];

export const roommatesData: RoommateProfile[] = [
  {
    id: "rm1",
    name: "Adebayo Adesina",
    course: "Electrical Engineering",
    gender: "Male",
    level: "400 Level",
    cleanliness: "Very Clean",
    sleepSchedule: "Night Owl",
    studyHabit: "In-room Study",
    personality: ["Studious", "Introvert", "Quiet"],
    hobbies: ["Coding", "Chess", "Anime"],
    budgetRange: "₦200,000 - ₦300,000",
    matchScore: 94,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "rm2",
    name: "Emeka Okafor",
    course: "Computer Science",
    gender: "Male",
    level: "300 Level",
    cleanliness: "Moderate",
    sleepSchedule: "Flexible",
    studyHabit: "Group Study",
    personality: ["Outgoing", "Talkative", "Collaborative"],
    hobbies: ["Gaming", "Football", "Music Production"],
    budgetRange: "₦250,000 - ₦350,000",
    matchScore: 89,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "rm3",
    name: "Daniel Peters",
    course: "Economics",
    gender: "Male",
    level: "200 Level",
    cleanliness: "Very Clean",
    sleepSchedule: "Early Bird",
    studyHabit: "Quiet Library",
    personality: ["Organized", "Reserved", "Polite"],
    hobbies: ["Reading", "Running", "Podcasts"],
    budgetRange: "₦180,000 - ₦240,000",
    matchScore: 76,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"
  }
];

export const initialDiscussions: DiscussionThread[] = [
  {
    id: "d1",
    title: "Best mobile networks for data around West Gate?",
    author: "Timothy Bayode",
    authorRole: "CS Student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", // Will show Timothy's avatar or generic
    content: "Since moving closer to West Gate, my current MTN line has been fluctuating. Does anyone use Airtel or Glo here? Need steady connections for pushes to GitHub and long Zoom coding meets.",
    category: "Housing Tips",
    replies: 15,
    upvotes: 12,
    timestamp: "3 hours ago"
  },
  {
    id: "d2",
    title: "Security escort service review: highly recommend!",
    author: "Zainab Yusuf",
    authorRole: "Law Student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    content: "I used the Campus Security escort service last night walking back from the Faculty library around 11 PM. They were very polite, responded within 10 minutes, and walked me straight to my hostel gate. Please don't walk alone at night, use this!",
    category: "Safety",
    replies: 28,
    upvotes: 56,
    timestamp: "Yesterday"
  },
  {
    id: "d3",
    title: "Warning: Low price room offers at Estate Layout are scam setups",
    author: "Chief Security Officer",
    authorRole: "Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    content: "We have received 4 reports this week of agents posing as landlords. They show empty units, collect 'urgency booking fees', and block the students. Verify all agents and landlords on CampusAI before making any deposit payments.",
    category: "Safety",
    replies: 42,
    upvotes: 94,
    timestamp: "2 days ago"
  }
];

export const initialLostFound: LostFoundItem[] = [
  {
    id: "lf1",
    title: "Black HP Laptop Charger",
    status: "Found",
    location: "Engineering Lecture Theater 2, row D",
    date: "2026-07-13",
    contact: "08031234567 (Message Only)",
    description: "Found a 65W HP smart pin charger plugged in behind the last row of desks. I left it with the ELT porter's desk.",
    category: "Electronics"
  },
  {
    id: "lf2",
    title: "Brown leather wallet (Contains school ID card)",
    status: "Lost",
    location: "West Gate Shuttle stop or student cafeteria",
    date: "2026-07-12",
    contact: "08149876543 (Timothy Bayode)",
    description: "Lost my wallet containing driver's license, debit cards, and my student ID card (Timothy Bayode, Computer Science). Please let me know if found!",
    category: "Personal Items"
  },
  {
    id: "lf3",
    title: "Keyring with 4 keys and a red keychain",
    status: "Found",
    location: "Pathway leading from Main Library to Science complex",
    date: "2026-07-11",
    contact: "07065432109",
    description: "Found a bunch of keys on the gravel walkway. One is a master key, others look like room padlocks.",
    category: "Keys"
  }
];
