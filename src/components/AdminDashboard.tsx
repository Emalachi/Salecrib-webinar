import React from 'react';
import { Users, CreditCard, Activity, Box, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { ViewState } from '../App';
import { useFirestore } from '../hooks/useFirestore';

export default function AdminDashboard({ onNavigate }: { onNavigate: (view: ViewState) => void }) {
  const { data: users, loading } = useFirestore<any>('users');

  const totalUsers = users ? users.length : 0;
  
  // Sort users by createdAt descending to get recent users
  const recentUsers = users ? [...users].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5) : [];

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Platform overview and user management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Users" 
          value={loading ? "..." : totalUsers.toString()} 
          change="—" 
          icon={Users}
          onClick={() => onNavigate('team')} 
        />
        <StatsCard 
          title="Active Subscriptions" 
          value="Not tracked yet" 
          change="—" 
          icon={CreditCard} 
        />
        <StatsCard 
          title="System Health" 
          value="Not tracked yet" 
          change="—" 
          icon={Activity} 
        />
        <StatsCard 
          title="Platform Plugins" 
          value="Not tracked yet" 
          change="—" 
          icon={Box}
          onClick={() => onNavigate('integrations')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Recent Users</h2>
          <div className="space-y-4">
            {loading ? (
               <div className="text-sm text-slate-500">Loading users...</div>
            ) : recentUsers.length === 0 ? (
               <div className="text-sm text-slate-500">No users yet.</div>
            ) : (
              recentUsers.map((user: any, i: number) => (
                <div key={user.id || i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 font-medium">
                      {(user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{user.name || 'Anonymous User'}</div>
                      <div className="text-xs text-slate-500">{user.email || 'No email provided'}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Just now'}</div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => onNavigate('team')} className="w-full mt-4 py-2 border border-slate-200 dark:border-zinc-700 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors">
            View All Users
          </button>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => onNavigate('team')} className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 transition-colors">
                <Users className="w-6 h-6 text-indigo-500" />
                <span className="text-sm font-medium">Manage Users</span>
             </button>
             <button onClick={() => onNavigate('integrations')} className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 transition-colors">
                <Box className="w-6 h-6 text-indigo-500" />
                <span className="text-sm font-medium">Integrations</span>
             </button>
             <button onClick={() => onNavigate('settings')} className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 transition-colors">
                <Settings className="w-6 h-6 text-indigo-500" />
                <span className="text-sm font-medium">Global Settings</span>
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function StatsCard({ title, value, change, icon: Icon, onClick }: any) {
  return (
    <div 
      className={cn("bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm", onClick && "cursor-pointer hover:border-indigo-500/50 transition-colors")}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-display font-semibold tracking-tight mt-1">{value}</p>
        <p className="text-emerald-500 text-sm font-medium mt-1">{change}</p>
      </div>
    </div>
  );
}
