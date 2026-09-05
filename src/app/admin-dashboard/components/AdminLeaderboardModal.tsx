'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  X,
  Plus,
  Trash2,
  Medal,
  Award,
  Users,
  Flame,
  CheckCircle,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import type { Event } from '@/lib/mockData';
import type { LeaderboardEntry } from '@/lib/leaderboardStore';

interface Props {
  events: Event[];
  onClose: () => void;
  onLeaderboardUpdated?: () => void;
}

export default function AdminLeaderboardModal({ events, onClose, onLeaderboardUpdated }: Props) {
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form State
  const [rank, setRank] = useState<number>(1);
  const [teamName, setTeamName] = useState<string>('');
  const [members, setMembers] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [points, setPoints] = useState<number>(500);
  const [projectsCount, setProjectsCount] = useState<number>(1);
  const [hackathonsCount, setHackathonsCount] = useState<number>(1);
  const [badge, setBadge] = useState<string>('🥇 1st Rank');
  const [award, setAward] = useState<string>('First Prize — ₹25,000');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedEventId === 'all'
        ? '/api/leaderboard'
        : `/api/leaderboard?eventId=${selectedEventId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setEntries(data.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch leaderboard:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !members.trim()) return;

    setSubmitting(true);
    try {
      const targetEvent = events.find(ev => ev.id === selectedEventId);
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEventId === 'all' ? null : selectedEventId,
          eventTitle: targetEvent ? targetEvent.title : 'Overall Campus Event',
          rank,
          teamName,
          members,
          projectName,
          points,
          projectsCount,
          hackathonsCount,
          badge,
          award,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamName('');
        setMembers('');
        setProjectName('');
        setRank(prev => prev + 1);
        setShowAddForm(false);
        fetchEntries();
        if (onLeaderboardUpdated) onLeaderboardUpdated();
      }
    } catch (err) {
      console.error('Failed to add entry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leaderboard entry?')) return;
    try {
      const res = await fetch(`/api/leaderboard?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchEntries();
        if (onLeaderboardUpdated) onLeaderboardUpdated();
      }
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear all leaderboard entries for this event selection?')) return;
    try {
      const url = selectedEventId === 'all'
        ? '/api/leaderboard?clearAll=true'
        : `/api/leaderboard?clearAll=true&eventId=${selectedEventId}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchEntries();
        if (onLeaderboardUpdated) onLeaderboardUpdated();
      }
    } catch (err) {
      console.error('Failed to clear leaderboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Event Leaderboard Manager</h3>
              <p className="text-xs text-slate-400">Add, edit, or delete leaderboard entries event-by-event</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Event Picker Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Select Event for Leaderboard
              </label>
              <select
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl text-xs font-bold text-white outline-none"
              >
                <option value="all">🏆 All Events (Overall Campus Leaderboard)</option>
                {events.map(ev => (
                  <option key={`opt-${ev.id}`} value={ev.id}>
                    {ev.title} ({ev.category}) — {ev.date}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
              <button
                onClick={() => setShowAddForm(v => !v)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Entry</span>
              </button>

              {entries.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                  title="Clear entries"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Add New Entry Form */}
          {showAddForm && (
            <form onSubmit={handleAddEntry} className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles size={14} /> New Leaderboard Winner Entry
                </span>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Rank Position #</label>
                  <input
                    type="number"
                    min="1"
                    value={rank}
                    onChange={e => setRank(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Team / Student Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Team ByteCrafters"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 🥇 1st Rank or Winner"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Members List</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera, Priya S., Rahul V."
                    value={members}
                    onChange={e => setMembers(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Project Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Smart Campus Traffic AI"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Points / Score</label>
                  <input
                    type="number"
                    value={points}
                    onChange={e => setPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Award / Cash Prize</label>
                  <input
                    type="text"
                    placeholder="e.g. First Prize — ₹25,000"
                    value={award}
                    onChange={e => setAward(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {submitting ? 'Saving...' : 'Save Entry'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Current Entries Table */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs font-mono">
              Loading leaderboard entries...
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-10 text-center">
              <Trophy size={36} className="text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">No Leaderboard Entries</h4>
              <p className="text-xs text-slate-400 mb-4">
                No custom leaderboard entries have been added for this event selection yet.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer"
              >
                + Add First Entry
              </button>
            </div>
          ) : (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
              {entries.map(entry => (
                <div key={entry.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-extrabold text-xs">
                      #{entry.rank}
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-xs flex items-center gap-2">
                        <span>{entry.teamName}</span>
                        {entry.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                            {entry.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{entry.members}</div>
                      {entry.projectName && (
                        <div className="text-[10px] text-sky-400 font-mono">Project: {entry.projectName}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    {entry.award && (
                      <span className="hidden sm:inline text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        {entry.award}
                      </span>
                    )}

                    <div className="text-right">
                      <div className="font-extrabold text-amber-400 text-sm font-tabular">{entry.points} pts</div>
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
