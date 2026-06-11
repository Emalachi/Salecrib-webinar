import React, { useState } from 'react';
import { Settings, Globe, Shield, Bell, Save, Mail, Webhook, Key, Trash2, Plus } from 'lucide-react';
import { TIMEZONES } from '../lib/timezones';

import { useFirestore } from '../hooks/useFirestore';

function APIKeysPanel() {
  const { data: keys, loading, deleteDocument, addDocument } = useFirestore<any>('api_keys');
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">API Keys</h3>
        <button onClick={() => addDocument({ name: 'New API Key', keyString: 'sk_live_' + Math.random().toString(36).substr(2, 10).toUpperCase() + '*******************' })} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-lg text-sm font-medium transition-colors">
          Generate New Key
        </button>
      </div>
      {loading ? <p className="text-sm text-slate-500">Loading...</p> : keys.length === 0 ? (
        <p className="text-sm text-slate-500">No API keys.</p>
      ) : keys.map(k => (
        <div key={k.id} className="p-4 border border-slate-200 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-800/50 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-zinc-100 text-sm">{k.name}</h4>
              <p className="text-xs text-slate-500 mt-1 font-mono">{k.keyString}</p>
            </div>
            <button onClick={() => deleteDocument(k.id)} className="px-3 py-1.5 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-rose-600 text-slate-600 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors">
              Revoke
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function WebhooksPanel() {
  const { data: webhooks, loading, addDocument, deleteDocument } = useFirestore<any>('webhooks');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Webhooks</h3>
        <button onClick={() => addDocument({ url: 'https://mysite.com/webhook', events: 'all', status: 'Active' })} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-lg text-sm font-medium transition-colors">
          Add Endpoint
        </button>
      </div>
      {loading ? <p className="text-sm text-slate-500">Loading...</p> : webhooks.length === 0 ? (
        <p className="text-sm text-slate-500">No webhooks configured.</p>
      ) : webhooks.map(wh => (
        <div key={wh.id} className="p-4 border border-slate-200 dark:border-zinc-700 rounded-lg mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-slate-900 dark:text-zinc-100 text-sm">{wh.url}</h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">{wh.status}</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Events: {wh.events}</p>
          <div className="flex gap-2">
            <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Edit</button>
            <button onClick={() => deleteDocument(wh.id)} className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
function EmailAPIPanel() {
  const [provider, setProvider] = useState('sendgrid');
  const [gmailAccounts, setGmailAccounts] = useState([{ address: '', password: '' }]);

  const updateGmailAccount = (index: number, field: 'address' | 'password', value: string) => {
    const newAccounts = [...gmailAccounts];
    newAccounts[index][field] = value;
    setGmailAccounts(newAccounts);
  };

  const addGmailAccount = () => {
    if (gmailAccounts.length < 2) {
      setGmailAccounts([...gmailAccounts, { address: '', password: '' }]);
    }
  };

  const removeGmailAccount = (index: number) => {
    setGmailAccounts(gmailAccounts.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Email API Connector</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Configure your email service provider to send automated emails directly from pipelines.
      </p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Platform Provider</label>
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          >
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
            <option value="postmark">Postmark</option>
            <option value="gmail">Gmail</option>
            <option value="smtp">Custom SMTP</option>
          </select>
        </div>

        {provider !== 'smtp' && provider !== 'gmail' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">API Key</label>
            <input 
              type="password"
              placeholder="Enter your API key"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
            />
          </div>
        )}

        {provider === 'gmail' && (
          <div className="space-y-4">
            {gmailAccounts.map((account, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative bg-slate-50 dark:bg-zinc-900/50 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl">
                {gmailAccounts.length > 1 && (
                  <button 
                    onClick={() => removeGmailAccount(index)}
                    className="absolute -top-2 -right-2 p-1 bg-white dark:bg-zinc-800 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-zinc-700 rounded-full shadow-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Gmail Address {index + 1}</label>
                  <input 
                    type="text"
                    value={account.address}
                    onChange={(e) => updateGmailAccount(index, 'address', e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">App Password</label>
                  <input 
                    type="password"
                    value={account.password}
                    onChange={(e) => updateGmailAccount(index, 'password', e.target.value)}
                    placeholder="16-digit app password"
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                  />
                  {index === 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      Enable 2-Step Verification and create an App Password.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {gmailAccounts.length < 2 && (
              <button 
                onClick={addGmailAccount}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Fallback Gmail Account
              </button>
            )}

            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <span>
                  <strong>Important Gmail Limits:</strong> Free Gmail accounts are limited to approx. 500 emails per 24 hours. Google Workspace accounts have a 2,000 email limit.
                  {gmailAccounts.length > 1 && " The system will automatically switch to your fallback account when limits are reached."}
                </span>
              </p>
            </div>
          </div>
        )}

        {provider === 'smtp' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Host</label>
              <input 
                type="text"
                placeholder="smtp.example.com"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Port</label>
              <input 
                type="number"
                placeholder="587"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Username</label>
              <input 
                type="text"
                placeholder="username"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Password</label>
              <input 
                type="password"
                placeholder="password"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">From Name</label>
          <input 
            type="text"
            placeholder="SaleCrib Registration"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">From Email</label>
          <input 
            type="email"
            placeholder="noreply@salecrib.com"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>

        <div className="pt-4 flex gap-3 border-t border-slate-200 dark:border-zinc-800 mt-6">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
            Connect
          </button>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm font-medium transition-colors">
            Send Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'security' | 'notifications' | 'api-keys' | 'webhooks' | 'email-api'>('workspace');

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold tracking-tight text-slate-900 dark:text-zinc-50">Global Settings</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-2">Manage workspace preferences, localization, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          <button 
            onClick={() => setActiveTab('workspace')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'workspace' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
          >
            <Globe className="w-4 h-4" /> Workspace
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('api-keys')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'api-keys' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
          >
            <Key className="w-4 h-4" /> API Keys
          </button>
          <button 
            onClick={() => setActiveTab('webhooks')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'webhooks' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
          >
            <Webhook className="w-4 h-4" /> Webhooks
          </button>
          <button 
            onClick={() => setActiveTab('email-api')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'email-api' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
          >
            <Mail className="w-4 h-4" /> Email API & SMTP
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
            
            {activeTab === 'workspace' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-4">Workspace Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Workspace Name</label>
                      <input 
                        type="text" 
                        defaultValue="SaleCrib"
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Primary Domain</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          defaultValue="webinars.salecrib.com"
                          className="flex-1 px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                          Verify
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Default Timezone</label>
                      <select className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                        {TIMEZONES.map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-4">Branding</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-zinc-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-zinc-100">Company Logo</h4>
                        <p className="text-sm text-slate-500 mt-1">Used on registration pages and emails.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700">
                          <Webhook className="w-6 h-6 text-indigo-500" />
                        </div>
                        <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Change</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Brand Color</label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600 shadow-sm border border-slate-200 dark:border-zinc-700 cursor-pointer"></div>
                        <input 
                          type="text" 
                          defaultValue="#4F46E5"
                          className="w-32 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 dark:border-zinc-700 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-zinc-100">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-500 mt-1">Require all workspace users to enable 2FA.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="p-4 border border-slate-200 dark:border-zinc-700 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-zinc-100">Require Strong Passwords</h4>
                      <p className="text-sm text-slate-500 mt-1">Enforce complex password rules for all users.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 dark:border-zinc-700 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-zinc-100">New Registration Alerts</h4>
                      <p className="text-sm text-slate-500 mt-1">Get an email when someone signs up for a webinar.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="p-4 border border-slate-200 dark:border-zinc-700 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-zinc-100">Webinar Status Updates</h4>
                      <p className="text-sm text-slate-500 mt-1">Receive notifications when your webinar is ready or finishes processing.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api-keys' && (
              <APIKeysPanel />
            )}

            {activeTab === 'webhooks' && (
              <WebhooksPanel />
            )}

            {activeTab === 'email-api' && (
              <EmailAPIPanel />
            )}

            <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-zinc-800">
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
