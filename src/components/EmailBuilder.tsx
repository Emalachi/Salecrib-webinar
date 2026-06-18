import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Monitor, 
  Smartphone
} from 'lucide-react';
import { cn } from '../lib/utils';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function EmailBuilder({ campaignId, onClose }: { campaignId: string, onClose: () => void }) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [subject, setSubject] = useState(`Registration Confirmed: {{webinar_title}}`);
  const [htmlContent, setHtmlContent] = useState('');
  const [campaignName, setCampaignName] = useState('Loading...');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const d = await getDoc(doc(db, 'email_campaigns', campaignId));
      if (d.exists()) {
        const data = d.data();
        if (data.subject) setSubject(data.subject);
        if (data.html) setHtmlContent(data.html);
        else setHtmlContent(`<p>Hi {{first_name}},</p>
<p>You're confirmed for <strong>{{webinar_title}}</strong>.</p>
<div style="text-align: center; margin: 30px 0;">
  <a href="{{webinar_link}}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join Webinar Now</a>
</div>
<p>- {{host_name}}</p>`);
        setCampaignName(data.name || 'Campaign');
      }
    }
    load();
  }, [campaignId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'email_campaigns', campaignId), {
        subject,
        html: htmlContent
      });
      alert('Email Campaign Saved!');
    } catch(err) {
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh]">
      {/* Top Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 text-slate-200 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <h2 className="text-sm font-medium hidden sm:block">{campaignName}</h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
          <button 
            onClick={() => setDevice('desktop')}
            className={cn("p-1.5 rounded-md transition-colors", device === 'desktop' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDevice('mobile')}
            className={cn("p-1.5 rounded-md transition-colors", device === 'mobile' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Email'}
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden rounded-b-2xl">
        {/* Left Sidebar (Settings) */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-medium text-slate-200">Email Settings</h3>
          </div>
          
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Dynamic Variables</label>
               <div className="flex flex-wrap gap-2">
                 {['{{first_name}}', '{{webinar_link}}', '{{date_time}}', '{{host_name}}', '{{webinar_title}}'].map(variable => (
                   <button key={variable} className="px-2 py-1 text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded border border-slate-700 font-mono transition">
                     {variable}
                   </button>
                 ))}
               </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-slate-800">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">HTML Body Editor</label>
               <textarea 
                 value={htmlContent}
                 onChange={(e) => setHtmlContent(e.target.value)}
                 rows={10}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
               />
               <p className="text-[11px] text-slate-500 mt-2">Edit raw HTML template directly.</p>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-8 flex justify-center pb-32 relative">
          <div className={cn(
            "transition-all duration-300 transform origin-top flex flex-col",
            device === 'desktop' ? "w-full max-w-2xl" : "w-[375px] mt-4"
          )}>
            
            {/* Email Client Header Mockup */}
            <div className="bg-slate-100 dark:bg-zinc-900 rounded-t-xl border border-slate-200 dark:border-zinc-800 p-4 shrink-0 shadow-sm relative z-10">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                     <span className="text-indigo-600 font-bold">ME</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">From: <span className="text-slate-900 dark:text-white font-medium">SaleCrib Host</span></p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">To: <span className="text-slate-900 dark:text-white">attendee@example.com</span></p>
                  </div>
               </div>
               <p className="text-lg font-bold text-slate-900 dark:text-white mt-3 truncate">{subject}</p>
            </div>

            {/* Email Body Preview */}
            <div className="bg-white dark:bg-black w-full rounded-b-xl min-h-[500px] border border-t-0 border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
               <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />
               <div className="p-8 text-black dark:text-white" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
