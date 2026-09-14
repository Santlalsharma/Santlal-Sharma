import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Award 
} from 'lucide-react';
import { EXPERIENCES, PERSONAL_INFO } from '../data/portfolioData';

interface ExperienceProps {
  darkMode: boolean;
  onOpenResume: () => void;
}

export const Experience: React.FC<ExperienceProps> = ({ darkMode, onOpenResume }) => {
  const [filter, setFilter] = useState<'All' | 'Work' | 'Education'>('All');

  const filteredItems = EXPERIENCES.filter((item) => {
    if (filter === 'All') return true;
    return item.type === filter;
  });

  return (
    <section
      id="experience"
      className={`py-20 lg:py-28 border-t transition-colors ${
        darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-100' : 'bg-neutral-50/70 border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Experience & Education
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Track record of hands-on software development, production deployments, and academic foundation.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {(['All', 'Work', 'Education'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              id={`exp-filter-${type.toLowerCase()}`}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                filter === type
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                  : darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {type === 'All' ? 'Complete Timeline' : type === 'Work' ? 'Professional Roles' : 'Education & Degrees'}
            </button>
          ))}
        </div>

        {/* Timeline Layout */}
        <div className="max-w-3xl mx-auto relative">
          
          {/* Vertical central spine */}
          <div className={`absolute left-4 sm:left-8 top-4 bottom-4 w-0.5 ${
            darkMode ? 'bg-neutral-800' : 'bg-neutral-200'
          }`} />

          <div className="space-y-8">
            {filteredItems.map((item, idx) => {
              const isWork = item.type === 'Work';
              const Icon = isWork ? Briefcase : GraduationCap;

              return (
                <div
                  key={idx}
                  id={`experience-item-${idx}`}
                  className="relative pl-12 sm:pl-20 group"
                >
                  {/* Spine Icon Node */}
                  <div className={`absolute left-0 sm:left-4 top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 shadow-md ${
                    isWork
                      ? 'bg-orange-500 border-orange-400 text-white shadow-orange-500/30'
                      : 'bg-amber-500 border-amber-400 text-white shadow-amber-500/30'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Card Content */}
                  <div className={`p-6 sm:p-7 rounded-3xl border shadow-md transition-all hover:shadow-xl ${
                    darkMode
                      ? 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                      : 'bg-white border-neutral-200/90 hover:border-neutral-300'
                  }`}>
                    
                    {/* Header: Period, Company, Type */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                          isWork
                            ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {item.type}
                        </span>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          <Calendar className="w-3 h-3 text-orange-500" />
                          <span>{item.period}</span>
                        </span>
                      </div>

                      <div className={`text-xs flex items-center gap-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight mb-1 text-orange-500">
                      {item.role}
                    </h3>

                    <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                      {item.company}
                    </p>

                    <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {item.description}
                    </p>

                    {/* Key Accomplishments */}
                    <div className="space-y-2 mb-5">
                      {item.achievements.map((ach, achIdx) => (
                        <div key={achIdx} className="flex items-start gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>{ach}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t dark:border-neutral-800 border-neutral-100">
                      {item.technologies.map((t) => (
                        <span
                          key={t}
                          className={`text-xs px-2.5 py-0.5 rounded-md font-mono ${
                            darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CV Prompt */}
          <div className="text-center mt-12">
            <button
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold text-sm shadow-md shadow-orange-500/25 transition-all hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>Download & Print Official Resume</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
