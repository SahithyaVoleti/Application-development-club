'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  LayoutDashboard,
  Terminal,
  ArrowUpRight,
  Cpu,
  User,
  ShieldCheck,
  Award,
  Trophy,
  Sparkles,
  Megaphone,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#images-gallery' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'About', href: '#about-hub' },
];

const ANNOUNCEMENTS = [
  '📢 Registration open for AI Innovation Hackathon 2.0 (Prize Pool ₹1,00,000)',
  '⚡ Smart India Hackathon (SIH) 2026 Internal Screening announced!',
  '🎓 Certificates for Code Storm 2026 & AI Hackathons are now live and downloadable!',
];

interface Props {
  onSwitchToWorkspace?: () => void;
  onOpenStudentLogin?: () => void;
  onOpenVerifyCert?: () => void;
}

export default function PublicNavbar({ onSwitchToWorkspace, onOpenStudentLogin, onOpenVerifyCert }: Props) {
  const { theme, toggleTheme, mounted } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map(link => link.href.replace('#', ''));
      for (const sectionId of sections.reverse()) {
        const el =
          document.getElementById(sectionId) ||
          (sectionId === 'about-hub' ? document.getElementById('about') : null) ||
          (sectionId === 'about' ? document.getElementById('about-hub') : null);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const targetId = href.replace('#', '');
    const el =
      document.getElementById(targetId) ||
      (targetId === 'about-hub' ? document.getElementById('about') : null) ||
      (targetId === 'about' ? document.getElementById('about-hub') : null) ||
      (targetId === 'events' ? document.getElementById('upcoming-events') : null);

    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(0, elementPosition - navOffset),
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'h-[66px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md shadow-slate-900/5 dark:shadow-slate-950/40 border-b border-slate-200/80 dark:border-slate-800'
            : 'h-[76px] bg-white/70 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/80'
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between h-full">
          {/* Logo & Branding */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => handleNavClick('#home')}
          >
            <img
              src="/images/vignan-logo.png"
              alt="Vignan's Foundation for Science, Technology & Research Logo"
              className="h-9 sm:h-11 md:h-13 w-auto object-contain bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-base lg:text-xl leading-tight block tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors truncate">
                  Application Development Club
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5 truncate hidden xs:block sm:block">
                VFSTR · Department of Computer Science & Engineering
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-900/80 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {NAV_LINKS.map(link => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={`nav-${link.label}`}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center"
              title={mounted && theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun size={18} className="text-amber-400 fill-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>

            <button
              onClick={() => {
                if (onOpenStudentLogin) onOpenStudentLogin();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer"
            >
              <User size={14} className="text-sky-600 dark:text-sky-400" />
              <span>Student Login</span>
            </button>

            <Link
              href="/admin-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-xs"
            >
              <ShieldCheck size={14} className="text-indigo-400 dark:text-white" />
              <span>Admin Login</span>
            </Link>

            <button
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-slate-900 shadow-2xl border-b border-slate-200 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Cpu size={18} />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm block">AppDevHub</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">College Platform</span>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <button
                  key={`mobile-nav-${link.label}`}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 flex flex-col gap-2">
                <button
                  onClick={toggleTheme}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-300 font-bold text-xs border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center gap-2"
                >
                  {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
                  <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    if (onOpenStudentLogin) onOpenStudentLogin();
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold text-xs border border-sky-200 dark:border-sky-800 cursor-pointer"
                >
                  Student Login
                </button>
                <Link
                  href="/admin-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold text-xs"
                >
                  Admin Portal Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}