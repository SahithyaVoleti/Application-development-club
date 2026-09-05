'use client';
import React from 'react';
import { Mail, MapPin, Phone, Globe, MessageSquare } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50/80 via-white to-sky-50/50 border-t border-sky-100" id="contact">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-300/50 text-sky-700 text-xs font-bold uppercase tracking-widest mb-3">
            <MessageSquare size={14} className="text-sky-600" />
            <span>Connect With Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">
            Get in Touch
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Have questions regarding upcoming hackathons, event registrations, or department initiatives? Reach out to the CSE Department team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Mail,
              label: 'Email',
              value: 'cse@vignan.ac.in',
              href: 'mailto:cse@vignan.ac.in',
              color: 'bg-sky-500 text-white',
              shadow: 'shadow-sky-400/20',
            },
            {
              icon: Phone,
              label: 'Phone',
              value: '+91-866-2499999',
              href: 'tel:+918662499999',
              color: 'bg-emerald-500 text-white',
              shadow: 'shadow-emerald-400/20',
            },
            {
              icon: MapPin,
              label: 'Address',
              value: 'Vignan University, Vadlamudi, Guntur, AP 522213',
              href: null,
              color: 'bg-amber-500 text-white',
              shadow: 'shadow-amber-400/20',
            },
            {
              icon: Globe,
              label: 'Website',
              value: 'www.vignan.ac.in',
              href: 'https://www.vignan.ac.in',
              color: 'bg-indigo-500 text-white',
              shadow: 'shadow-indigo-400/20',
            },
          ].map((item) => (
            <div
              key={`contact-${item.label}`}
              className="bg-white rounded-3xl border border-stone-200/80 p-5 flex items-center gap-4 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.color} ${item.shadow} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                <item.icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider mb-0.5">{item.label}</div>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-xs sm:text-sm font-bold text-stone-800 hover:text-sky-600 transition-colors leading-tight block truncate"
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="text-xs sm:text-sm font-bold text-stone-800 leading-tight truncate">{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}