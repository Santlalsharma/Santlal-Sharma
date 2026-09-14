import React, { useState } from 'react';
import { 
  Code2, 
  Server, 
  Database, 
  Wrench, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

interface SkillsProps {
  darkMode: boolean;
}

export const Skills: React.FC<SkillsProps> = ({ darkMode }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categoryIcons: Record<string, React.ElementType> = {
    'Frontend Development': Code2,
    'Backend & APIs': Server,
    'Databases & Cloud': Database,
    'Dev Tools & Design': Wrench,
  };

  const filteredCategories = SKILL_CATEGORIES.map((category) => {
    const matchingSkills = category.skills.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...category,
      skills: matchingSkills,
    };
  }).filter((category) => {
    if (activeCategory !== 'All' && category.name !== activeCategory) {
      return false;
    }
    return category.skills.length > 0;
  });

  return (
    <section
      id="skills"
      className={`py-20 lg:py-28 border-t transition-colors ${
        darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-100' : 'bg-neutral-50/70 border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Skills, Frameworks & Tooling
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            A comprehensive overview of the modern technologies, runtimes, and engineering practices I use daily.
          </p>
        </div>

        {/* Controls Bar: Category Filters + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-12">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory('All')}
              id="skill-filter-all"
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                activeCategory === 'All'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                  : darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              All Domains
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                id={`skill-filter-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                  activeCategory === cat.name
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                    : darkMode
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                    : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Instant Search Box */}
          <div className="relative min-w-[240px]">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (e.g. React, Node)..."
              id="skills-search-input"
              className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                  : 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400'
              }`}
            />
          </div>
        </div>

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCategories.map((category) => {
            const Icon = categoryIcons[category.name] || Code2;
            return (
              <div
                key={category.name}
                id={`category-card-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`p-6 sm:p-7 rounded-3xl border shadow-lg transition-all ${
                  darkMode
                    ? 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700'
                    : 'bg-white border-neutral-200/90 hover:border-neutral-300'
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-neutral-800 border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{category.name}</h3>
                      <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {category.skills.length} core proficiencies
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skill List with Progress and Metrics */}
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-semibold">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                            darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {skill.experience}
                          </span>
                          <span className="font-bold text-orange-500 font-mono text-xs">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Bar Track */}
                      <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-700"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-medium text-neutral-400 mb-2">No matching skills found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="text-sm font-semibold text-orange-500 hover:underline"
            >
              Reset search filters
            </button>
          </div>
        )}

        {/* Tech Ecosystem Summary Pills */}
        <div className={`mt-14 p-6 rounded-2xl border text-center ${
          darkMode ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700 shadow-sm'
        }`}>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3">
            Core Daily Stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Firebase', 'Vite', 'Git', 'REST APIs', 'Docker'].map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                  darkMode
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
