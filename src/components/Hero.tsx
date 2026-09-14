import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  Download, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Maximize2, 
  Camera, 
  RefreshCw,
  Code2,
  Terminal,
  Cpu
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeroProps {
  darkMode: boolean;
  onOpenResume: () => void;
  currentPhotoUrl: string;
  onChangePhoto: (newUrl: string) => void;
  onResetPhoto: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  darkMode,
  onOpenResume,
  currentPhotoUrl,
  onChangePhoto,
  onResetPhoto,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          onChangePhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section
      id="hero"
      className={`relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden transition-colors ${
        darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bio & Introduction */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all mb-6 bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{PERSONAL_INFO.availability}</span>
            </div>

            {/* Main Greeting & Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
              <span>Hi, I'm </span>
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                {PERSONAL_INFO.name}
              </span>
            </h1>

            {/* Profession Title */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`text-xl sm:text-2xl font-bold tracking-tight ${darkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                {PERSONAL_INFO.title}
              </span>
              <span className="text-orange-500 font-bold">•</span>
              <span className="text-sm font-semibold tracking-wide uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                {PERSONAL_INFO.brand}
              </span>
            </div>

            {/* Description / Summary */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mb-8 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {PERSONAL_INFO.shortBio}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              <a
                href="#projects"
                id="hero-view-work-btn"
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                id="hero-resume-btn"
                onClick={onOpenResume}
                className={`flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border transition-all ${
                  darkMode
                    ? 'border-neutral-800 bg-neutral-900 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-850'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 shadow-sm'
                }`}
              >
                <Download className="w-4 h-4 text-orange-500" />
                <span>Resume / CV</span>
              </button>

              <a
                href="#contact"
                id="hero-contact-btn"
                className={`flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border transition-all ${
                  darkMode
                    ? 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-white hover:border-neutral-700'
                    : 'border-neutral-200 bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Quick Contact & Location Bar */}
            <div className={`pt-6 border-t w-full flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm ${
              darkMode ? 'border-neutral-800/80 text-neutral-400' : 'border-neutral-200 text-neutral-600'
            }`}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Based in {PERSONAL_INFO.location} • Ready to work globally</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono">{PERSONAL_INFO.email}</span>
                <button
                  onClick={handleCopyEmail}
                  id="hero-copy-email-btn"
                  title="Copy email to clipboard"
                  className={`p-1.5 rounded-lg border transition-colors ${
                    copiedEmail
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : darkMode
                      ? 'bg-neutral-900 border-neutral-800 hover:text-white'
                      : 'bg-white border-neutral-200 hover:text-neutral-900 shadow-sm'
                  }`}
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Portrait & Floating Cards */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              
              {/* Outer Decorative Gradient Border */}
              <div className="relative rounded-3xl p-2 bg-gradient-to-b from-orange-500/40 via-amber-500/20 to-transparent shadow-2xl shadow-orange-500/15">
                <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] border ${
                  darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
                }`}>
                  
                  {/* The User Photo */}
                  <img
                    id="hero-santlal-photo"
                    src={currentPhotoUrl}
                    alt={PERSONAL_INFO.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />

                  {/* Subtle rim light overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Photo Overlay Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {/* View Fullscreen */}
                    <button
                      id="view-photo-fullscreen"
                      onClick={() => setPhotoModalOpen(true)}
                      title="View full portrait"
                      className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 border border-white/20 transition-all shadow-md"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Change Photo Trigger */}
                    <button
                      id="change-photo-btn"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload / replace photo"
                      className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 border border-white/20 transition-all shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Name tag at bottom of portrait */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-white flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold leading-tight">{PERSONAL_INFO.name}</p>
                      <p className="text-xs text-orange-400 font-medium">{PERSONAL_INFO.brand} • Full-Stack</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                      <Terminal className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge 1 - Top Left */}
              <div className={`absolute -top-4 -left-4 sm:-left-8 px-4 py-2.5 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-md animate-bounce-slow ${
                darkMode ? 'bg-neutral-900/90 border-neutral-800 text-white' : 'bg-white/95 border-neutral-200 text-neutral-900'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Experience</p>
                  <p className="text-sm font-extrabold text-orange-500">3+ Years Pro</p>
                </div>
              </div>

              {/* Floating Stat Badge 2 - Bottom Right */}
              <div className={`absolute -bottom-4 -right-4 sm:-right-6 px-4 py-2.5 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-md ${
                darkMode ? 'bg-neutral-900/90 border-neutral-800 text-white' : 'bg-white/95 border-neutral-200 text-neutral-900'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Delivered</p>
                  <p className="text-sm font-extrabold text-emerald-500">25+ Projects</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Highlight Numbers Bar */}
        <div className={`mt-16 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-6 ${
          darkMode ? 'border-neutral-800/80' : 'border-neutral-200'
        }`}>
          {PERSONAL_INFO.stats.map((stat, idx) => (
            <div
              key={idx}
              id={`stat-card-${idx}`}
              className={`p-4 rounded-2xl border text-center transition-transform hover:-translate-y-1 ${
                darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200/80 shadow-sm'
              }`}
            >
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-1">
                {stat.value}
              </p>
              <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Preview Modal */}
      {photoModalOpen && (
        <div
          id="photo-fullscreen-modal"
          onClick={() => setPhotoModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full rounded-3xl overflow-hidden border border-neutral-700 bg-neutral-900 shadow-2xl p-2"
          >
            <img
              src={currentPhotoUrl}
              alt={PERSONAL_INFO.name}
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-2xl object-cover"
            />
            <div className="p-4 flex items-center justify-between text-neutral-200">
              <div>
                <h3 className="font-bold text-base">{PERSONAL_INFO.name}</h3>
                <p className="text-xs text-neutral-400">{PERSONAL_INFO.title} • {PERSONAL_INFO.brand}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onResetPhoto}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
