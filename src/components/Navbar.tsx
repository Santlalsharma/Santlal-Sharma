import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Sun, Moon, Sparkles, Send } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleDarkMode, onOpenResume }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 shadow-lg shadow-black/20 py-3'
            : 'bg-white/85 backdrop-blur-md border-b border-neutral-200/80 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          id="brand-logo"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
            SS
          </div>
          <div className="flex flex-col">
            <span className={`font-bold tracking-tight text-base sm:text-lg leading-tight ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
              {PERSONAL_INFO.name}
            </span>
            <span className="text-xs font-medium text-orange-500 tracking-wide uppercase">
              {PERSONAL_INFO.brand}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              id={`nav-link-${link.name.toLowerCase()}`}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                darkMode
                  ? 'text-neutral-300 hover:text-white hover:bg-neutral-850'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl border transition-all ${
              darkMode
                ? 'border-neutral-800 bg-neutral-900 text-amber-400 hover:bg-neutral-800'
                : 'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Resume Viewer CTA */}
          <button
            id="nav-resume-btn"
            onClick={onOpenResume}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl border transition-all ${
              darkMode
                ? 'border-neutral-700/80 bg-neutral-900 text-neutral-200 hover:border-orange-500/50 hover:text-white'
                : 'border-neutral-300 bg-white text-neutral-800 hover:border-orange-500/50 shadow-sm'
            }`}
          >
            <FileText className="w-4 h-4 text-orange-500" />
            <span>Resume</span>
          </button>

          {/* Hire Me / Contact CTA */}
          <a
            href="#contact"
            id="nav-hire-btn"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 rounded-xl shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Hire Me</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            id="mobile-theme-btn"
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl border ${
              darkMode
                ? 'border-neutral-800 bg-neutral-900 text-amber-400'
                : 'border-neutral-200 bg-neutral-100 text-neutral-700'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border ${
              darkMode ? 'border-neutral-800 text-neutral-200' : 'border-neutral-200 text-neutral-800'
            }`}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className={`sm:hidden border-b px-4 pt-3 pb-6 transition-all ${
            darkMode
              ? 'bg-neutral-950/98 border-neutral-800 text-neutral-100'
              : 'bg-white/98 border-neutral-200 text-neutral-900 shadow-xl'
          }`}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  darkMode ? 'hover:bg-neutral-900' : 'hover:bg-neutral-100'
                }`}
              >
                {link.name}
              </a>
            ))}

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700"
              >
                <FileText className="w-4 h-4 text-orange-500" />
                <span>View Full Resume</span>
              </button>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-xl"
              >
                <Send className="w-4 h-4" />
                <span>Get In Touch</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
