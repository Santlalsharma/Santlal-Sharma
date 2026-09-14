import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Rocket, 
  CheckCircle, 
  MapPin, 
  Mail, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface AboutProps {
  darkMode: boolean;
  onOpenResume: () => void;
}

export const About: React.FC<AboutProps> = ({ darkMode, onOpenResume }) => {
  const pillars = [
    {
      icon: Terminal,
      title: 'Full-Stack Craftsmanship',
      description: 'Architecting clean, type-safe code across the stack with React 19, TypeScript, Node.js, and modern databases.',
    },
    {
      icon: Layers,
      title: 'UI/UX & Micro-Interactions',
      description: 'Designing intuitive layouts, smooth micro-animations, and responsive designs that feel tactile and instantaneous.',
    },
    {
      icon: Rocket,
      title: 'High-Performance Standards',
      description: 'Relentless focus on bundle efficiency, lazy loading, and sub-second paint times to guarantee top Core Web Vitals.',
    },
    {
      icon: ShieldCheck,
      title: 'Reliable & Clean Delivery',
      description: 'Transparent communication, robust Git workflows, and dependable milestones backed by rigorous testing.',
    },
  ];

  const quickFacts = [
    { icon: Briefcase, label: 'Current Focus', value: 'Lead Engineer @ SYT Studio' },
    { icon: MapPin, label: 'Location', value: `${PERSONAL_INFO.location} (Remote / Global)` },
    { icon: Mail, label: 'Direct Inquiries', value: PERSONAL_INFO.email },
    { icon: GraduationCap, label: 'Degree', value: 'Bachelor of Computer Applications (BCA)' },
  ];

  return (
    <section
      id="about"
      className={`py-20 lg:py-28 border-t transition-colors ${
        darkMode ? 'bg-neutral-900/30 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Passionate About Code, Obsessed With Polish
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Bridging the gap between creative visual design and robust backend systems to deliver digital products that leave a lasting impression.
          </p>
        </div>

        {/* Two-Column Story & Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left: Detailed Story */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg leading-relaxed">
            <p className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>
              Hi there! I am <strong className="text-orange-500">{PERSONAL_INFO.name}</strong>, a full-stack engineer and digital product developer based in India. Over the past 3+ years, I have architected and deployed modern web applications for ambitious founders, digital businesses, and creative studios.
            </p>
            <p className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>
              My journey began with a curiosity for how interactive systems work under the hood. That curiosity evolved into mastering the modern JavaScript and TypeScript ecosystem—building scalable full-stack applications with React, Next.js, Node.js, and PostgreSQL. As the founder of <strong className={darkMode ? 'text-neutral-200' : 'text-neutral-800'}>SYT Studio</strong>, I prioritize clean architecture, strict accessibility standards, and aesthetic elegance in every line of code.
            </p>
            <p className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>
              Whether building an enterprise SaaS dashboard with complex real-time data flows or crafting a high-conversion e-commerce storefront, I care deeply about how a product feels to the user and how easy it is for engineering teams to maintain.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenResume}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
              >
                Inspect Full Resume & Milestones
              </button>
              <a
                href="#skills"
                className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                  darkMode ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-750 text-neutral-200' : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                Browse Technical Stack
              </a>
            </div>
          </div>

          {/* Right: Quick Facts Card */}
          <div className="lg:col-span-5">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden ${
              darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50/90 border-neutral-200'
            }`}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>Personal Overview</span>
              </h3>

              <div className="space-y-4">
                {quickFacts.map((fact, idx) => {
                  const Icon = fact.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                        darkMode ? 'bg-neutral-900/60 border-neutral-800/80' : 'bg-white border-neutral-200/80 shadow-sm'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {fact.label}
                        </p>
                        <p className="text-sm font-bold truncate mt-0.5">
                          {fact.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Personal Statement Callout */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/25">
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                  Philosophy
                </p>
                <p className={`text-sm italic leading-snug ${darkMode ? 'text-neutral-300' : 'text-neutral-800'}`}>
                  "Write code that is clean enough for a junior to maintain, fast enough for an enterprise to rely on, and beautiful enough for a user to love."
                </p>
                <p className="text-xs font-bold mt-2 text-right text-orange-500">— Santlal Sharma</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Engineering Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                id={`pillar-${idx}`}
                className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                  darkMode
                    ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold mb-2">{pillar.title}</h4>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
