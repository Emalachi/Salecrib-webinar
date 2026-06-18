import React, { useState } from 'react';
import { Search, Download, Filter, MoreHorizontal, ExternalLink, Calendar, Users, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirestore } from '../hooks/useFirestore';

export default function Registrations() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { data: registrations, loading, error, deleteDocument } = useFirestore<any>('registrations');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegistrations = registrations.filter(reg => {
    return (reg.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
           (reg.email || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Registrations</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Manage and export all webinar signups across your account.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none w-full"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900 dark:text-white">1 - {filteredRegistrations.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{registrations?.length || 0}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-50/50 dark:bg-zinc-900/50">
                <th className="px-6 py-4 font-medium w-12">
                  <input type="checkbox" className="rounded text-indigo-500" />
                </th>
                <th className="px-6 py-4 font-medium">Attendee</th>
                <th className="px-6 py-4 font-medium">Webinar Registered For</th>
                <th className="px-6 py-4 font-medium">Registration Date</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading registrations...</td></tr>
              )}
              {error && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-red-500">Error: {error}</td></tr>
              )}
              {!loading && filteredRegistrations.map(reg => (
                <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded text-indigo-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-semibold text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                        {(reg.name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-zinc-100">{reg.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 hover:text-indigo-500"><Mail className="w-3 h-3" /> {reg.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-zinc-300">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 font-medium">
                      {reg.webinar}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-zinc-400">
                    {reg.date || 'unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-zinc-400">
                    {reg.source || 'unknown'}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setOpenMenuId(openMenuId === reg.id ? null : reg.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenuId === reg.id && (
                      <div className="absolute right-6 top-10 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-lg z-50 py-1">
                         <button className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm">View Details</button>
                         <button className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm">Resend Confirmation</button>
                         <button 
                           onClick={() => {
                             deleteDocument(reg.id);
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
              {!loading && filteredRegistrations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Details (Mock) */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-sm text-slate-500">
           <div>Showing {registrations.length} registrations on this page.</div>
           <div className="flex items-center gap-2">
             <button className="p-1 border border-slate-200 dark:border-zinc-800 rounded hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
             <button className="p-1 border border-slate-200 dark:border-zinc-800 rounded hover:bg-slate-50 dark:hover:bg-zinc-800"><ChevronRight className="w-4 h-4" /></button>
           </div>
        </div>
      </div>
    </div>
  )
}
