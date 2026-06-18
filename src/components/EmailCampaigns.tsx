import React, { useState, useMemo } from 'react';
import { Mail, ArrowRight, MousePointerClick, Eye, RefreshCw, Plus, MoreVertical, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirestore } from '../hooks/useFirestore';
import EmailBuilder from './EmailBuilder';

export default function EmailCampaigns() {
  const { data: campaigns, loading, error, addDocument, deleteDocument, updateDocument } = useFirestore<any>('email_campaigns');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);

  const { emailsSent, avgOpens, avgClicks } = useMemo(() => {
    // Note: Open and click tracking are placeholders. 
    // Implementing real open/click tracking requires embedding tracking pixels in the 
    // emails and using redirect links for all URLs inside the email.
    let eSent = 0, tOpens = 0, tClicks = 0, cCount = 0;
    campaigns?.forEach((c: any) => {
      eSent += c.sent || 0;
      if (c.opens) tOpens += parseInt(c.opens) || 0;
      if (c.clicks) tClicks += parseInt(c.clicks) || 0;
      cCount++;
    });

    return { 
      emailsSent: eSent,
      avgOpens: cCount > 0 ? (tOpens / cCount).toFixed(1) : 0,
      avgClicks: cCount > 0 ? (tClicks / cCount).toFixed(1) : 0
    };
  }, [campaigns]);

  const addCampaign = () => {
    addDocument({
      name: 'New Email Campaign',
      status: 'draft',
      sent: 0,
      opens: 'Not tracked yet',
      clicks: 'Not tracked yet',
      type: 'Broadcast'
    });
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Email Campaigns</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Manage automations, broadcasts, and performance metrics.</p>
        </div>
        <button onClick={addCampaign} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Stats title="Emails Sent This Month" value={loading ? "..." : emailsSent.toLocaleString()} icon={Mail} />
         <Stats title="Avg. Open Rate" value={loading ? "..." : (campaigns?.length ? `${avgOpens}%` : 'Not tracked yet')} icon={Eye} />
         <Stats title="Avg. Click Rate" value={loading ? "..." : (campaigns?.length ? `${avgClicks}%` : 'Not tracked yet')} icon={MousePointerClick} />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden text-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-zinc-800 uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-50/50 dark:bg-zinc-900/50">
              <th className="px-6 py-4 font-medium text-xs">Campaign Name</th>
              <th className="px-6 py-4 font-medium text-xs">Type</th>
              <th className="px-6 py-4 font-medium text-xs">Status</th>
              <th className="px-6 py-4 font-medium text-xs text-right">Sent</th>
              <th className="px-6 py-4 font-medium text-xs text-right">Open Rate</th>
              <th className="px-6 py-4 font-medium text-xs text-right">Click Rate</th>
              <th className="px-6 py-4 font-medium text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
            {loading && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Loading campaigns...</td></tr>
            )}
            {error && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-red-500">Error: {error}</td></tr>
            )}
            {!loading && campaigns.map(camp => (
              <tr key={camp.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-zinc-100">{camp.name}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-zinc-400 px-2 py-1">
                  <span className="flex items-center gap-1.5 border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 rounded-md px-2 py-1 text-[11px] w-max">
                     {camp.type === 'Automated' ? <RefreshCw className="w-3 h-3 text-indigo-500" /> : <Mail className="w-3 h-3 text-amber-500" />}
                     {camp.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">
                  {camp.status === 'active' && <span className="text-emerald-500 flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5" /> Active</span>}
                  {camp.status === 'scheduled' && <span className="text-blue-500 flex items-center gap-1.5"><ClockIcon className="w-3.5 h-3.5" /> Scheduled</span>}
                  {camp.status === 'draft' && <span className="text-slate-500 flex items-center gap-1.5"><PencilIcon className="w-3.5 h-3.5" /> Draft</span>}
                  {camp.status === 'completed' && <span className="text-slate-400 flex items-center gap-1.5">Completed</span>}
                </td>
                <td className="px-6 py-4 text-right text-slate-600 dark:text-zinc-300">{(camp.sent || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-slate-600 dark:text-zinc-300 font-medium">{camp.opens || 'Not tracked yet'}</td>
                <td className="px-6 py-4 text-right text-slate-600 dark:text-zinc-300 font-medium">{camp.clicks || 'Not tracked yet'}</td>
                <td className="px-6 py-4 text-right relative">
                  <button onClick={() => setOpenMenuId(openMenuId === camp.id ? null : camp.id)} className="text-slate-400 hover:text-indigo-500 transition-colors"><MoreVertical className="w-4 h-4 ml-auto" /></button>
                  {openMenuId === camp.id && (
                    <div className="absolute right-6 top-10 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-lg z-50 py-1">
                       <button onClick={() => {
                          setEditingCampaignId(camp.id);
                          setOpenMenuId(null);
                       }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm">Edit Campaign</button>
                       <button className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm">View Analytics</button>
                       <button 
                         onClick={() => {
                           deleteDocument(camp.id);
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
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No email campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {editingCampaignId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
             <EmailBuilder 
                campaignId={editingCampaignId} 
                onClose={() => setEditingCampaignId(null)} 
             />
          </div>
        </div>
      )}
    </div>
  )
}

function ClockIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}

function PencilIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
}

function Stats({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">{title}</h3>
        <div className="text-2xl font-display font-semibold">{value}</div>
      </div>
      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}
