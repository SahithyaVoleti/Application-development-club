export interface LeaderboardEntry {
  id: string;
  eventId?: string | null;
  eventTitle?: string | null;
  rank: number;
  teamName: string;
  members: string;
  projectName?: string | null;
  points: number;
  projectsCount: number;
  hackathonsCount: number;
  badge?: string | null;
  award?: string | null;
  createdAt: string;
}

// Default initial campus leaderboard winner entries across all events
let globalLeaderboardEntries: LeaderboardEntry[] = [
  // 0. Agentic AI Day Hackathon 2026 (Featured Event)
  {
    id: 'lb-agentic-1',
    eventId: 'agentic-ai-day-2026',
    eventTitle: 'Agentic AI Day Hackathon 2026',
    rank: 1,
    teamName: 'Team Agentic Architects',
    members: 'Sahithya Voleti (Lead), K. Teja Sree, M. Varun',
    projectName: 'Autonomous Agentic AI Campus Hub & Workflow Engine',
    points: 995,
    projectsCount: 5,
    hackathonsCount: 5,
    badge: '🥇 1st Rank Champion',
    award: 'Grand Cash Prize ₹10,000 + Agentic AI Trophy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-agentic-2',
    eventId: 'agentic-ai-day-2026',
    eventTitle: 'Agentic AI Day Hackathon 2026',
    rank: 2,
    teamName: 'Team AutoBots CSE',
    members: 'P. Rahul Varma (Lead), S. Priyanka, V. Hemanth',
    projectName: 'Multi-Agent Code Review & Bug Repair Bot',
    points: 940,
    projectsCount: 4,
    hackathonsCount: 3,
    badge: '🥈 2nd Rank Runner-Up',
    award: 'Cash Prize ₹5,000 + Silver Medal',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-agentic-3',
    eventId: 'agentic-ai-day-2026',
    eventTitle: 'Agentic AI Day Hackathon 2026',
    rank: 3,
    teamName: 'Team GenAI Swarm',
    members: 'Aarav Kumar (Lead), Riya Sharma',
    projectName: 'Agentic Student Exam Assistant',
    points: 885,
    projectsCount: 3,
    hackathonsCount: 3,
    badge: '🥉 3rd Rank Winner',
    award: 'Cash Prize ₹2,500 + Bronze Medal',
    createdAt: new Date().toISOString(),
  },

  // 1. AI Innovation Hackathon 2026
  {
    id: 'lb-1',
    eventId: 'event-007',
    eventTitle: 'AI Innovation Hackathon 2026',
    rank: 1,
    teamName: 'Team Neural Crafters',
    members: 'Arjun Patel (Lead), Priya Sharma, Rahul Verma',
    projectName: 'AI Campus Opportunity Engine',
    points: 980,
    projectsCount: 4,
    hackathonsCount: 3,
    badge: '🥇 1st Rank Winner',
    award: 'Cash Prize ₹5,000 + Gold Trophy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-2',
    eventId: 'event-007',
    eventTitle: 'AI Innovation Hackathon 2026',
    rank: 2,
    teamName: 'Team Code Nexus',
    members: 'Kiran Kumar (Lead), Ananya Rao, Vikram S.',
    projectName: 'Smart Automated Exam Sandbox',
    points: 920,
    projectsCount: 3,
    hackathonsCount: 2,
    badge: '🥈 2nd Rank Runner-Up',
    award: 'Cash Prize ₹3,000 + Silver Trophy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-3',
    eventId: 'event-007',
    eventTitle: 'AI Innovation Hackathon 2026',
    rank: 3,
    teamName: 'Team Cyber Pulse',
    members: 'Deepak V. (Lead), Sneha Reddy',
    projectName: 'Campus ATS Resume AI',
    points: 870,
    projectsCount: 2,
    hackathonsCount: 2,
    badge: '🥉 3rd Rank',
    award: 'Cash Prize ₹2,000',
    createdAt: new Date().toISOString(),
  },

  // 2. SUSTAINABILITY IDEATHON (remote-event-8)
  {
    id: 'lb-sus-1',
    eventId: 'remote-event-8',
    eventTitle: 'SUSTAINABILITY IDEATHON',
    rank: 1,
    teamName: 'EcoTech Squad',
    members: 'Sahithya Voleti (Lead), K. Teja Sree, M. Varun',
    projectName: 'Smart Energy & Waste Tracker',
    points: 960,
    projectsCount: 3,
    hackathonsCount: 4,
    badge: '🥇 1st Rank Champion',
    award: 'Cash Prize ₹5,000 + Sustainability Shield',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-sus-2',
    eventId: 'remote-event-8',
    eventTitle: 'SUSTAINABILITY IDEATHON',
    rank: 2,
    teamName: 'Green Bytes',
    members: 'P. Rahul Varma (Lead), S. Priyanka',
    projectName: 'Campus Carbon Footprint Calculator',
    points: 900,
    projectsCount: 2,
    hackathonsCount: 3,
    badge: '🥈 2nd Rank Runner-Up',
    award: 'Cash Prize ₹3,000',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-sus-3',
    eventId: 'remote-event-8',
    eventTitle: 'SUSTAINABILITY IDEATHON',
    rank: 3,
    teamName: 'Clean Campus Innovators',
    members: 'V. Hemanth (Lead), N. Bhavana',
    projectName: 'IoT Solar Power Monitor',
    points: 850,
    projectsCount: 2,
    hackathonsCount: 2,
    badge: '🥉 3rd Rank',
    award: 'Cash Prize ₹1,500',
    createdAt: new Date().toISOString(),
  },

  // 3. Smart India Hackathon-Internal Hackathon-2025 (remote-event-9)
  {
    id: 'lb-sih-1',
    eventId: 'remote-event-9',
    eventTitle: 'Smart India Hackathon-Internal Hackathon-2025',
    rank: 1,
    teamName: 'Vignan Visionaries',
    members: 'Aarav Kumar (Lead), Riya Sharma, Vikram Patel',
    projectName: 'AI Smart Traffic Management System',
    points: 990,
    projectsCount: 5,
    hackathonsCount: 5,
    badge: '🥇 1st Rank National Nominee',
    award: 'Selected for SIH Finals + ₹10,000 Grant',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-sih-2',
    eventId: 'remote-event-9',
    eventTitle: 'Smart India Hackathon-Internal Hackathon-2025',
    rank: 2,
    teamName: 'InnovateX CSE',
    members: 'B. Sravan (Lead), M. Divya, K. Harish',
    projectName: 'Rural Healthcare AI Diagnosis Portal',
    points: 935,
    projectsCount: 4,
    hackathonsCount: 3,
    badge: '🥈 2nd Rank Nominee',
    award: 'SIH Internal Runner-Up Trophy',
    createdAt: new Date().toISOString(),
  },

  // 4. </> CODE STORM (remote-event-10)
  {
    id: 'lb-cs-1',
    eventId: 'remote-event-10',
    eventTitle: '</> CODE STORM',
    rank: 1,
    teamName: 'Byte Benders',
    members: 'Sahithya Voleti (Lead), Teja Sree',
    projectName: 'Ultra-Fast Algorithmic Solver',
    points: 975,
    projectsCount: 4,
    hackathonsCount: 4,
    badge: '🥇 Code Storm Champion',
    award: 'Best Algorithm Award + ₹4,000',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-cs-2',
    eventId: 'remote-event-10',
    eventTitle: '</> CODE STORM',
    rank: 2,
    teamName: 'Stack Overlords',
    members: 'Rahul Varma (Lead), Varun Kumar',
    projectName: 'Distributed Real-Time Code Execution Platform',
    points: 910,
    projectsCount: 3,
    hackathonsCount: 3,
    badge: '🥈 Code Storm Runner-Up',
    award: 'Cash Prize ₹2,500',
    createdAt: new Date().toISOString(),
  },
];

export function getLeaderboardEntries(eventId?: string | null): LeaderboardEntry[] {
  if (!eventId || eventId === 'all') {
    return [...globalLeaderboardEntries].sort((a, b) => a.rank - b.rank || b.points - a.points);
  }
  return globalLeaderboardEntries
    .filter(item => item.eventId === eventId)
    .sort((a, b) => a.rank - b.rank || b.points - a.points);
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>): LeaderboardEntry {
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `lb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  globalLeaderboardEntries.push(newEntry);
  return newEntry;
}

export function deleteLeaderboardEntry(id: string): boolean {
  const initialLength = globalLeaderboardEntries.length;
  globalLeaderboardEntries = globalLeaderboardEntries.filter(item => item.id !== id);
  return globalLeaderboardEntries.length < initialLength;
}

export function clearLeaderboard(eventId?: string | null): void {
  if (!eventId || eventId === 'all') {
    globalLeaderboardEntries = [];
  } else {
    globalLeaderboardEntries = globalLeaderboardEntries.filter(item => item.eventId !== eventId);
  }
}
