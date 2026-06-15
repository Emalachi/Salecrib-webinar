import React, { useState } from 'react';
import { Video, MoreHorizontal, Copy, Pencil, PlayCircle, BarChart, Settings, Users, Link as LinkIcon, Search, Plus, X, LayoutTemplate } from 'lucide-react';
import { cn } from '../lib/utils';
import type { ViewState } from '../App';

import { useFirestore } from '../hooks/useFirestore';

export default function WebinarsList({ onNavigate }: { onNavigate: (view: ViewState) => void }) {
  const { data: webinars, loading, error, deleteDocument } = useFirestore<any>('webinars');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [linksModalWebinar, setLinksModalWebinar] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = webinars.filter(w => {
    const matchesFilter = filter === 'all' || w.status === filter;
    const matchesSearch = w.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Your Webinars</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Manage and monitor all your live and evergreen events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => onNavigate('create-webinar')}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Webinar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1">
            {['all', 'upcoming', 'active', 'past'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                  filter === f
                    ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search webinars..."
              className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-50/50 dark:bg-zinc-900/50">
                <th className="px-6 py-4 font-medium">Webinar Details</th>
                <th className="px-6 py-4 font-medium">Schedule</th>
                <th className="px-6 py-4 font-medium text-right">Registrants</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading webinars...</td></tr>
              )}
              {error && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                    {error.includes('Missing or insufficient permissions') ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-semibold text-rose-600">Permission Denied</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">You must deploy your Firestore rules to view your webinars. Please follow the instructions in <code className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950 rounded text-rose-900 border border-rose-200">PRODUCTION_FIREBASE_SETUP.md</code> to run <code className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950 rounded text-rose-900 border border-rose-200">firebase deploy --only firestore:rules</code>.</span>
                      </div>
                    ) : (
                      `Error: ${error}`
                    )}
                  </td>
                </tr>
              )}
              {!loading && filtered.map(webinar => (
                <tr key={webinar.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-zinc-100">{webinar.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-md font-medium text-[10px] uppercase",
                            webinar.type === 'Live' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                          )}>{webinar.type}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-zinc-300">{webinar.date}</div>
                    <div className="text-xs text-slate-500">{webinar.time}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {(webinar.registrants || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
                      webinar.status === 'active' ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" :
                      webinar.status === 'upcoming' ? "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400" :
                      "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                    )}>
                      {webinar.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionBtn icon={LinkIcon} title="Get Links" onClick={() => setLinksModalWebinar(webinar)} />
                      <ActionBtn icon={BarChart} title="Analytics" />
                      <ActionBtn icon={Settings} title="Settings" />
                      <div className="relative">
                        <ActionBtn 
                          icon={MoreHorizontal} 
                          title="More" 
                          onClick={() => setOpenMenuId(openMenuId === webinar.id ? null : webinar.id)} 
                        />
                        {openMenuId === webinar.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-lg z-50 py-1">
                             <button className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm">Edit Webinar</button>
                             <button className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm">Duplicate</button>
                             <button 
                               onClick={() => {
                                 deleteDocument(webinar.id);
                                 setOpenMenuId(null);
                               }}
                               className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-sm text-rose-600 dark:text-rose-400"
                             >
                               Delete
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No webinars found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {linksModalWebinar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-zinc-100">Share "{linksModalWebinar.title}"</h3>
              </div>
              <button onClick={() => setLinksModalWebinar(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Registration Link</label>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={`https://webinars.salecrib.com/reg/${linksModalWebinar.slug}`} 
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg text-sm text-slate-600 dark:text-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <button className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Embed Registration Form</label>
                 <p className="text-xs text-slate-500 dark:text-zinc-400">Copy this code into your website's HTML to embed the form directly.</p>
                 <div className="relative">
                   <textarea 
                     readOnly 
                     rows={3} 
                     value={`<iframe src="https://webinars.salecrib.com/reg/${linksModalWebinar.slug}/embed" width="100%" height="450px" frameborder="0"></iframe>`}
                     className="w-full px-4 py-3 bg-slate-950 text-slate-300 font-mono text-xs rounded-lg border border-slate-800 outline-none resize-none focus:border-indigo-500/50"
                   />
                   <button className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-700 rounded-md transition-colors">
                     <Copy className="w-4 h-4" />
                   </button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionBtn({ icon: Icon, title, onClick }: any) {
  return (
     <button onClick={onClick} title={title} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-md transition-colors">
       <Icon className="w-4 h-4" />
     </button>
  )
}
