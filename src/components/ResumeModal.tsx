import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ExternalLink, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Sparkles, 
  Award, 
  CheckCircle2 
} from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES, SKILL_CATEGORIES, PROJECTS } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="resume-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-6 ${
          darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Sticky Action Bar */}
        <div className={`p-4 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-md ${
          darkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/95 border-neutral-200'
        }`}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-base sm:text-lg">Curriculum Vitae — {PERSONAL_INFO.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="resume-print-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              id="resume-close-btn"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              aria-label="Close resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Canvas */}
        <div id="printable-resume" className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto space-y-8 print:p-0 print:max-h-none print:overflow-visible">
          
          {/* Resume Header */}
          <div className="border-b pb-6 dark:border-neutral-800 border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{PERSONAL_INFO.name}</h1>
                <p className="text-base font-semibold text-orange-500 mt-0.5">
                  {PERSONAL_INFO.title} • Founder @ {PERSONAL_INFO.brand}
                </p>
              </div>

              <div className="text-xs sm:text-sm space-y-1 sm:text-right font-mono">
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-500" />
                  <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:underline">{PERSONAL_INFO.email}</a>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{PERSONAL_INFO.location} • Available Globally</span>
                </p>
              </div>
            </div>

            <p className={`mt-4 text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {PERSONAL_INFO.fullBio}
            </p>
          </div>

          {/* Technical Proficiencies */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              <span>Technical Skills</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {SKILL_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-neutral-800/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <p className="font-bold text-xs uppercase tracking-wider mb-1 text-neutral-400">
                    {category.name}
                  </p>
                  <p className="leading-relaxed">
                    {category.skills.map((s) => s.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-4 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span>Professional Experience</span>
            </h3>
            <div className="space-y-6">
              {EXPERIENCES.filter((e) => e.type === 'Work').map((exp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="font-bold text-sm sm:text-base">
                      {exp.role} — <span className="text-orange-500">{exp.company}</span>
                    </h4>
                    <span className="text-xs font-mono text-neutral-400">{exp.period}</span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {exp.description}
                  </p>
                  <ul className="space-y-1 text-xs">
                    {exp.achievements.map((ach, achIdx) => (
                      <li key={achIdx} className="flex items-start gap-1.5">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Key Featured Projects */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Selected Project Highlights</span>
            </h3>
            <div className="space-y-3">
              {PROJECTS.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-neutral-800/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm">{proj.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                      {proj.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{proj.description}</p>
                  <p className="text-[11px] font-mono text-neutral-500 mt-1.5">
                    Stack: {proj.tags.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Academic Qualifications */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </h3>
            {EXPERIENCES.filter((e) => e.type === 'Education').map((edu, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base">{edu.role}</h4>
                  <span className="text-xs font-mono text-neutral-400">{edu.period}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400">{edu.company} • {edu.location}</p>
                <p className="text-xs text-neutral-400 mt-1">{edu.description}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
