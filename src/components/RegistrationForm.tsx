import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, ShieldCheck, ArrowRight, Video, CheckCircle2, X } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { RenderBlock, DEFAULT_BLOCKS, Block } from './LandingPageBuilder';

export default function RegistrationForm({ onComplete, slug }: { onComplete: () => void, slug?: string | null }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { addDocument } = useFirestore<any>('registrations');
  const { data: webinars } = useFirestore<any>('webinars');
  
  const webinar = webinars?.find((w: any) => w.slug === slug) || null;
  const title = webinar?.title || '10x Your Marketing Strategy Using Automated Funnels';
  
  const blocks = webinar?.landingPageBlocks || DEFAULT_BLOCKS;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Registration Confirmed!</h2>
          <p className="text-slate-600 dark:text-zinc-400 mb-8">
            Your seat has been reserved. You can enter the webinar room now.
          </p>
          <button 
            onClick={onComplete}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            Enter Webinar Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans">
      <div className="flex-1 flex flex-col w-full">
        {blocks.map((block: Block) => (
          <React.Fragment key={block.id}>
            <RenderBlock block={block} onActionClick={() => setShowModal(true)} webinar={webinar} />
          </React.Fragment>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Reserve Your Seat</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-zinc-950/50">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name') as string;
                  const email = formData.get('email') as string;
                  
                  if (name && email) {
                    try {
                      await addDocument({
                        name,
                        email,
                        webinar: title,
                        source: 'Organic',
                        date: new Date().toLocaleDateString(),
                        createdAt: new Date().toISOString()
                      });
                      setIsSubmitted(true);
                      setShowModal(false);
                    } catch (err) {
                      console.error("Failed to save registration:", err);
                    }
                  }
                }} 
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                {webinar?.isJitMode && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Select Session</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select required className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                        <option value="">Choose a time...</option>
                        {Array.from({length: 4}).map((_, i) => {
                          const date = new Date();
                          date.setMinutes(0, 0, 0);
                          date.setHours(date.getHours() + 1 + i*3); // Next boundary, then +3h, +6h
                          const prefix = i === 0 ? "Today" : date.getDate() !== new Date().getDate() ? "Tomorrow" : "Today";
                          return (
                             <option key={i} value={date.toISOString()}>{prefix} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group mt-2"
                >
                  Watch Now For Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Your information is secure. Unsubscribe at any time.</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
