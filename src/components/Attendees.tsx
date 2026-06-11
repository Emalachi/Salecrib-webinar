import React from 'react';
import { Mail, Clock, PieChart, Users, ArrowUpRight, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirestore } from '../hooks/useFirestore';

export default function Attendees() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: attendees, loading, error } = useFirestore<any>('attendees');

  const filteredAttendees = attendees.filter(attendee => {
    return (attendee.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
           (attendee.email || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Attendees</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Track presence, watch time, and engagement of your webinar viewers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Stats title="Total Attendees" value="1,850" desc="Across all webinars" />
         <Stats title="Avg. Watch Time" value="45m" desc="Target: 60m" />
         <Stats title="Completion Rate" value="68%" desc="+5% from last month" />
         <Stats title="Highly Engaged" value="420" desc=">80% watch time" />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50 dark:bg-zinc-950/50">
           <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendees..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none"
              />
            </div>
            <select className="px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none w-full sm:w-auto">
              <option>All Webinars</option>
              <option>10x Your Marketing Strategy</option>
              <option>SaaS Growth Playbook</option>
            </select>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-50/50 dark:bg-zinc-900/50">
                <th className="px-6 py-4 font-medium">Attendee</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Watch Time</th>
                <th className="px-6 py-4 font-medium">Completion</th>
                <th className="px-6 py-4 font-medium text-center">Questions Asked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading attendees...</td></tr>
              )}
              {error && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-red-500">Error: {error}</td></tr>
              )}
              {!loading && filteredAttendees.map(attendee => (
                <tr key={attendee.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-zinc-100">{attendee.name}</div>
                    <div className="text-xs text-slate-500">{attendee.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                      attendee.status === 'live' ? "text-emerald-600 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" : "text-slate-600 bg-slate-100 border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                    )}>
                      {attendee.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {attendee.status === 'live' ? 'Watching Now' : 'Left Session'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-zinc-300">
                    {attendee.watchTime || '0m'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", (attendee.completion || 0) > 80 ? "bg-emerald-500" : (attendee.completion || 0) > 40 ? "bg-amber-500" : "bg-rose-500")} 
                          style={{ width: `${attendee.completion || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8">{attendee.completion || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-700 dark:text-zinc-300">
                    {attendee.questions || 0}
                  </td>
                </tr>
              ))}
              {!loading && filteredAttendees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No attendees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Stats({ title, value, desc }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">{title}</h3>
      <div className="text-2xl font-display font-semibold mb-1">{value}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
  )
}
