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
} from 'lucide-react';

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
  '🎓 Certificates for Code Storm 2026 & Stack Hack are now live and downloadable!',
];

interface Props {
  onSwitchToWorkspace?: () => void;
  onOpenStudentLogin?: () => void;
  onOpenVerifyCert?: () => void;
}

export default function PublicNavbar({ onSwitchToWorkspace, onOpenStudentLogin, onOpenVerifyCert }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map(link => link.href.replace('#', ''));
      for (const sectionId of sections.reverse()) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
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
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'h-[66px] bg-white/90 backdrop-blur-md shadow-md shadow-slate-900/5 border-b border-slate-200/80'
            : 'h-[76px] bg-white/70 backdrop-blur-sm border-b border-slate-200/50'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-full">
          {/* Logo & Branding */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('#home')}
          >
            <img
              src="/images/vignan-logo.png"
              alt="Vignan's Foundation for Science, Technology & Research Logo"
              className="h-10 sm:h-11 w-auto object-contain bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[0.98rem] leading-tight block tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  Application Development Club
                </span>
              </div>
              <span className="text-[0.68rem] font-bold text-slate-500 uppercase tracking-wider block">
                VFSTR · Department of Computer Science & Engineering
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-xl border border-slate-200/60">
            {NAV_LINKS.map(link => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={`nav-${link.label}`}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">

            <button
              onClick={() => {
                if (onOpenStudentLogin) onOpenStudentLogin();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
            >
              <User size={14} className="text-sky-600" />
              <span>Student Login</span>
            </button>

            <Link
              href="/admin-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-xs"
            >
              <ShieldCheck size={14} className="text-indigo-400" />
              <span>Admin Login</span>
            </Link>

            <button
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors ml-1"
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
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-white shadow-2xl border-b border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Cpu size={18} />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">AppDevHub</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">College Platform</span>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <button
                  key={`mobile-nav-${link.label}`}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    if (onOpenStudentLogin) onOpenStudentLogin();
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs border border-sky-200 cursor-pointer"
                >
                  Student Login
                </button>
                <Link
                  href="/admin-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
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