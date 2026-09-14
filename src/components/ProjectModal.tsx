import React from 'react';
import { X, ExternalLink, Github, CheckCircle2, Sparkles, Layers, Award } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  darkMode: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, darkMode }) => {
  if (!project) return null;

  return (
    <div
      id="project-detail-modal"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-8 ${
          darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-project-modal-btn"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Header Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 uppercase tracking-wide">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-neutral-950 uppercase tracking-wide">
                  Featured Case Study
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">{project.title}</h2>
            <p className="text-sm text-neutral-300 mt-1">{project.tagline}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Metrics Summary */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center ${
                    darkMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <p className="text-lg font-bold text-orange-500">{m.value}</p>
                  <p className="text-xs text-neutral-400">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Overview */}
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 mb-2 text-orange-500">
              <Sparkles className="w-4 h-4" />
              <span>Project Overview</span>
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Architectural Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-base font-bold flex items-center gap-2 mb-3 text-orange-500">
                <Layers className="w-4 h-4" />
                <span>Key Features & Architecture</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm ${
                      darkMode ? 'bg-neutral-800/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Tags */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Technologies & Libraries
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                    darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-200' : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t dark:border-neutral-800 border-neutral-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Demo</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                    darkMode ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white' : 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>Repository</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-200"
            >
              Close Window
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
