import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, ShieldCheck, ArrowRight, Video, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { RenderBlock, DEFAULT_BLOCKS, Block } from './LandingPageBuilder';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function RegistrationForm({ onComplete, slug }: { onComplete: () => void, slug?: string | null }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [webinar, setWebinar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchWebinar() {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'webinars'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setWebinar({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id });
        } else {
          setErrorMsg("Webinar not found.");
        }
      } catch (err: any) {
        console.error("Error loading webinar:", err);
        setErrorMsg("Failed to load webinar details.");
      } finally {
        setLoading(false);
      }
    }
    fetchWebinar();
  }, [slug]);

  if (loading) {
     return <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4 text-slate-500">Loading...</div>;
  }

  if (errorMsg && !webinar) {
     return (
       <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
         <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 p-8 text-center text-slate-600 dark:text-slate-400">
           <AlertTriangle className="w-12 h-12 mx-auto text-rose-500 mb-4" />
           <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Oops!</h2>
           <p>{errorMsg}</p>
         </div>
       </div>
     );
  }

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
    <div className="min-h-screen bg-black flex flex-col font-sans">
      <div className="flex-1 flex flex-col w-full">
        {blocks.map((block: Block) => (
          <React.Fragment key={block.id}>
            <RenderBlock block={block} onActionClick={() => setShowModal(true)} webinar={webinar} />
          </React.Fragment>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
            <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Reserve Your Seat</h2>
              <button disabled={submitting} onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 bg-zinc-950/50">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!webinar?.id || !webinar?.ownerUid) {
                    alert("Cannot register: Webinar configuration is incomplete.");
                    return;
                  }
                  
                  setSubmitting(true);
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name') as string;
                  const email = formData.get('email') as string;
                  const sessionTime = formData.get('sessionTime') as string;
                  
                  if (name && email) {
                    try {
                      await addDoc(collection(db, 'registrations'), {
                        name,
                        email,
                        webinarId: webinar.id,
                        webinar: webinar.title,
                        ownerUid: webinar.ownerUid,
                        source: 'Organic',
                        date: new Date().toLocaleDateString(),
                        createdAt: new Date().toISOString(),
                        ...(sessionTime ? { sessionTime } : {}),
                        status: 'registered'
                      });
                      setIsSubmitted(true);
                      setShowModal(false);
                    } catch (err: any) {
                      console.error("Failed to save registration:", err);
                      alert(err?.message || "Failed to register. Please try again.");
                    } finally {
                      setSubmitting(false);
                    }
                  }
                }} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Jane Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-black border border-zinc-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium transition-all focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-black border border-zinc-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium transition-all focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                {webinar?.isJitMode && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Select Session</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                      <select name="sessionTime" required className="w-full pl-12 pr-4 py-3.5 bg-black border border-zinc-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium transition-all appearance-none cursor-pointer focus:border-indigo-500/50">
                        <option value="">Choose a time...</option>
                        {Array.from({length: 4}).map((_, i) => {
                          const date = new Date();
                          date.setMinutes(0, 0, 0);
                          date.setHours(date.getHours() + 1 + i*3); 
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
                  disabled={submitting}
                  className="w-full py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-70"
                >
                  {submitting ? 'Reserving...' : 'Watch Now For Free'}
                  {!submitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>

                <div className="flex items-center justify-center gap-2 pt-6 text-xs text-zinc-600">
                  <ShieldCheck className="w-4 h-4 text-zinc-500" />
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
