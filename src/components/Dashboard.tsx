import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  PlayCircle, 
  Clock, 
  DollarSign,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import type { ViewState } from '../App';
import { useFirestore } from '../hooks/useFirestore';

export default function Dashboard({ onNavigate }: { onNavigate: (view: ViewState) => void }) {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const { data: notifications, loading: notifLoading } = useFirestore<any>('notifications');
  const { data: registrations, loading: regLoading } = useFirestore<any>('registrations');
  const { data: attendees, loading: attLoading } = useFirestore<any>('attendees');

  const { currentRegs, priorRegs, currentAtts, priorAtts, avgWatchT, chartData } = useMemo(() => {
    let days = 7;
    if (dateRange === 'Today') days = 1;
    else if (dateRange === '30 Days') days = 30;

    const now = Date.now();
    const periodMs = days * 24 * 60 * 60 * 1000;
    const currentStart = now - periodMs;
    const priorStart = currentStart - periodMs;

    let currentRegs = 0, priorRegs = 0;
    let currentAtts = 0, priorAtts = 0;
    let totalWatchMins = 0;

    const buckets: Record<string, { registrations: number, attendees: number }> = {};
    if (days === 1) {
      for (let i = 0; i < 24; i += 3) {
        const d = new Date(now - (23 - i) * 60 * 60 * 1000);
        buckets[`${d.getHours()}:00`] = { registrations: 0, attendees: 0 };
      }
    } else {
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now - i * 24 * 60 * 60 * 1000);
        buckets[d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })] = { registrations: 0, attendees: 0 };
      }
    }

    const bucketKeys = Object.keys(buckets);

    registrations?.forEach((r: any) => {
      const ts = r.createdAt || 0;
      if (ts >= currentStart) {
        currentRegs++;
        const d = new Date(ts);
        const dayKey = days === 1 ? `${Math.floor(d.getHours() / 3) * 3}:00` : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        if (buckets[dayKey]) buckets[dayKey].registrations++;
      } else if (ts >= priorStart) {
        priorRegs++;
      }
    });

    attendees?.forEach((a: any) => {
      const ts = a.createdAt || 0;
      if (ts >= currentStart) {
        currentAtts++;
        if (a.watchTime) {
          const m = parseInt(a.watchTime.replace(/[^0-9]/g, ''));
          if (!isNaN(m)) totalWatchMins += m;
        }
        const d = new Date(ts);
        const dayKey = days === 1 ? `${Math.floor(d.getHours() / 3) * 3}:00` : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        if (buckets[dayKey]) buckets[dayKey].attendees++;
      } else if (ts >= priorStart) {
        priorAtts++;
      }
    });

    const data = bucketKeys.map(k => ({
      name: k,
      registrations: buckets[k].registrations,
      attendees: buckets[k].attendees
    }));

    const avgWatchT = currentAtts > 0 ? Math.round(totalWatchMins / currentAtts) : 0;

    return { currentRegs, priorRegs, currentAtts, priorAtts, chartData: data, avgWatchT };
  }, [registrations, attendees, dateRange]);

  const calcChange = (curr: number, prior: number) => {
    if (prior === 0) return curr === 0 ? "0%" : "—";
    const percent = ((curr - prior) / prior) * 100;
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  const regChange = calcChange(currentRegs, priorRegs);
  const attChange = calcChange(currentAtts, priorAtts);
  
  const loading = regLoading || attLoading;

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-[1200px] mx-auto space-y-8 lg:space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-slate-900 dark:text-zinc-50">Executive Overview</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Platform performance for your webinars and funnels.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1 shadow-sm shrink-0">
          {['Today', 'Last 7 Days', '30 Days'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={cn(
                "px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all",
                dateRange === range 
                  ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registrations" value={loading ? "..." : currentRegs.toString()} change={regChange} trend={regChange.startsWith('-') ? 'down' : 'up'} icon={Users} />
        <StatCard title="Live Attendees" value={loading ? "..." : currentAtts.toString()} change={attChange} trend={attChange.startsWith('-') ? 'down' : 'up'} icon={PlayCircle} />
        <StatCard title="Avg. Watch Time" value={loading ? "..." : (currentAtts > 0 ? `${avgWatchT}m` : "Not tracked yet")} change="—" trend="up" icon={Clock} />
        <StatCard title="Revenue Generated" value="Not tracked yet" change="—" trend="up" icon={DollarSign} /> {/* Revenue requires transaction field tracking on registrations/offers */}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-100">Registrations vs Attendees</h3>
            <p className="text-sm text-slate-500 mt-1">Comparing sign-ups with actual show-up rates over the selected period.</p>
          </div>
          <button 
           onClick={() => onNavigate('analytics')}
           className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors whitespace-nowrap"
          >
           View Deep Analytics &rarr;
          </button>
        </div>
        <div className="h-[350px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" opacity={0.4} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--muted-foreground)' }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--muted-foreground)' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: 500 }}
                labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="registrations" name="Registrations" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" activeDot={{ r: 6, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="attendees" name="Attendees" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" activeDot={{ r: 6, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-100">Notification Center</h3>
        </div>
        <div className="space-y-4">
          {notifLoading ? (
            <div className="py-4 text-center text-sm text-slate-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-slate-500">No new notifications.</div>
          ) : (
            notifications.map((notif: any) => (
              <div key={notif.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-800/20">
                <div className="shrink-0 mt-1">
                  {notif.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : notif.type === 'alert' ? (
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Bell className="w-5 h-5 text-indigo-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-zinc-100">{notif.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">{notif.message}</p>
                  <div className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon }: { title: string, value: string, change: string, trend: 'up' | 'down', icon: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-sm group hover:border-indigo-500/30 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center text-slate-600 dark:text-zinc-400 transition-transform group-hover:scale-110 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-display font-semibold tracking-tight text-slate-900 dark:text-zinc-50">{value}</div>
        <div className={cn(
          "flex items-center text-sm font-medium mb-1",
          trend === 'up' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
          {change}
        </div>
      </div>
    </div>
  );
}
