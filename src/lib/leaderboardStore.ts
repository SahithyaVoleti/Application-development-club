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

// Default initial campus leaderboard winner entries
let globalLeaderboardEntries: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    eventId: 'event-007',
    eventTitle: 'STACK HACK 2024',
    rank: 1,
    teamName: 'Team Neural Crafters',
    members: 'Arjun Patel (Lead), Priya Sharma, Rahul Verma',
    projectName: 'AI Campus Opportunity Engine',
    points: 980,
    projectsCount: 4,
    hackathonsCount: 3,
    badge: '🥇 1st Rank Winner',
    award: 'Cash Prize ₹5,300 + Trophy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-2',
    eventId: 'event-007',
    eventTitle: 'STACK HACK 2024',
    rank: 2,
    teamName: 'Team Code Nexus',
    members: 'Kiran Kumar (Lead), Ananya Rao, Vikram S.',
    projectName: 'Smart Automated Exam Sandbox',
    points: 920,
    projectsCount: 3,
    hackathonsCount: 2,
    badge: '🥈 2nd Rank Runner-Up',
    award: 'Cash Prize ₹3,300',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-3',
    eventId: 'event-007',
    eventTitle: 'STACK HACK 2024',
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
