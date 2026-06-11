import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, PlayCircle, Map, LayoutDashboard, MessageSquare, MailOpen, Globe2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '../lib/utils';
import { useFirestore } from '../hooks/useFirestore';

export default function Analytics() {
  const { data, loading, error } = useFirestore<any>('analytics');

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Advanced Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Deep dive into performance, attribution, and multi-webinar metrics.</p>
        </div>
        <select className="px-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none w-full sm:w-auto">
          <option>Year to Date</option>
          <option>Last Quarter</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold tracking-tight mb-6">Growth Over Time</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {data && data.length > 0 ? (
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="attendees" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAtt)" />
                </AreaChart>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-500">
                  {loading ? 'Loading analytics...' : 'No analytical data available.'}
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Pipeline Value</p>
                <div className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">$30,486</div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-500" /> +12% from last period</div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <BarChart3 className="w-6 h-6" />
              </div>
           </div>

           <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
             <h3 className="font-semibold tracking-tight text-sm mb-4">Traffic Sources</h3>
             <div className="space-y-4">
                <SourceRow label="Organic Search" value="45%" color="bg-indigo-500" />
                <SourceRow label="Facebook Ads" value="30%" color="bg-blue-500" />
                <SourceRow label="Email List" value="15%" color="bg-emerald-500" />
                <SourceRow label="Direct/Partners" value="10%" color="bg-amber-500" />
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Engagement Center */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold tracking-tight">Engagement Center</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Chat Messages" value="1,240" trend="+12%" positive />
            <MetricRow label="Questions Asked" value="184" trend="+5%" positive />
            <MetricRow label="Poll Responses" value="890" trend="-2%" positive={false} />
            <MetricRow label="CTA Clicks" value="620" trend="+18%" positive />
          </div>
        </div>

        {/* Email Analytics */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <MailOpen className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold tracking-tight">Email Analytics</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Emails Sent" value="12,450" trend="-" positive={true} />
            <MetricRow label="Avg. Open Rate" value="42.8%" trend="+4%" positive />
            <MetricRow label="Avg. Click Rate" value="12.4%" trend="+1.2%" positive />
            <MetricRow label="Unsubscribe Rate" value="0.8%" trend="-0.1%" positive />
          </div>
        </div>

        {/* Audience Insights */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Globe2 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold tracking-tight">Top Audience</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600 dark:text-zinc-400">United States</span>
                 <span className="font-medium">45%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 rounded-full" style={{ width: '45%' }} />
               </div>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600 dark:text-zinc-400">United Kingdom</span>
                 <span className="font-medium">20%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 rounded-full" style={{ width: '20%' }} />
               </div>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600 dark:text-zinc-400">Canada</span>
                 <span className="font-medium">15%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 rounded-full" style={{ width: '15%' }} />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendee Performance */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold tracking-tight">Attendee Performance</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Avg. Watch Time" value="48 mins" trend="+4 mins" positive />
            <MetricRow label="Stayed Until Offer" value="45%" trend="+2%" positive />
            <MetricRow label="Clicked Offer" value="12%" trend="+1.5%" positive />
            <MetricRow label="Drop-off First 10m" value="15%" trend="-3%" positive />
          </div>
        </div>

        {/* Video Viewer Retention */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold tracking-tight">Audience Retention</h3>
            </div>
            <span className="text-xs font-medium text-slate-500">Avg across all videos</span>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { time: '0m', viewers: 100 },
                { time: '10m', viewers: 85 },
                { time: '20m', viewers: 75 },
                { time: '30m', viewers: 68 },
                { time: '40m', viewers: 55 },
                { time: '50m', viewers: 45 },
                { time: '60m', viewers: 42 },
              ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value) => [`${value}% Viewers`, 'Retention']}
                />
                <Area type="monotone" dataKey="viewers" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRetention)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricRow({ label, value, trend, positive }: { label: string, value: string, trend: string, positive: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-800/50 last:border-0">
      <span className="text-sm text-slate-600 dark:text-zinc-400">{label}</span>
      <div className="flex items-center gap-4">
        <span className="font-semibold text-sm">{value}</span>
        <span className={cn(
          "text-xs font-medium w-12 text-right",
          positive ? "text-emerald-500" : "text-rose-500"
        )}>{trend}</span>
      </div>
    </div>
  )
}

function SourceRow({ label, value, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-600 dark:text-zinc-300 font-medium">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: value }} />
      </div>
    </div>
  )
}
