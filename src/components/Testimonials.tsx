import React from 'react';
import { Star, MessageSquareQuote, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../data/portfolioData';

interface TestimonialsProps {
  darkMode: boolean;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ darkMode }) => {
  return (
    <section
      id="testimonials"
      className={`py-20 lg:py-28 border-t transition-colors ${
        darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-100' : 'bg-neutral-50/70 border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            What Collaborators Say
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Feedback from team leads, founders, and product managers who worked alongside Santlal Sharma.
          </p>
        </div>

        {/* Testimonials 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              id={`testimonial-${test.id}`}
              className={`p-7 rounded-3xl border flex flex-col justify-between transition-all hover:shadow-xl ${
                darkMode
                  ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
              }`}
            >
              <div>
                {/* Stars Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className={`text-sm sm:text-base leading-relaxed italic mb-6 ${
                  darkMode ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  "{test.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t dark:border-neutral-800 border-neutral-100 flex items-center gap-3">
                <img
                  src={test.avatar}
                  alt={test.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/30"
                />
                <div>
                  <h4 className="font-bold text-sm">{test.name}</h4>
                  <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {test.role} • <span className="font-semibold text-orange-500">{test.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
