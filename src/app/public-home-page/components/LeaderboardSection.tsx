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
} from 'lucide-react';
import { MOCK_EVENTS, type Event } from '@/lib/mockData';
import type { LeaderboardEntry } from '@/lib/leaderboardStore';
import AdminLeaderboardModal from '@/app/admin-dashboard/components/AdminLeaderboardModal';

export default function LeaderboardSection() {
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
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 space-y-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-full px-4 py-1 text-xs font-mono font-extrabold uppercase tracking-widest">
            <Trophy size={14} className="text-amber-600" /> CAMPUS RANKINGS & PODIUM
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Event Leaderboard & Winners
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Top-ranked student development teams, hackathon podium winners, and departmental project recognition.
          </p>
        </div>

        {/* Event Wise Selector Bar */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 max-w-5xl mx-auto shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={16} className="text-amber-600 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Event Filter:
            </span>
          </div>

          {/* Event Filter Selector / Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            <button
              onClick={() => setSelectedEventId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedEventId === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              🏆 All Events Leaderboard
            </button>

            {MOCK_EVENTS.slice(0, 5).map(ev => (
              <button
                key={`lb-tab-${ev.id}`}
                onClick={() => setSelectedEventId(ev.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedEventId === ev.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {ev.title}
              </button>
            ))}
          </div>

          {/* Admin Management Quick Button */}
          <button
            onClick={() => setShowAdminModal(true)}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <PlusCircle size={15} />
            <span>Manage Leaderboard</span>
          </button>
        </div>

        {/* Selected Event Context Pill */}
        {selectedEventId !== 'all' && selectedEvent && (
          <div className="max-w-5xl mx-auto bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Trophy size={18} />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm block">
                  {selectedEvent.title}
                </span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {selectedEvent.category} · Organized by {selectedEvent.organizer}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-blue-600" />
                {selectedEvent.date}
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900">
                {entries.length} Teams Ranked
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Podium View (Top 3) */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            Loading leaderboard entries…
          </div>
        ) : entries.length === 0 ? (
          /* Clean Compact Empty State */
          <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-2xs">
            <Trophy size={36} className="text-amber-500/80 mx-auto mb-2" />
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              No Leaderboard Entries Added For This Event
            </h3>
            <p className="text-slate-600 text-xs max-w-md mx-auto mb-4">
              Leaderboard rankings for this event will appear once announced by event judges.
            </p>
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle size={14} className="text-amber-400" />
              <span>Add Entries</span>
            </button>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Highlights */}
            {entries.length >= 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {entries.slice(0, 3).map((team) => (
                  <div
                    key={`podium-${team.id}`}
                    className={`rounded-3xl border p-6 flex flex-col justify-between shadow-2xs relative overflow-hidden transition-transform hover:-translate-y-1 ${
                      team.rank === 1
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                        : team.rank === 2
                        ? 'bg-slate-50 border-slate-300 text-slate-900'
                        : 'bg-orange-50/90 border-orange-300 text-orange-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
                        {team.badge || `#${team.rank} Rank`}
                      </span>
                      <span className="text-xl font-extrabold text-slate-900 flex items-center gap-1 font-tabular">
                        <Flame size={18} className="text-amber-500" /> {team.points} pts
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                        {team.teamName}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {team.members}
                      </p>
                      {team.projectName && (
                        <div className="text-xs font-mono font-bold text-blue-700 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200 inline-block mt-1">
                          Project: {team.projectName}
                        </div>
                      )}
                    </div>

                    {team.award && (
                      <div className="pt-3 border-t border-slate-200/80 text-center text-xs font-bold text-emerald-700">
                        {team.award}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Complete Ranking Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden max-w-5xl mx-auto">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-bold font-mono">
                <span className="flex items-center gap-2">
                  <Medal size={14} className="text-amber-400" /> FULL EVENT RANKINGS — {selectedEventId === 'all' ? 'ALL EVENTS' : selectedEvent?.title}
                </span>
                <span className="text-sky-400 font-bold">{entries.length} ENTRIES</span>
              </div>

              <div className="divide-y divide-slate-100">
                {entries.map(team => (
                  <div
                    key={`lb-row-${team.id}`}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                        #{team.rank}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                          {team.teamName}
                          {team.badge && (
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                              {team.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{team.members}</div>
                        {team.projectName && (
                          <div className="text-[11px] text-blue-600 font-mono font-medium">
                            Project: {team.projectName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-semibold">
                      {team.award && (
                        <div className="hidden md:block text-right">
                          <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            {team.award}
                          </span>
                        </div>
                      )}

                      <div className="text-right">
                        <div className="font-extrabold text-blue-700 text-base font-tabular">{team.points}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
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
