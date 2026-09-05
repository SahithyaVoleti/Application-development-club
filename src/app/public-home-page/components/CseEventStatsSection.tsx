'use client';
import React, { useState, useEffect, useRef } from 'react';
import { CalendarDays, CalendarClock, CircleCheck, Users, RefreshCw } from 'lucide-react';

interface StatsData {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalStudentsRegistered: number;
}

// Count Up Animated Number Component (Section 10 & 15)
function AnimatedStatNumber({ value, isVisible }: { value: number; isVisible: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1500; // 1.5s smooth count up
    const steps = 40;
    const increment = value / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  // Section 15: Proper Number Formatting using Intl.NumberFormat
  return (
    <span>
      {new Intl.NumberFormat('en-US').format(displayValue)}
    </span>
  );
}

export default function CseEventStatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/public/event-stats');
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      console.warn('Public stats fetch error:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Section 5: Auto refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Section 11: Viewport animation with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const STAT_CARDS = [
    {
      id: 'totalEvents',
      label: 'Total Events',
      sublabel: 'Events hosted',
      value: stats?.totalEvents || 0,
      icon: CalendarDays,
      color: 'text-blue-600 bg-blue-50 border-blue-200/80',
    },
    {
      id: 'upcomingEvents',
      label: 'Upcoming Events',
      sublabel: "Join what's next",
      value: stats?.upcomingEvents || 0,
      icon: CalendarClock,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80',
    },
    {
      id: 'completedEvents',
      label: 'Completed Events',
      sublabel: 'Events conducted',
      value: stats?.completedEvents || 0,
      icon: CircleCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80',
    },
    {
      id: 'totalStudentsRegistered',
      label: 'Students Registered',
      sublabel: 'Community reach',
      value: stats?.totalStudentsRegistered || 0,
      icon: Users,
      color: 'text-sky-600 bg-sky-50 border-sky-200/80',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="cse-event-stats"
      className="py-20 bg-slate-50 border-b border-slate-200/60 overflow-hidden relative"
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        {/* Section 7: Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 scroll-reveal">
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-3">
            CSE EVENTS & COMMUNITY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Department Activity & Impact
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Stay updated with events, workshops, hackathons and activities across the Department of CSE.
          </p>
        </div>

        {/* Section 14: Error Fallback */}
        {error && !stats && (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center">
            Statistics temporarily unavailable. Reconnecting...
          </div>
        )}

        {/* Section 16: Responsive Grid (4 Desktop, 2x2 Tablet, 1 Stack Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={`stat-card-${card.id}`}
                className={`bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-card-hover group flex flex-col justify-between ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{
                  transitionDelay: `${idx * 120}ms`,
                  transitionProperty: 'opacity, transform',
                }}
              >
                <div>
                  {/* Card Icon & Sublabel */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${card.color} border flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <Icon size={24} />
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      {card.sublabel}
                    </span>
                  </div>

                  {/* Stat Value Number */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-tabular mb-1 group-hover:text-blue-600 transition-colors">
                    {loading ? (
                      /* Section 13: Loading Skeleton Pulse */
                      <span className="inline-block w-24 h-10 bg-slate-200 animate-pulse rounded-lg" />
                    ) : (
                      <AnimatedStatNumber value={card.value} isVisible={isVisible} />
                    )}
                  </div>

                  <div className="text-xs sm:text-sm font-extrabold text-slate-700 mt-1">
                    {card.label}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>Live CSE System</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
