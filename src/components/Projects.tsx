import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  ArrowUpRight, 
  Sparkles, 
  Layers, 
  ChevronRight 
} from 'lucide-react';
import { Project } from '../types';
import { PROJECTS } from '../data/portfolioData';

interface ProjectsProps {
  darkMode: boolean;
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ darkMode, onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Full-Stack', 'Frontend', 'Mobile & UI/UX', 'Open Source'];

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.category === activeFilter;
  });

  return (
    <section
      id="projects"
      className={`py-20 lg:py-28 border-t transition-colors ${
        darkMode ? 'bg-neutral-900/20 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subheading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Recent Work & Case Studies
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            A curated selection of client portals, scalable web platforms, and open-source applications built by Santlal Sharma.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              id={`project-tab-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white border-orange-500 shadow-md shadow-orange-500/25'
                  : darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className={`group rounded-3xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                darkMode
                  ? 'bg-neutral-950/70 border-neutral-800 hover:border-orange-500/40 hover:shadow-orange-500/5'
                  : 'bg-white border-neutral-200 hover:border-orange-500/40 hover:shadow-orange-500/10 shadow-sm'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-800 cursor-pointer" onClick={() => onSelectProject(project)}>
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Floating Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-neutral-900/80 backdrop-blur-md text-orange-400 border border-orange-500/30">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-neutral-950">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Quick inspect button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <span className="px-4 py-2 rounded-xl bg-white text-neutral-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                    <span>Inspect Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onSelectProject(project)}
                    className="text-xl font-bold tracking-tight mb-1.5 group-hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <p className={`text-xs font-medium mb-3 line-clamp-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {project.tagline}
                  </p>
                  <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${
                          darkMode ? 'bg-neutral-900 border border-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-md text-neutral-400">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t dark:border-neutral-800/80 border-neutral-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 group/btn"
                  >
                    <span>Read Case Study</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View GitHub Repository"
                        className={`p-2 rounded-lg border transition-colors ${
                          darkMode ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open Live Application"
                        className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
