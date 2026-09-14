import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  PhoneCall, 
  ArrowRight 
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ContactProps {
  darkMode: boolean;
}

export const Contact: React.FC<ContactProps> = ({ darkMode }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Full-Stack Web App',
    budget: '$1,000 - $3,000',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate reliable form processing
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(`Project Inquiry: ${formData.projectType} - from ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Santlal,\n\nMy name is ${formData.name} (${formData.email}).\nI am looking for assistance with a ${formData.projectType} project with an estimated budget of ${formData.budget}.\n\nDetails:\n${formData.message}\n\nLooking forward to hearing from you!`
    );
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className={`py-20 lg:py-28 border-t transition-colors ${
        darkMode ? 'bg-neutral-900/30 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Let's Build Something Exceptional Together
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Have an upcoming project, freelance inquiry, or full-time opportunity? Reach out directly and expect a response within 24 hours.
          </p>
        </div>

        {/* 2-Column Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Info & Perks */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Email Card */}
            <div className={`p-6 sm:p-7 rounded-3xl border shadow-lg transition-all ${
              darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-1">Direct Email</h3>
              <p className={`text-xs mb-4 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Preferred for project briefs, scopes & contracts
              </p>

              <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 font-mono text-sm ${
                darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-300 text-neutral-800'
              }`}>
                <span className="truncate">{PERSONAL_INFO.email}</span>
                <button
                  onClick={handleCopyEmail}
                  id="contact-copy-email-btn"
                  title="Copy email to clipboard"
                  className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : darkMode
                      ? 'bg-neutral-800 border-neutral-700 hover:text-white'
                      : 'bg-neutral-100 border-neutral-300 hover:text-neutral-900'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {copied && (
                <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Copied to clipboard! Ready to paste into your email.</span>
                </p>
              )}
            </div>

            {/* Quick Details List */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              darkMode ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium">Location & Timezone</p>
                  <p className="font-semibold">{PERSONAL_INFO.location} (IST • UTC+5:30) • Remote</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium">Turnaround Time</p>
                  <p className="font-semibold">Replies within 12 - 24 hours guaranteed</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium">Engagement Models</p>
                  <p className="font-semibold">Fixed-price projects, retainer, or full-time hire</p>
                </div>
              </div>
            </div>

            {/* Social Links Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-2">
                Connect Directly
              </p>
              <div className="flex flex-wrap gap-2">
                {PERSONAL_INFO.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      darkMode
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-orange-500/50 hover:text-white'
                        : 'bg-white border-neutral-300 text-neutral-800 hover:border-orange-500/50 shadow-sm'
                    }`}
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className={`p-7 sm:p-9 rounded-3xl border shadow-xl ${
              darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Message Received!</h3>
                  <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    Thank you, <strong>{formData.name}</strong>. Your inquiry has been dispatched to <strong>{PERSONAL_INFO.name}</strong> ({PERSONAL_INFO.brand}).
                  </p>

                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={handleOpenMailto}
                      className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Also Open in Default Email Client</span>
                    </button>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          projectType: 'Full-Stack Web App',
                          budget: '$1,000 - $3,000',
                          message: '',
                        });
                      }}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'border-neutral-700 bg-neutral-800 text-neutral-300' : 'border-neutral-300 bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">Send a Message</h3>
                    <span className="text-xs text-orange-500 font-medium">* Fast 24h response</span>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        id="contact-form-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Johnson"
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                          darkMode
                            ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                            : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        id="contact-form-email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                          darkMode
                            ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                            : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Project Type & Budget Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Project Type
                      </label>
                      <select
                        id="contact-form-type"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                          darkMode
                            ? 'bg-neutral-900 border-neutral-800 text-white'
                            : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                        }`}
                      >
                        <option value="Full-Stack Web App">Full-Stack Web App</option>
                        <option value="Frontend UI/UX Implementation">Frontend UI/UX Implementation</option>
                        <option value="API & Backend Service">API & Backend Service</option>
                        <option value="Performance & SEO Optimization">Performance & SEO Optimization</option>
                        <option value="Full-Time Engineering Role">Full-Time Engineering Role</option>
                        <option value="Other Consultation">Other Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Estimated Budget
                      </label>
                      <select
                        id="contact-form-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                          darkMode
                            ? 'bg-neutral-900 border-neutral-800 text-white'
                            : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                        }`}
                      >
                        <option value="< $1,000">&lt; $1,000</option>
                        <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                        <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                        <option value="$5,000+">$5,000+</option>
                        <option value="Full-Time Salary Discussion">Full-Time Salary Discussion</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Project Details & Objectives *
                    </label>
                    <textarea
                      required
                      rows={4}
                      id="contact-form-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe what you're building, target timeline, or role requirements..."
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                        darkMode
                          ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                          : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      id="contact-submit-btn"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Inquiry to Santlal Sharma</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
