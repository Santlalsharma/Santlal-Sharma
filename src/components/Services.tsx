import React from 'react';
import { 
  Code, 
  Sparkles, 
  Layers, 
  Zap, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { SERVICES } from '../data/portfolioData';

interface ServicesProps {
  darkMode: boolean;
}

export const Services: React.FC<ServicesProps> = ({ darkMode }) => {
  const iconMap: Record<string, React.ElementType> = {
    Code,
    Sparkles,
    Layers,
    Zap,
  };

  return (
    <section
      id="services"
      className={`py-20 lg:py-28 border-t transition-colors ${
        darkMode ? 'bg-neutral-900/30 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Services & Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            How I Can Help Your Product
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Full-lifecycle engineering support—from initial prototype and wireframe implementation to production scaling and SEO performance.
          </p>
        </div>

        {/* Services 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.iconName] || Code;
            return (
              <div
                key={service.id}
                id={`service-${service.id}`}
                className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  darkMode
                    ? 'bg-neutral-950/70 border-neutral-800 hover:border-orange-500/40'
                    : 'bg-neutral-50/80 border-neutral-200 hover:border-orange-500/40 shadow-sm'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold tracking-tight mb-3">
                    {service.title}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 mb-8">
                    {service.deliverables.map((deliv, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-neutral-800 border-neutral-200">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors group"
                  >
                    <span>Discuss A Project In This Domain</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
