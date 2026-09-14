import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      className={`border-t py-12 transition-colors ${
        darkMode ? 'bg-neutral-950 border-neutral-800/80 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b dark:border-neutral-800/80 border-neutral-200">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
              SS
            </div>
            <div>
              <p className={`font-bold text-base ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                {PERSONAL_INFO.name}
              </p>
              <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider">
                Founder • {PERSONAL_INFO.brand}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-medium">
            <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
            <a href="#skills" className="hover:text-orange-500 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-orange-500 transition-colors">Projects</a>
            <a href="#experience" className="hover:text-orange-500 transition-colors">Experience</a>
            <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
            <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
              className={`p-2 rounded-xl border transition-colors ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900 text-neutral-300 hover:text-white' : 'border-neutral-300 hover:bg-white text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
              className={`p-2 rounded-xl border transition-colors ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900 text-neutral-300 hover:text-white' : 'border-neutral-300 hover:bg-white text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              title="Email"
              className={`p-2 rounded-xl border transition-colors ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900 text-neutral-300 hover:text-white' : 'border-neutral-300 hover:bg-white text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <Mail className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              id="back-to-top-btn"
              title="Scroll to Top"
              className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-white transition-all ml-2"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>
            © {new Date().getFullYear()} {PERSONAL_INFO.name} ({PERSONAL_INFO.brand}). All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Engineered with React, TypeScript & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
