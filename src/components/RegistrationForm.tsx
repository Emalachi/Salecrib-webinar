import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, ShieldCheck, ArrowRight, Video, CheckCircle2 } from 'lucide-react';

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div className="flex gap-4 mb-8">
      {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, index) => {
        const value = Object.values(timeLeft)[index];
        return (
          <div key={label} className="flex flex-col items-center">
            <div className="bg-indigo-800/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-xl p-3 md:p-4 min-w-[70px] md:min-w-[80px] text-center border border-indigo-700/50 dark:border-zinc-700/50 shadow-xl">
              <span className="text-2xl md:text-3xl font-display font-bold text-white mb-1 block">
                {value.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs text-indigo-300 dark:text-zinc-400 uppercase tracking-wider font-medium">
                {label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default function RegistrationForm({ onComplete }: { onComplete: () => void }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Set target date to next hour or 15 mins for dynamic evergreen feel
  const [targetDate] = useState(() => {
    const t = new Date();
    t.setMinutes(t.getMinutes() + 15); // Auto-starts in 15 minutes
    return t;
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-zinc-50 mb-2">You're Registered!</h2>
          <p className="text-slate-600 dark:text-zinc-400 mb-8">
            Check your inbox for the unique joining link. We've also sent a calendar invite.
          </p>
          <button
            onClick={onComplete}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Enter Webinar Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Left Column: Details */}
      <div className="flex-1 bg-indigo-900 dark:bg-zinc-900 text-white p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/50 dark:bg-zinc-800/50 border border-indigo-700/50 dark:border-zinc-700/50 text-indigo-200 dark:text-zinc-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Evergreen Masterclass
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
            10x Your Marketing Strategy Using Automated Funnels
          </h1>
          <p className="text-indigo-200 dark:text-zinc-400 text-lg mb-8">
            Learn the exact system we used to scale 50+ SaaS companies to over $10M ARR using high-converting evergreen webinars.
          </p>

          <CountdownTimer targetDate={targetDate} />

          <div className="space-y-4 text-indigo-100 dark:text-zinc-300">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-400 dark:text-zinc-500" />
              <span>Available On-Demand Today</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-400 dark:text-zinc-500" />
              <span>60 Minutes + Live Q&A Simulation</span>
            </div>
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-indigo-400 dark:text-zinc-500" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 bg-white dark:bg-zinc-950">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-zinc-50 mb-2">Reserve Your Seat</h2>
          <p className="text-slate-500 dark:text-zinc-400 mb-8">Watch the training instantly. Fill out the form below to get access.</p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitted(true);
            }} 
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="jane@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              Watch Now For Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500 dark:text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Your information is secure. Unsubscribe at any time.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
