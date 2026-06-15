import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIMEZONES } from '../lib/timezones';
import { 
  Video, Calendar, Clock, Rocket, ArrowLeft, Loader2, Link as LinkIcon, 
  Camera, CheckCircle2, ChevronRight, Settings, Users, Mail, Palette
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

export default function CreateWebinar({ onCancel }: { onCancel: () => void }) {
  const { addDocument } = useFirestore<any>('webinars');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Live');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('14:00');
  const [timezone, setTimezone] = useState(TIMEZONES[0] || 'UTC');
  const [videoLink, setVideoLink] = useState('');

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = async () => {
    if (!title) return;
    setLoading(true);
    try {
      await addDocument({
        title,
        description,
        type,
        date,
        time,
        timezone,
        videoLink,
        status: 'upcoming',
        registrants: 0,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        createdAt: new Date().toISOString()
      });
      onCancel();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950/50 overflow-y-auto w-full">
      <div className="max-w-4xl w-full mx-auto p-6 md:p-10 pb-32">
        
        {/* Header & Progress */}
        <div className="mb-8">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Webinars
          </button>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-semibold tracking-tight">Create Webinar</h1>
              <p className="text-slate-500 dark:text-zinc-400 mt-1">Configure your event settings and launch.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Step {step} of {totalSteps}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between gap-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                  step > i + 1 ? 'bg-indigo-600' : step === i + 1 ? 'bg-indigo-400' : 'bg-slate-200 dark:bg-zinc-800'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 md:p-10 shadow-sm relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Basic Information</h2>
                  <p className="text-slate-500 dark:text-zinc-400 mb-8">Start by providing the details of your webinar.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Webinar Title *</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 10x Your Marketing Strategy in 2026" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Description</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What will attendees learn?" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Format & Type</h2>
                  <p className="text-slate-500 dark:text-zinc-400 mb-8">Choose how you want to deliver your webinar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label 
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                      type === 'Live' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`} 
                    onClick={() => setType('Live')}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      type === 'Live' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                    }`}>
                      <Camera className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Live Format</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">Host your event in real-time. Engage with your audience through chat, Q&A, and live interactions.</p>
                  </label>

                  <label 
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                      type === 'Evergreen' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`} 
                    onClick={() => setType('Evergreen')}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      type === 'Evergreen' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                    }`}>
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Evergreen/Automated</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">Run pre-recorded webinars automatically on a schedule or on-demand, creating a recurring asset.</p>
                  </label>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Schedule & Media</h2>
                  <p className="text-slate-500 dark:text-zinc-400 mb-8">Set when your webinar starts and the video source.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Date</label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Time</label>
                    <div className="relative">
                      <Clock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Timezone</label>
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 mt-8">
                  <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    Video Source {type === 'Evergreen' ? '(Required)' : '(Optional Backup)'}
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      type="text" 
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="e.g. YouTube, Vimeo, or direct MP4 URL" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-semibold mb-4">Ready for Launch</h2>
                <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-lg mx-auto mb-8">
                  Your webinar "{title || 'Untitled'}" is configured and ready to be published. You can add automations and edit the registration page after publishing.
                </p>
                
                <div className="bg-slate-50 dark:bg-zinc-950/50 p-6 rounded-2xl text-left max-w-md mx-auto space-y-3 mb-8 border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Format</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Schedule</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{date} at {time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Timezone</span>
                    <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] text-right">{timezone}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            Back
          </button>
          
          {step < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && !title.trim()}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm transition-all"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
             <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
              {loading ? 'Publishing...' : 'Publish Webinar'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

