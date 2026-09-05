'use client';
import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const revealElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is inside or above viewport window, reveal it
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('scroll-reveal-active');
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            entry.target.classList.add('scroll-reveal-active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '150px 0px 150px 0px',
      }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    // Initial check & event listeners
    revealElements();
    window.addEventListener('scroll', revealElements, { passive: true });
    window.addEventListener('resize', revealElements, { passive: true });
    window.addEventListener('hashchange', revealElements);

    // Guaranteed fallback: reveal all elements after 300ms so no section is ever hidden
    const fallbackTimer = setTimeout(() => {
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        el.classList.add('scroll-reveal-active');
      });
    }, 300);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', revealElements);
      window.removeEventListener('resize', revealElements);
      window.removeEventListener('hashchange', revealElements);
      clearTimeout(fallbackTimer);
    };
  }, []);
}
