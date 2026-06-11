import React, { useState } from 'react';
import { UserPlus, UserCog, Mail, Search, Shield, User, MoreVertical, Trash2, Edit } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useFirestore } from '../hooks/useFirestore';

type Role = 'admin' | 'marketer';

export default function TeamManagement() {
  const { data: members, loading, error, addDocument, deleteDocument } = useFirestore<any>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('marketer');

  const filteredMembers = members.filter(member => 
    (member.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (member.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    await addDocument({
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'invited',
      lastActive: 'Never'
    });

    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  const removeMember = async (id: string) => {
    await deleteDocument(id);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-slate-900 dark:text-zinc-50">User Management</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Manage admins and marketers for your organization.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite User</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 pl-9 pr-4 py-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-500 dark:text-zinc-400">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Active</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading team members...</td></tr>
              )}
              {error && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-red-500">Error: {error}</td></tr>
              )}
              {!loading && filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">
                        {(member.name || member.email || 'U').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-zinc-100">{member.name || member.email?.split('@')[0]}</div>
                        <div className="text-sm text-slate-500 dark:text-zinc-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      {member.role === 'admin' ? (
                        <>
                          <Shield className="w-4 h-4 text-indigo-500" />
                          <span className="font-medium text-indigo-700 dark:text-indigo-400">Admin</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="font-medium text-slate-700 dark:text-zinc-300">Marketer</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      member.status === 'active' 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"
                    )}>
                      {member.status === 'active' ? 'Active' : 'Invited'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-zinc-400">
                    {member.lastActive || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => removeMember(member.id)}
                         className="p-1.5 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredMembers.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-zinc-400">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Invite User</h3>
                <p className="text-sm text-slate-500 mt-1">Send an invitation to join your workspace.</p>
              </div>
              
              <form onSubmit={handleInvite} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setInviteRole('admin')}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-colors flex flex-col gap-1",
                        inviteRole === 'admin' 
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-400" 
                          : "border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
                      )}
                    >
                      <span className="font-medium text-sm text-slate-900 dark:text-zinc-100">Admin</span>
                      <span className="text-xs text-slate-500">Full access to all settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteRole('marketer')}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-colors flex flex-col gap-1",
                        inviteRole === 'marketer' 
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-400" 
                          : "border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
                      )}
                    >
                      <span className="font-medium text-sm text-slate-900 dark:text-zinc-100">Marketer</span>
                      <span className="text-xs text-slate-500">Can manage webinars</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
