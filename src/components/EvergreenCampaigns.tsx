import React, { useState } from 'react';
import { Repeat, PlayCircle, Settings, Plus, BarChart2, Video, Link as LinkIcon, Copy, X, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirestore } from '../hooks/useFirestore';

export default function EvergreenCampaigns() {
  const [linksModalCampaign, setLinksModalCampaign] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { data: campaigns, loading, error, addDocument, deleteDocument } = useFirestore<any>('evergreen_campaigns');

  const addCampaign = () => {
    addDocument({
      name: 'New Evergreen Campaign',
      status: 'paused',
      views: 0,
      conversionRate: '0%',
      lastUpdated: 'Just now',
      slug: 'new-campaign-' + Date.now()
    });
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight leading-tight">Evergreen Campaigns</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Automate your best webinars to run continuously on autopilot.</p>
        </div>
        <button onClick={addCampaign} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 font-medium">
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Views</th>
                <th className="px-6 py-4">Est. Conversion</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 text-slate-700 dark:text-zinc-300">
              {loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading campaigns...</td></tr>
              )}
              {error && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-red-500">Error: {error}</td></tr>
              )}
              {!loading && campaigns.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                       <Repeat className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-slate-900 dark:text-zinc-100">{row.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full",
                      row.status === 'active' 
                        ? "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{(row.views || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium">{row.conversionRate || '0%'}</td>
                  <td className="px-6 py-4 text-slate-500">{row.lastUpdated || 'unknown'}</td>
                  <td className="px-6 py-4 relative">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                       <button onClick={() => setLinksModalCampaign(row)} className="p-1 hover:text-indigo-600 transition-colors" title="Get Links">
                         <LinkIcon className="w-4 h-4" />
                       </button>
                       <button className="p-1 hover:text-indigo-600 transition-colors" title="View Details">
                         <BarChart2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)} className="p-1 hover:text-indigo-600 transition-colors" title="More">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                    {openMenuId === row.id && (
                      <div className="absolute right-6 top-12 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-lg z-50 py-1">
                         <button className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm">Edit Campaign</button>
                         <button className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm">Settings</button>
                         <button 
                           onClick={() => {
                             deleteDocument(row.id);
                             setOpenMenuId(null);
                           }}
                           className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-sm text-rose-600 dark:text-rose-400"
                         >
                           Delete
                         </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && campaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No evergreen campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {linksModalCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-zinc-100">Share "{linksModalCampaign.name}"</h3>
              </div>
              <button onClick={() => setLinksModalCampaign(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Registration Link</label>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={`https://webinars.salecrib.com/reg/${linksModalCampaign.slug}`} 
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
                     value={`<iframe src="https://webinars.salecrib.com/reg/${linksModalCampaign.slug}/embed" width="100%" height="450px" frameborder="0"></iframe>`}
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
  );
}
