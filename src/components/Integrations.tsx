import React from 'react';
import { Blocks, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const INTEGRATIONS = [
  { name: 'Stripe', desc: 'Process payments for paid webinars and offers.', icon: 'S', connected: true, group: 'Payments' },
  { name: 'PayPal', desc: 'Accept PayPal payments for your registrations.', icon: 'P', connected: false, group: 'Payments' },
  { name: 'Flutterwave', desc: 'Process payments seamlessly across Africa.', icon: 'F', connected: false, group: 'Payments' },
  { name: 'ActiveCampaign', desc: 'Sync tags and add attendees to automation flows.', icon: 'A', connected: true, group: 'Email & CRM' },
  { name: 'Mailchimp', desc: 'Add registrants directly to your audiences.', icon: 'M', connected: false, group: 'Email & CRM' },
  { name: 'HubSpot', desc: 'Two-way sync of engagement data to CRM.', icon: 'H', connected: false, group: 'Email & CRM' },
  { name: 'Facebook Pixel', desc: 'Track ad conversions for registration pages.', icon: 'F', connected: true, group: 'Analytics' },
  { name: 'Google Analytics', desc: 'Detailed tracking of pageviews and conversions.', icon: 'G', connected: true, group: 'Analytics' },
  { name: 'Zapier', desc: 'Connect to 5,000+ apps using custom webhooks.', icon: 'Z', connected: false, group: 'Automation' },
];

export default function Integrations() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [integrations, setIntegrations] = React.useState(INTEGRATIONS);

  const toggleConnect = (name: string) => {
    setIntegrations(integrations.map(i => 
      i.name === name ? { ...i, connected: !i.connected } : i
    ));
  };

  const filteredIntegrations = integrations.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Integrations Pipeline</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Connect SaleCrib with your favorite tools and marketing stack.</p>
        </div>
        <div className="relative w-full sm:w-64">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search integrations..."
             className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none"
           />
        </div>
      </div>

      {['Payments', 'Email & CRM', 'Analytics', 'Automation'].map(group => {
        const groupIntegrations = filteredIntegrations.filter(i => i.group === group);
        if (groupIntegrations.length === 0) return null;
        
        return (
          <div key={group} className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-zinc-200 pb-2 border-b border-slate-200 dark:border-zinc-800/80">{group}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {groupIntegrations.map(integration => (
                 <div key={integration.name} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-display font-semibold text-slate-700 dark:text-zinc-300">
                        {integration.icon}
                      </div>
                      {integration.connected && (
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Connected
                         </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-zinc-100 mb-1">{integration.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 flex-1 line-clamp-2">{integration.desc}</p>
                    
                    <button 
                      onClick={() => toggleConnect(integration.name)}
                      className={cn(
                        "w-full py-2.5 rounded-lg text-sm font-medium transition-colors outline-none",
                        integration.connected 
                          ? "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                          : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                      )}
                    >
                      {integration.connected ? 'Manage App' : 'Connect'}
                    </button>
                 </div>
               ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
