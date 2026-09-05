'use client';
import React, { useState, useEffect } from 'react';
import PublicNavbar from './components/PublicNavbar';
import HeroSection from './components/HeroSection';
import StatsStrip from './components/StatsStrip';
import AutoScrollEventsTicker from './components/AutoScrollEventsTicker';
import CseEventStatsSection from './components/CseEventStatsSection';
import UpcomingEventsCarouselSection from './components/UpcomingEventsCarouselSection';
import PastEventsSection from './components/PastEventsSection';
import IntroSection from './components/IntroSection';
import RealWorldBuildingSection from './components/RealWorldBuildingSection';
import StudentJourneySection from './components/StudentJourneySection';
import LeaderboardSection from './components/LeaderboardSection';
import CertificatesSection from './components/CertificatesSection';
import GallerySection from './components/GallerySection';
import PublicFooter from './components/PublicFooter';

import EventRegistrationModal from './components/EventRegistrationModal';
import PastEventModal from './components/PastEventModal';
import CertificateVerificationModal from './components/CertificateVerificationModal';
import UserLoginModal from './components/UserLoginModal';
import AppDevWorkspace from './components/AppDevWorkspace';
import { MOCK_EVENTS, REGISTERED_COUNTS, type Event } from '@/lib/mockData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

import { type UserProfile } from '@/lib/workspaceData';

export default function PublicHomePage() {
  useScrollReveal();

  const [viewMode, setViewMode] = useState<'workspace' | 'events'>('events');
  const [activeLoggedInUser, setActiveLoggedInUser] = useState<UserProfile | null>(null);
  const [registrationModal, setRegistrationModal] = useState<Event | null>(null);
  const [pastEventModal, setPastEventModal] = useState<Event | null>(null);
  const [isVerifyCertOpen, setIsVerifyCertOpen] = useState(false);
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);
  const [loginBannerNotice, setLoginBannerNotice] = useState<string | null>(null);

  const [liveCounts, setLiveCounts] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appdevhub_live_counts');
      if (saved) {
        try {
          return { ...REGISTERED_COUNTS, ...JSON.parse(saved) };
        } catch (e) {
          console.error(e);
        }
      }
    }
    return { ...REGISTERED_COUNTS };
  });

  // Check stored active user session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adhub_active_user');
      if (saved) {
        try {
          setActiveLoggedInUser(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  // Handle direct event URL hash navigation (#event-015, #event-016, etc.)
  useEffect(() => {
    const checkHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash && hash.startsWith('#event-')) {
        const eventId = hash.replace('#', '');
        const targetEvent = MOCK_EVENTS.find(e => e.id === eventId);
        if (targetEvent) {
          if (targetEvent.status === 'COMPLETED') {
            setPastEventModal(targetEvent);
          } else {
            handleOpenRegistrationModal(targetEvent);
          }
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [activeLoggedInUser]);

  const handleOpenRegistrationModal = (event: Event | null) => {
    if (!event) {
      setRegistrationModal(null);
      window.history.pushState(null, '', window.location.pathname);
      return;
    }

    // ACCOUNT-FIRST CHECK: Verify student authentication before opening registration
    const isLoggedIn = Boolean(
      activeLoggedInUser || (typeof window !== 'undefined' && localStorage.getItem('adhub_active_user'))
    );

    if (!isLoggedIn) {
      setPendingEvent(event);
      setLoginBannerNotice(`Create your student account to register for ${event.title}.`);
      setIsStudentLoginOpen(true);
      return;
    }

    setRegistrationModal(event);
    window.history.pushState(null, '', `#${event.id}`);
  };

  const handleOpenPastEventModal = (event: Event | null) => {
    setPastEventModal(event);
    if (event) {
      window.history.pushState(null, '', `#${event.id}`);
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleRegisterSuccess = (eventId: string) => {
    setLiveCounts(prev => {
      const next = { ...prev, [eventId]: (prev[eventId] || 0) + 1 };
      if (typeof window !== 'undefined') {
        localStorage.setItem('appdevhub_live_counts', JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Workspace Mode or Premium Enterprise Home */}
      {viewMode === 'workspace' ? (
        <AppDevWorkspace
          onSwitchToPublicEvents={() => setViewMode('events')}
          initialUser={activeLoggedInUser || undefined}
        />
      ) : (
        <div className="min-h-screen bg-white">
          {/* Enterprise Sticky Navigation */}
          <PublicNavbar
            onSwitchToWorkspace={() => setViewMode('workspace')}
            onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
            onOpenVerifyCert={() => setIsVerifyCertOpen(true)}
          />

          <main>
            {/* 1. Hero Section with Background Image & Taglines */}
            <HeroSection onSwitchToWorkspace={() => setViewMode('workspace')} />

            {/* 2. Count-Up Statistics Strip */}
            <StatsStrip />

            {/* 2b. Live Auto-Scrolling Event Marquee Ticker */}
            <AutoScrollEventsTicker
              events={MOCK_EVENTS}
              liveCounts={liveCounts}
              onRegisterClick={handleOpenRegistrationModal}
            />

            {/* 3. Dedicated Scrolling Section: Upcoming Events & Hackathons */}
            <UpcomingEventsCarouselSection
              events={MOCK_EVENTS}
              onRegisterClick={handleOpenRegistrationModal}
              onViewDetails={handleOpenPastEventModal}
            />

            {/* 4. Dedicated Scrolling Section: Completed & Finished Events */}
            <PastEventsSection
              events={MOCK_EVENTS}
              onViewDetails={handleOpenPastEventModal}
            />

            {/* 5. CSE Department Impact & Community Stats */}
            <CseEventStatsSection />

            {/* 6. Introduction Section */}
            <IntroSection />

            {/* 7. Real-World Application Building & Pipeline Visual ("Don't Just Learn. Build Something Real.") */}
            <RealWorldBuildingSection />

            {/* 9. Campus & Event Media Gallery */}
            <GallerySection />

            {/* 10. Interactive Student Journey */}
            <StudentJourneySection />

            {/* 11. Builders of the Month Leaderboard */}
            <LeaderboardSection />

            {/* 12. Certificates & Recognition ("Build. Participate. Get Recognized.") */}
            <CertificatesSection />
          </main>

          {/* Enterprise Multi-Column Footer */}
          <PublicFooter />

          {/* Interactive Modals */}
          {registrationModal && (
            <EventRegistrationModal
              event={registrationModal}
              currentCount={liveCounts[registrationModal.id] || 0}
              currentUser={activeLoggedInUser}
              onClose={() => handleOpenRegistrationModal(null)}
              onSuccess={handleRegisterSuccess}
            />
          )}

          {pastEventModal && (
            <PastEventModal
              event={pastEventModal}
              onClose={() => handleOpenPastEventModal(null)}
            />
          )}

          <CertificateVerificationModal
            isOpen={isVerifyCertOpen}
            onClose={() => setIsVerifyCertOpen(false)}
          />

          {isStudentLoginOpen && (
            <UserLoginModal
              isOpen={isStudentLoginOpen}
              bannerNotice={loginBannerNotice}
              currentUser={activeLoggedInUser}
              onClose={() => {
                setIsStudentLoginOpen(false);
                setLoginBannerNotice(null);
              }}
              onSelectUser={(user) => {
                setActiveLoggedInUser(user);
                setIsStudentLoginOpen(false);
                setLoginBannerNotice(null);

                if (pendingEvent) {
                  const target = pendingEvent;
                  setPendingEvent(null);
                  setTimeout(() => {
                    setRegistrationModal(target);
                    window.history.pushState(null, '', `#${target.id}`);
                  }, 150);
                } else {
                  setViewMode('workspace');
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}