import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { ProjectModal } from './components/ProjectModal';
import { Experience } from './components/Experience';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { DriveExplorer } from './components/DriveExplorer';
import { Contact } from './components/Contact';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { Project } from './types';
import { CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('santlal_portfolio_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>(() => {
    const saved = localStorage.getItem('santlal_portfolio_photo');
    return saved || '/santlal_photo.jpg';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    localStorage.setItem('santlal_portfolio_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    showToast(!darkMode ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const handleChangePhoto = (newUrl: string) => {
    setCurrentPhotoUrl(newUrl);
    localStorage.setItem('santlal_portfolio_photo', newUrl);
    showToast('Portrait photo updated successfully!');
  };

  const handleResetPhoto = () => {
    const defaultUrl = '/santlal_photo.jpg';
    setCurrentPhotoUrl(defaultUrl);
    localStorage.removeItem('santlal_portfolio_photo');
    showToast('Reset to original photo');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-white text-neutral-900'}`}>
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-neutral-900 text-white text-xs sm:text-sm font-semibold border border-neutral-700 shadow-2xl animate-bounce-short"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Hero Section featuring Santlal Sharma's Photo */}
      <main>
        <Hero
          darkMode={darkMode}
          onOpenResume={() => setResumeOpen(true)}
          currentPhotoUrl={currentPhotoUrl}
          onChangePhoto={handleChangePhoto}
          onResetPhoto={handleResetPhoto}
        />

        {/* About Section */}
        <About
          darkMode={darkMode}
          onOpenResume={() => setResumeOpen(true)}
        />

        {/* Technical Skills & Frameworks */}
        <Skills darkMode={darkMode} />

        {/* Featured Projects & Case Studies */}
        <Projects
          darkMode={darkMode}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        {/* Career & Academic Timeline */}
        <Experience
          darkMode={darkMode}
          onOpenResume={() => setResumeOpen(true)}
        />

        {/* Services & Capabilities */}
        <Services darkMode={darkMode} />

        {/* Endorsements & Reviews */}
        <Testimonials darkMode={darkMode} />

        {/* Google Drive Document & Cloud Asset Hub */}
        <DriveExplorer darkMode={darkMode} onShowToast={showToast} />

        {/* Interactive Contact Section */}
        <Contact darkMode={darkMode} />
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} />

      {/* Interactive Resume Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        darkMode={darkMode}
      />

      {/* Project Deep-Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        darkMode={darkMode}
      />
    </div>
  );
}
