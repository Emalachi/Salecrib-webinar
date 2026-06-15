import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TIMEZONES } from '../lib/timezones';
import { Video, Calendar, Clock, Rocket, ArrowLeft, Loader2, Link as LinkIcon, Camera } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

export default function CreateWebinar({ onCancel }: { onCancel: () => void }) {
  const { addDocument } = useFirestore<any>('webinars');
  const [loading, setLoading] = useState(false);
  
  // Single form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Live');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('14:00');
  const [timezone, setTimezone] = useState(TIMEZONES[0] || 'UTC');
  const [videoLink, setVideoLink] = useState('');

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
      onCancel(); // Go back to list immediately
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950/50 overflow-y-auto w-full">
      <div className="max-w-3xl w-full mx-auto p-6 md:p-10 space-y-8 pb-32 sm:pb-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={onCancel}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Webinars
            </button>
            <h1 className="text-3xl font-display font-semibold tracking-tight">Setup Webinar</h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1">Get your event ready in seconds.</p>
          </div>
          <button 
            onClick={handleCreate}
            disabled={!title || loading}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-sm transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            Launch Webinar
          </button>
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-8"
        >
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b border-slate-100 dark:border-zinc-800 pb-2">Basic Info</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Webinar Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10x Your Marketing Strategy in 2026" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Description</label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will attendees learn?" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-slate-900 dark:text-white leading-relaxed"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${type === 'Live' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'}`} onClick={() => setType('Live')}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${type === 'Live' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'}`}>
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Live Form</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400">Real-time stream</div>
                  </div>
                </div>
              </label>
              <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${type === 'Evergreen' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'}`} onClick={() => setType('Evergreen')}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${type === 'Evergreen' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'}`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Evergreen</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400">Pre-recorded</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold border-b border-slate-100 dark:border-zinc-800 pb-2">Scheduling & Media</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Time</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Timezone</label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium appearance-none"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Video Link {type === 'Evergreen' ? '' : '(Optional Backup)'}</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="e.g. YouTube, Vimeo, or MP4 URL" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Mobile action button (sticky bottom flex) */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
          <button 
            onClick={handleCreate}
            disabled={!title || loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm transition-all text-base"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
            {loading ? 'Creating...' : 'Launch Webinar'}
          </button>
        </div>
      </div>
    </div>
  )
}
