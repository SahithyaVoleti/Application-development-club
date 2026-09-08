'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Medal,
  Calendar,
  Sparkles,
  Filter,
  PlusCircle,
  Users,
  User,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { MOCK_EVENTS } from '@/lib/mockData';
import type { LeaderboardEntry } from '@/lib/leaderboardStore';
import AdminLeaderboardModal from '@/app/admin-dashboard/components/AdminLeaderboardModal';

// Static / Mock Data for Individual Students Leaderboard
const MOCK_INDIVIDUAL_LEADERBOARD = [
  {
    rank: 1,
    id: 'ind-1',
    studentName: 'Sahithya Voleti',
    studentId: '221FA04049',
    department: 'CSE',
    year: '3rd Year',
    points: 520,
    badge: 'Gold Medalist 🥇',
    award: 'Top Student Developer 2026',
    hackathonsCount: 4,
    projectsCount: 3,
  },
  {
    rank: 2,
    id: 'ind-2',
    studentName: 'K. Teja Sree',
    studentId: '221FA04052',
    department: 'CSE',
    year: '3rd Year',
    points: 480,
    badge: 'Silver Medalist 🥈',
    award: 'Runner Up Coder',
    hackathonsCount: 3,
    projectsCount: 2,
  },
  {
    rank: 3,
    id: 'ind-3',
    studentName: 'M. Varun Kumar',
    studentId: '221FA04018',
    department: 'AI & ML',
    year: '3rd Year',
    points: 440,
    badge: 'Bronze Medalist 🥉',
    award: 'AI Innovator Prize',
    hackathonsCount: 3,
    projectsCount: 2,
  },
  {
    rank: 4,
    id: 'ind-4',
    studentName: 'P. Rahul Varma',
    studentId: '221FA04085',
    department: 'CSE',
    year: '4th Year',
    points: 400,
    badge: 'Star Builder ⭐',
    award: 'Best Capstone Project',
    hackathonsCount: 2,
    projectsCount: 3,
  },
  {
    rank: 5,
    id: 'ind-5',
    studentName: 'S. Priyanka',
    studentId: '221FA04112',
    department: 'IT',
    year: '3rd Year',
    points: 370,
    badge: 'Code Master ⚡️',
    award: 'Code Storm Top 5',
    hackathonsCount: 2,
    projectsCount: 1,
  },
  {
    rank: 6,
    id: 'ind-6',
    studentName: 'V. Hemanth',
    studentId: '221FA04099',
    department: 'ECE',
    year: '4th Year',
    points: 330,
    badge: 'Tech Contributor 💡',
    award: 'Hardware & IoT Special Prize',
    hackathonsCount: 1,
    projectsCount: 2,
  },
];

export default function LeaderboardSection() {
  // Leaderboard Category Toggle: 'group' (Team Leaderboard) vs 'single' (Individual Student Leaderboard)
  const [leaderboardType, setLeaderboardType] = useState<'group' | 'single'>('group');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        selectedEventId === 'all'
          ? '/api/leaderboard'
          : `/api/leaderboard?eventId=${selectedEventId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setEntries(data.data || []);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const selectedEvent = MOCK_EVENTS.find(e => e.id === selectedEventId);

  return (
    <section id="leaderboard" className="py-16 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-6 lg:px-10 space-y-10">
        
        {/* Header Block */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-full px-4 py-1.5 text-xs font-mono font-extrabold uppercase tracking-widest shadow-2xs">
            <Trophy size={15} className="text-amber-600" /> CAMPUS RANKINGS & PODIUM
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Application Development Club Leaderboard
          </h2>
          <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed font-normal max-w-3xl mx-auto">
            Recognizing top student developers, hackathon teams, and podium winners across Vignan University.
          </p>
        </div>

        {/* 1. LEADERBOARD TYPE TOGGLE BAR: GROUP WISE vs SINGLE / INDIVIDUAL WISE */}
        <div className="flex items-center justify-center gap-4">
          <div className="inline-flex items-center p-2 bg-slate-100/90 border border-slate-200/90 rounded-2xl shadow-2xs font-extrabold text-xs sm:text-sm">
            <button
              onClick={() => setLeaderboardType('group')}
              className={`px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
                leaderboardType === 'group'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Users size={18} className={leaderboardType === 'group' ? 'text-amber-400' : 'text-slate-500'} />
              <span>👥 Group / Team Leaderboard</span>
            </button>

            <button
              onClick={() => setLeaderboardType('single')}
              className={`px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
                leaderboardType === 'single'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <User size={18} className={leaderboardType === 'single' ? 'text-sky-400' : 'text-slate-500'} />
              <span>👤 Individual / Single Student Leaderboard</span>
            </button>
          </div>
        </div>

        {/* 2. EVENT FILTER BAR (For Group Leaderboard) */}
        {leaderboardType === 'group' && (
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-3xl p-5 w-full max-w-[1450px] mx-auto shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 w-full lg:w-auto">
              <Filter size={18} className="text-amber-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">
                Event Filter:
              </span>
            </div>

            {/* Event Tabs */}
            <div className="flex items-center gap-2.5 overflow-x-auto w-full lg:w-auto no-scrollbar pb-1 lg:pb-0">
              <button
                onClick={() => setSelectedEventId('all')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedEventId === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                🏆 All Events
              </button>

              {MOCK_EVENTS.slice(0, 7).map(ev => (
                <button
                  key={`lb-tab-${ev.id}`}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedEventId === ev.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {ev.title}
                </button>
              ))}
            </div>

            {/* Admin Add Entry Button */}
            <button
              onClick={() => setShowAdminModal(true)}
              className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <PlusCircle size={16} />
              <span>Add Team Entry</span>
            </button>
          </div>
        )}

        {/* 3. GROUP / TEAM LEADERBOARD DISPLAY */}
        {leaderboardType === 'group' && (
          <>
            {loading ? (
              <div className="text-center py-16 text-slate-500 text-sm font-mono">
                Loading team rankings…
              </div>
            ) : entries.length === 0 ? (
              <div className="bg-slate-50/90 border border-slate-200 rounded-3xl p-10 text-center max-w-xl mx-auto shadow-2xs">
                <Trophy size={42} className="text-amber-500/80 mx-auto mb-3" />
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                  No Team Leaderboard Entries Added For This Event
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  Team rankings for this event will appear once announced by event judges.
                </p>
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition-colors inline-flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <PlusCircle size={16} className="text-amber-400" />
                  <span>Add Team Entries</span>
                </button>
              </div>
            ) : (
              <>
                {/* Top 3 Team Podium Cards */}
                {entries.length >= 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1450px] mx-auto">
                    {entries.slice(0, 3).map((team) => (
                      <div
                        key={`podium-${team.id}`}
                        className={`rounded-3xl border p-7 sm:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${
                          team.rank === 1
                            ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                            : team.rank === 2
                            ? 'bg-slate-50 border-slate-300 text-slate-900'
                            : 'bg-orange-50/90 border-orange-300 text-orange-950'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-5">
                            <span className="text-xs sm:text-sm font-mono font-extrabold px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                              {team.badge || `#${team.rank} Rank`}
                            </span>
                            <span className="text-2xl font-black text-slate-900 flex items-center gap-1.5 font-tabular">
                              <Flame size={20} className="text-amber-500" /> {team.points} pts
                            </span>
                          </div>

                          <div className="space-y-3 mb-6">
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                              {team.teamName}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-700 font-semibold leading-relaxed">
                              <strong className="text-slate-900 font-extrabold">Members:</strong> {team.members}
                            </p>
                            {team.projectName && (
                              <div className="text-xs sm:text-sm font-mono font-bold text-blue-700 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200/90 inline-block mt-2 shadow-2xs">
                                Project: {team.projectName}
                              </div>
                            )}
                          </div>
                        </div>

                        {team.award && (
                          <div className="pt-4 border-t border-slate-200/80 text-center text-xs sm:text-sm font-extrabold text-emerald-700">
                            🏆 {team.award}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Complete Team Ranking Table */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden w-full max-w-[1450px] mx-auto">
                  <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between text-xs sm:text-sm font-extrabold font-mono">
                    <span className="flex items-center gap-2.5">
                      <Users size={16} className="text-amber-400" /> GROUP / TEAM LEADERBOARD — {selectedEventId === 'all' ? 'ALL EVENTS' : selectedEvent?.title}
                    </span>
                    <span className="text-sky-400 font-bold">{entries.length} TEAMS RANKED</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {entries.map(team => (
                      <div
                        key={`lb-row-${team.id}`}
                        className="p-5 sm:p-6 flex items-center justify-between gap-6 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 font-black text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-2xs">
                            #{team.rank}
                          </div>
                          <div className="space-y-1">
                            <div className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2.5">
                              {team.teamName}
                              {team.badge && (
                                <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                                  {team.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 font-semibold">
                              <span className="text-slate-400">Team Members:</span> {team.members}
                            </div>
                            {team.projectName && (
                              <div className="text-xs sm:text-sm text-blue-600 font-mono font-semibold">
                                Project: {team.projectName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold shrink-0">
                          {team.award && (
                            <div className="hidden md:block text-right">
                              <span className="text-emerald-800 font-bold text-xs sm:text-sm bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                                {team.award}
                              </span>
                            </div>
                          )}

                          <div className="text-right min-w-[70px]">
                            <div className="font-black text-blue-700 text-xl sm:text-2xl font-tabular">{team.points}</div>
                            <div className="text-[11px] text-slate-400 font-mono font-bold">Points</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* 4. INDIVIDUAL / SINGLE STUDENT LEADERBOARD DISPLAY */}
        {leaderboardType === 'single' && (
          <div className="space-y-8 w-full max-w-[1450px] mx-auto">
            
            {/* Top 3 Individual Student Podium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MOCK_INDIVIDUAL_LEADERBOARD.slice(0, 3).map((student) => (
                <div
                  key={`ind-podium-${student.id}`}
                  className={`rounded-3xl border p-7 sm:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${
                    student.rank === 1
                      ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                      : student.rank === 2
                      ? 'bg-slate-50 border-slate-300 text-slate-900'
                      : 'bg-orange-50/90 border-orange-300 text-orange-950'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs sm:text-sm font-mono font-extrabold px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                        {student.badge}
                      </span>
                      <span className="text-2xl font-black text-slate-900 flex items-center gap-1.5 font-tabular">
                        <Flame size={20} className="text-amber-500" /> {student.points} pts
                      </span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                        {student.studentName}
                      </h3>
                      <div className="text-xs sm:text-sm font-mono font-extrabold text-slate-500">
                        ID: {student.studentId} · {student.department} ({student.year})
                      </div>
                      <div className="flex items-center gap-4 pt-3 text-xs sm:text-sm font-bold text-slate-700">
                        <span>🏆 {student.hackathonsCount} Hackathons Won</span>
                        <span>🚀 {student.projectsCount} Deployed</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 text-center text-xs sm:text-sm font-extrabold text-emerald-700">
                    🏆 {student.award}
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Individual Student Ranking Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
              <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between text-xs sm:text-sm font-extrabold font-mono">
                <span className="flex items-center gap-2.5">
                  <User size={16} className="text-sky-400" /> INDIVIDUAL / SINGLE STUDENT LEADERBOARD
                </span>
                <span className="text-sky-400 font-bold">{MOCK_INDIVIDUAL_LEADERBOARD.length} STUDENTS RANKED</span>
              </div>

              <div className="divide-y divide-slate-100">
                {MOCK_INDIVIDUAL_LEADERBOARD.map(student => (
                  <div
                    key={`ind-row-${student.id}`}
                    className="p-5 sm:p-6 flex items-center justify-between gap-6 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 text-sky-400 font-black text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-2xs">
                        #{student.rank}
                      </div>
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2.5">
                          {student.studentName}
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded font-bold">
                            {student.studentId}
                          </span>
                          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                            {student.badge}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-semibold">
                          {student.department} Department · {student.year}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-700 font-mono font-medium mt-0.5">
                          {student.hackathonsCount} Hackathons Won · {student.projectsCount} Deployed Projects
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold shrink-0">
                      <div className="hidden md:block text-right">
                        <span className="text-emerald-800 font-bold text-xs sm:text-sm bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          {student.award}
                        </span>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <div className="font-black text-blue-700 text-xl sm:text-2xl font-tabular">{student.points}</div>
                        <div className="text-[11px] text-slate-400 font-mono font-bold">Points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Leaderboard Management Modal */}
        {showAdminModal && (
          <AdminLeaderboardModal
            events={MOCK_EVENTS}
            onClose={() => setShowAdminModal(false)}
            onLeaderboardUpdated={fetchLeaderboard}
          />
        )}

      </div>
    </section>
  );
}
