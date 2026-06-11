import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Monitor, 
  Smartphone, 
  Type, 
  Image as ImageIcon, 
  Square,
  AlignLeft,
  Undo,
  Redo,
  LayoutTemplate
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function EmailBuilder({ template, onClose }: { template: { title: string, sendTime: string }, onClose: () => void }) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [subject, setSubject] = useState(`Your link for: 10x Your Marketing Strategy`);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 text-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Automations
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <h2 className="text-sm font-medium hidden sm:block">{template.title}</h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
          <button 
            onClick={() => setDevice('desktop')}
            className={cn("p-1.5 rounded-md transition-colors", device === 'desktop' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDevice('mobile')}
            className={cn("p-1.5 rounded-md transition-colors", device === 'mobile' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Save className="w-4 h-4" />
            Save Email
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Settings) */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-medium text-slate-200">Email Settings</h3>
          </div>
          
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Send Time</label>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-300">{template.sendTime}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Dynamic Variables</label>
               <div className="flex flex-wrap gap-2">
                 {['{{first_name}}', '{{webinar_link}}', '{{date_time}}', '{{host_name}}'].map(variable => (
                   <button key={variable} className="px-2 py-1 text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded border border-slate-700 font-mono transition">
                     {variable}
                   </button>
                 ))}
               </div>
               <p className="text-[11px] text-slate-500 mt-2">Click to copy variable to clipboard.</p>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-8 flex justify-center pb-32">
          <div className={cn(
            "transition-all duration-300 transform origin-top flex flex-col",
            device === 'desktop' ? "w-full max-w-2xl" : "w-[375px] mt-4"
          )}>
            
            {/* Email Client Header Mockup */}
            <div className="bg-slate-100 dark:bg-zinc-900 rounded-t-xl border border-slate-200 dark:border-zinc-800 p-4 shrink-0 shadow-sm relative z-10">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                     <span className="text-indigo-600 font-bold">WL</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">From: <span className="text-slate-900 dark:text-white font-medium">WebinarLabs</span></p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">To: <span className="text-slate-900 dark:text-white">attendee@example.com</span></p>
                  </div>
               </div>
               <p className="text-lg font-bold text-slate-900 dark:text-white mt-3 truncate">{subject}</p>
            </div>

            {/* Email Body contentEditable fake */}
            <div className="bg-white dark:bg-zinc-950 w-full rounded-b-xl min-h-[500px] border border-t-0 border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
               <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />
               <div className="p-8 outline-none prose prose-indigo max-w-none dark:prose-invert">
                 <h2>Here's your unique access link...</h2>
                 <p>Hi {'{{first_name}}'},</p>
                 <p>You're successfully registered for our upcoming masterclass: <strong>10x Your Marketing Strategy</strong>.</p>
                 <p>We're going to dive deep into exactly how the top 1% of SaaS companies build automated lead generation machines.</p>
                 
                 <div className="my-8 p-6 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-xl text-center">
                    <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-1">When</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-6">{'{{date_time}}'}</p>
                    
                    <a href="#" className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/30 transition no-underline">
                      Join The Webinar Room
                    </a>
                    <p className="text-xs text-slate-500 mt-3">* Save this email. This link is unique to you.</p>
                 </div>

                 <p>We recommend arriving 5 minutes early. Spaces are strictly limited and we will lock the room once we hit capacity.</p>
                 <p>See you inside!</p>
                 <p>Best regards,<br/><strong>The WebinarLabs Team</strong></p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
