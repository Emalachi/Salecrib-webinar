import React, { useState } from 'react';
import { PenTool, PlayCircle, Plus, Eye, BarChart2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirestore } from '../hooks/useFirestore';

export default function Polls() {
  const { data: polls, loading, error, addDocument, deleteDocument } = useFirestore<any>('polls');

  const addPoll = () => {
    addDocument({
      question: 'New Poll Question?',
      status: 'draft',
      votes: 0,
      creator: 'You',
      date: 'Just now'
    });
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Polls & Surveys</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Engage your audience with live questions and collect feedback.</p>
        </div>
        <button onClick={addPoll} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
          <Plus className="w-4 h-4" />
          Create Poll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Live Poll Preview Card */}
         <div className="md:col-span-1 border border-indigo-200 dark:border-indigo-500/30 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
               <span className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Now
               </span>
               <span className="text-xs font-medium text-slate-500">142 Votes</span>
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-zinc-100 mb-6 font-display">
              What is your biggest marketing bottleneck right now?
            </h3>
            
            <div className="space-y-3">
               <PollOption label="Lead Generation" percentage={45} />
               <PollOption label="Conversion Rate" percentage={30} />
               <PollOption label="Traffic / SEO" percentage={15} />
               <PollOption label="Content Creation" percentage={10} />
            </div>
         </div>

         {/* Grid of other polls */}
         <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden text-sm">
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800/50">
               <h3 className="font-semibold tracking-tight text-base">Poll Library</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {loading && <div className="p-8 text-center text-slate-500">Loading polls...</div>}
              {error && <div className="p-8 text-center text-red-500">Error: {error}</div>}
              {!loading && polls.map(poll => (
                <div key={poll.id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       {poll.status === 'live' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                       <h4 className="font-medium text-slate-900 dark:text-zinc-100 text-base">{poll.question}</h4>
                     </div>
                     <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1.5"><PenTool className="w-3.5 h-3.5" /> {poll.creator}</span>
                        <span>{poll.date}</span>
                        <span className="capitalize px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-medium">{poll.status}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                     <div className="text-right mr-2 hidden sm:block">
                        <div className="font-semibold text-slate-900 dark:text-zinc-100">{poll.votes || 0}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Votes</div>
                     </div>
                     <button className="p-2 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors" title="Launch Poll">
                       <PlayCircle className="w-4 h-4" />
                     </button>
                     <button className="p-2 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors" title="View Results">
                       <BarChart2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => deleteDocument(poll.id)} className="p-2 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 hover:text-rose-600 rounded-lg transition-colors" title="Delete Poll">
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              ))}
              {!loading && polls.length === 0 && <div className="p-8 text-center text-slate-500">No polls found.</div>}
            </div>
         </div>
      </div>
    </div>
  )
}

function PollOption({ label, percentage }: any) {
  return (
    <div className="relative">
       <div className="flex justify-between text-sm mb-1 px-1 relative z-10 text-slate-700 dark:text-zinc-300">
         <span className="font-medium">{label}</span>
         <span>{percentage}%</span>
       </div>
       <div className="h-8 w-full bg-white/50 dark:bg-zinc-800/50 rounded overflow-hidden absolute top-0 left-0">
          <div className="h-full bg-indigo-500/20 dark:bg-indigo-500/30 rounded" style={{ width: `${percentage}%` }} />
       </div>
    </div>
  )
}
