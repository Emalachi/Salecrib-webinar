import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, EyeOff, Ban, AlertCircle, ShieldAlert, Clock, Plus, Settings, Trash2, PlayCircle } from 'lucide-react';

const LIVE_MESSAGES = [
  { id: 1, user: 'Sarah Jenkins', text: 'This presentation is incredible! Thanks so much.', time: '10:02 AM', status: 'approved' },
  { id: 2, user: 'John Doe', text: 'Will there be a replay of this? I have to go soon.', time: '10:05 AM', status: 'approved' },
  { id: 3, user: 'CryptoKing', text: 'BUY MY BITCOIN COURSE HERE link in bio', time: '10:07 AM', status: 'flagged' },
  { id: 4, user: 'Emma Wilson', text: 'I love how actionable these strategies are.', time: '10:12 AM', status: 'approved' },
  { id: 5, user: 'Anon23', text: 'Your software is terrible fake guru!', time: '10:15 AM', status: 'flagged' },
];

const SIMULATED_MESSAGES = [
  { id: 1, user: 'Mike T.', text: 'Hey everyone, joining from Austin, TX!', timeOffset: '00:01:15' },
  { id: 2, user: 'Sarah J.', text: 'Excited for this! I loved the last webinar.', timeOffset: '00:02:30' },
  { id: 3, user: 'David W.', text: 'Will this be recorded? I have a hard stop in 45 mins.', timeOffset: '00:05:00' },
  { id: 4, user: 'Host Admin', text: 'Yes David, the replay will be available immediately after we finish.', timeOffset: '00:05:45', isAdmin: true },
  { id: 5, user: 'Jessica L.', text: 'That framework makes so much sense now.', timeOffset: '00:15:20' },
];

const FIRST_NAMES = ['Alex', 'Sarah', 'Mike', 'Emily', 'Chris', 'Jessica', 'David', 'Ashley', 'James', 'Amanda'];
const LAST_INITIALS = ['A.', 'B.', 'C.', 'D.', 'S.', 'M.', 'T.', 'W.', 'L.', 'R.'];
const COMMENTS = [
  'Wow, this is exactly what I needed to hear.',
  'Can you clarify that last point?',
  'I have been struggling with this for months!',
  'Does this apply to B2B as well?',
  'Mind blown 🤯',
  'Taking so many notes right now.',
  'Will there be a replay?',
  'I am definitely going to implement this tomorrow.',
  'What tool are you using for that?',
  'This is the best training I have attended all year.',
  'Where can I find the link to the templates?',
  'Love the actionable advice.',
  'Is it possible to automate that part?',
  'Ha, I made that same mistake last week.',
  'So true!'
];

export default function Chat() {
  const [mode, setMode] = useState('simulated'); // 'live' | 'simulated'
  const [liveMessages, setLiveMessages] = useState(LIVE_MESSAGES);
  const [simulatedMessages, setSimulatedMessages] = useState(SIMULATED_MESSAGES);

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto h-full lg:h-[calc(100vh-4rem)] flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">
            {mode === 'live' ? 'Chat Moderation' : 'Live Chat Simulant'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {mode === 'live' 
              ? 'Review live chat messages, handle flagged items, and manage users in real-time.'
              : 'Design automated chat sequences that run alongside your evergreen webinars.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <select 
             value={mode}
             onChange={(e) => setMode(e.target.value)}
             className="px-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none"
           >
             <option value="simulated">Evergreen: SaaS Playbook (Simulated)</option>
             <option value="live">Live: 10x Your Marketing Strategy</option>
           </select>
        </div>
      </div>

      {mode === 'live' ? <LiveChatMode messages={liveMessages} setMessages={setLiveMessages} /> : <SimulatedChatMode messages={simulatedMessages} setMessages={setSimulatedMessages} />}
    </div>
  );
}

function LiveChatMode({ messages, setMessages }: any) {
  const [flaggedMessages, setFlaggedMessages] = useState<any[]>([]);

  // Split messages into approved and flagged
  // Wait, better to just edit the component logic
  return (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px] lg:min-h-0">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm flex flex-col min-h-0">
           <div className="p-4 border-b border-slate-100 dark:border-zinc-800/50 flex items-center justify-between">
              <h3 className="font-semibold tracking-tight flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-500" /> Live Feed</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-500">Live</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.filter((m: any) => m.status !== 'flagged').map((msg: any) => (
                <div key={msg.id} className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-semibold text-slate-600 dark:text-zinc-400 shrink-0">
                        {msg.user[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-slate-900 dark:text-zinc-100">{msg.user}</span>
                          <span className="text-xs text-slate-500">{msg.time}</span>
                       </div>
                       <p className="text-sm text-slate-700 dark:text-zinc-300 break-words">{msg.text}</p>
                    </div>
                    <div className="opacity-0 lg:group-hover:opacity-100 flex items-start gap-1 transition-opacity shrink-0">
                       <button onClick={() => setMessages(messages.filter((m: any) => m.id !== msg.id))} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md" title="Delete Message"><EyeOff className="w-4 h-4" /></button>
                       <button onClick={() => setMessages(messages.filter((m: any) => m.user !== msg.user))} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md" title="Ban User"><Ban className="w-4 h-4" /></button>
                    </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm flex flex-col min-h-[400px] lg:min-h-0">
          <div className="p-4 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between bg-rose-50/50 dark:bg-rose-500/5">
              <h3 className="font-semibold tracking-tight text-rose-600 dark:text-rose-400 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Flagged Log</h3>
              <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full">{messages.filter((m: any) => m.status === 'flagged').length}</span>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.filter((m: any) => m.status === 'flagged').map((msg: any) => (
                <div key={msg.id} className="p-3 bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-900/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-rose-900 dark:text-rose-300">{msg.user}</span>
                          <span className="text-xs text-rose-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-rose-800 dark:text-rose-200 mb-3">{msg.text}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setMessages(messages.filter((m: any) => m.user !== msg.user))} className="flex-1 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md">Delete & Ban</button>
                      <button onClick={() => setMessages(messages.map((m: any) => m.id === msg.id ? { ...m, status: 'approved' } : m))} className="flex-1 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md">Approve</button>
                    </div>
                </div>
              ))}
           </div>
        </div>
      </div>
  )
}

function SimulatedChatMode({ messages, setMessages }: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationSeconds, setSimulationSeconds] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimulationSeconds(s => {
          const nextSec = s + 1;
          
          if (nextSec % 4 === 0 && Math.random() > 0.3) {
             const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)]}`;
             const text = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
             
             // Format HH:MM:SS
             const hrs = Math.floor(nextSec / 3600).toString().padStart(2, '0');
             const mins = Math.floor((nextSec % 3600) / 60).toString().padStart(2, '0');
             const secs = (nextSec % 60).toString().padStart(2, '0');
             const timeStr = `${hrs}:${mins}:${secs}`;
             
             const newMsg = {
               id: Date.now(),
               user: name,
               text,
               timeOffset: timeStr,
               isAdmin: false
             };
             setMessages((prev: any) => [...prev, newMsg]);
          }
          return nextSec;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setMessages]);

  useEffect(() => {
    if (isPlaying && listRef.current) {
       listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isPlaying]);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px] lg:min-h-0">
      <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm flex flex-col min-h-0">
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold tracking-tight flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Timeline Editor</h3>
            {isPlaying && (
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Simulating... ({Math.floor(simulationSeconds / 60)}:{Math.floor(simulationSeconds % 60).toString().padStart(2, '0')})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isPlaying ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400'}`}
            >
              {isPlaying ? 'Stop' : 'Play Demo'}
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-md text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
          {messages.map((msg: any, index: number) => (
            <div key={msg.id} className="flex items-start gap-4 p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg group transition-colors border border-transparent hover:border-slate-100 dark:hover:border-zinc-800">
               <div className="shrink-0 w-20 text-right">
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded inline-block mt-0.5">{msg.timeOffset}</span>
               </div>
               
               <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="font-medium text-sm text-slate-900 dark:text-zinc-100">{msg.user}</span>
                     {msg.isAdmin && <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 rounded">Host</span>}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-zinc-300 break-words">{msg.text}</p>
               </div>

               <div className="opacity-0 lg:group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md" title="Edit"><Settings className="w-4 h-4" /></button>
                  <button onClick={() => setMessages(messages.filter((m: any) => m.id !== msg.id))} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md" title="Delete"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
          ))}
          
          <div className="flex justify-center py-4 border-t border-dashed border-slate-200 dark:border-zinc-800">
              <button className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Add next message
              </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm flex flex-col min-h-[400px] lg:min-h-0">
         <div className="p-4 border-b border-slate-100 dark:border-zinc-800/50">
            <h3 className="font-semibold tracking-tight">Timeline Settings</h3>
         </div>
         <div className="p-4 space-y-6 flex-1 overflow-y-auto">
            <div className="space-y-3">
               <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Target Webinar</label>
               <div className="p-3 border border-slate-200 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-800/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="truncate">
                     <p className="text-sm font-medium text-slate-900 dark:text-zinc-100 truncate">SaaS Playbook Masterclass</p>
                     <p className="text-xs text-slate-500">Evergreen Campaign</p>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
               <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Message Rollout</label>
               <select className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none">
                  <option>Exact Timestamps</option>
                  <option>Randomized Intervals (+/- 30s)</option>
               </select>
            </div>

            <div className="space-y-3">
               <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Bot Interaction</label>
               <div className="flex items-center gap-3">
                  <input type="checkbox" id="auto-reply" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                   <label htmlFor="auto-reply" className="text-sm text-slate-600 dark:text-zinc-400">
                     Allow virtual attendees to auto-reply to real users
                   </label>
               </div>
               <div className="flex items-center gap-3">
                  <input type="checkbox" id="dynamic-names" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                   <label htmlFor="dynamic-names" className="text-sm text-slate-600 dark:text-zinc-400">
                     Dynamically change names based on user geolocation
                   </label>
               </div>
            </div>
         </div>
         <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors w-full">
              Save Simulation
            </button>
         </div>
      </div>
    </div>
  )
}

