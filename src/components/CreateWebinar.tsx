import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIMEZONES } from '../lib/timezones';
import { 
  Video, Calendar, Clock, Rocket, ArrowLeft, Loader2, Link as LinkIcon, 
  Camera, CheckCircle2, ChevronRight, Settings, Users, Mail, Palette, MessageSquare, PlayCircle, Monitor, Smartphone, X
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

import WebinarRoom from './WebinarRoom';

export default function CreateWebinar({ onCancel }: { onCancel: () => void }) {
  const { addDocument } = useFirestore<any>('webinars');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Live');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('14:00');
  const [timezone, setTimezone] = useState(TIMEZONES[0] || 'UTC');
  const [videoLink, setVideoLink] = useState('');

  // Chat Simulation State
  const [enableChat, setEnableChat] = useState(true);
  const [autoReply, setAutoReply] = useState(true);
  const [dynamicNames, setDynamicNames] = useState(true);
  const [showChatConfig, setShowChatConfig] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, time: '00:05', text: 'Hello everyone! Excited for this!' },
    { id: 2, time: '02:15', text: 'Where can I find the templates mentioned?' },
    { id: 3, time: '08:30', text: 'Wow, this is so valuable.' },
  ]);
  const [newMessageTime, setNewMessageTime] = useState('');
  const [newMessageText, setNewMessageText] = useState('');

  const handleAddMessage = () => {
    if (newMessageTime && newMessageText) {
      setChatMessages([...chatMessages, { id: Date.now(), time: newMessageTime, text: newMessageText }]);
      setNewMessageTime('');
      setNewMessageText('');
    }
  };

  const removeMessage = (id: number) => {
    setChatMessages(chatMessages.filter(m => m.id !== id));
  };


  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const [errorDetails, setErrorDetails] = useState('');

  const handleCreate = async () => {
    if (!title) return;
    setLoading(true);
    setErrorDetails('');
    try {
      await addDocument({
        title,
        description,
        type,
        date,
        time,
        timezone,
        videoLink,
        status: 'upcoming',
        registrants: 0,
        chatSettings: {
          enabled: enableChat,
          autoReply,
          dynamicNames,
          messages: chatMessages
        },
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        createdAt: new Date().toISOString()
      });
      onCancel();
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('Missing or insufficient permissions')) {
        setErrorDetails('Permission denied: You must deploy the provided firestore.rules to your Firebase project. Check PRODUCTION_FIREBASE_SETUP.md for instructions.');
      } else {
        setErrorDetails(err.message || 'Failed to publish webinar');
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950/50 overflow-y-auto w-full">
      <div className="max-w-4xl w-full mx-auto p-6 md:p-10 pb-32">
        
        {/* Header & Progress */}
        <div className="mb-8">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Webinars
          </button>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-semibold tracking-tight">Create Webinar</h1>
              <p className="text-slate-500 dark:text-zinc-400 mt-1">Configure your event settings and launch.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Step {step} of {totalSteps}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between gap-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                  step > i + 1 ? 'bg-indigo-600' : step === i + 1 ? 'bg-indigo-400' : 'bg-slate-200 dark:bg-zinc-800'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 md:p-10 shadow-sm relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Basic Information</h2>
                  <p className="text-slate-500 dark:text-zinc-400 mb-8">Start by providing the details of your webinar.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Webinar Title *</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 10x Your Marketing Strategy in 2026" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Description</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What will attendees learn?" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Format & Type</h2>
                  <p className="text-slate-500 dark:text-zinc-400 mb-8">Choose how you want to deliver your webinar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label 
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                      type === 'Live' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`} 
                    onClick={() => setType('Live')}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      type === 'Live' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                    }`}>
                      <Camera className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Live Format</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">Host your event in real-time. Engage with your audience through chat, Q&A, and live interactions.</p>
                  </label>

                  <label 
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                      type === 'Evergreen' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`} 
                    onClick={() => setType('Evergreen')}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      type === 'Evergreen' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                    }`}>
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Evergreen/Automated</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">Run pre-recorded webinars automatically on a schedule or on-demand, creating a recurring asset.</p>
                  </label>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Schedule & Media</h2>
                  <p className="text-slate-500 dark:text-zinc-400 mb-8">Set when your webinar starts and the video source.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Date</label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Time</label>
                    <div className="relative">
                      <Clock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Timezone</label>
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 mt-8">
                  <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    Video Source {type === 'Evergreen' ? '(Required)' : '(Optional Backup)'}
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      type="text" 
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="e.g. YouTube, Vimeo, or direct MP4 URL" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
               <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Live Chat Simulation</h2>
                  <p className="text-slate-500 dark:text-zinc-400 mb-8">Design automated chat sequences that run during your webinar.</p>
                </div>
                
                <div className="space-y-4">
                   <div className="p-6 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                         <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-1">
                           <h3 className="font-semibold text-slate-900 dark:text-white">Enable Simulated Chat</h3>
                           <button 
                             onClick={() => setEnableChat(!enableChat)}
                             className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enableChat ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}`}
                           >
                             <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${enableChat ? 'translate-x-5' : 'translate-x-1'}`} />
                           </button>
                         </div>
                         <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">Automatically send pre-written messages at specific times to increase engagement.</p>
                         <button 
                           onClick={() => setShowChatConfig(true)}
                           disabled={!enableChat}
                           className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                         >
                           Configure Messages
                         </button>
                      </div>
                   </div>

                   {enableChat && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="p-6 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl"
                     >
                        <div className="space-y-3">
                           <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" id="auto-reply" 
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                                checked={autoReply}
                                onChange={(e) => setAutoReply(e.target.checked)} 
                              />
                              <label htmlFor="auto-reply" className="text-sm font-medium text-slate-700 dark:text-zinc-300 cursor-pointer">
                                Allow virtual attendees to auto-reply to real users
                              </label>
                           </div>
                           <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" id="dynamic-names" 
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                                checked={dynamicNames}
                                onChange={(e) => setDynamicNames(e.target.checked)} 
                              />
                              <label htmlFor="dynamic-names" className="text-sm font-medium text-slate-700 dark:text-zinc-300 cursor-pointer">
                                Dynamically change simulated names based on user geolocation
                              </label>
                           </div>
                        </div>
                     </motion.div>
                   )}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-semibold mb-4">Ready for Launch</h2>
                <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-lg mx-auto mb-8">
                  Your webinar "{title || 'Untitled'}" is configured and ready to be published. You can add automations and edit the registration page after publishing.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left max-w-5xl mx-auto">
                  <div className="bg-slate-50 dark:bg-zinc-950/50 p-6 rounded-2xl space-y-3 border border-slate-200 dark:border-zinc-800">
                    <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Webinar Details</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Format</span>
                      <span className="text-slate-900 dark:text-white font-semibold">{type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Schedule</span>
                      <span className="text-slate-900 dark:text-white font-semibold">{date} at {time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Timezone</span>
                      <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] text-right">{timezone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Chat Simulation</span>
                      <span className="text-slate-900 dark:text-white font-semibold">{enableChat ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowPreviewModal(true)}
                    className="group border-none text-left bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden bg-center bg-cover min-h-[160px] transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 dark:hover:ring-offset-zinc-900" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80)' }}>
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-all group-hover:bg-slate-900/50"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center text-white transition-transform group-hover:scale-105">
                       <PlayCircle className="w-12 h-12 mb-3 text-indigo-400 opacity-90 transition-opacity group-hover:opacity-100" />
                       <h3 className="font-semibold text-lg line-clamp-1">{title || 'Your Webinar Preview'}</h3>
                       <p className="text-sm text-slate-300 mt-1">Click to view room preview</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col items-center justify-between mt-8">
          {errorDetails && (
            <div className="w-full mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-500/20">
              {errorDetails}
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={step === 1 || loading}
              className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              Back
            </button>
            
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={step === 1 && !title.trim()}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm transition-all"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
               <button
                onClick={handleCreate}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                {loading ? 'Publishing...' : 'Publish Webinar'}
              </button>
            )}
          </div>
        </div>

        {/* Chat Config Modal */}
        <AnimatePresence>
          {showChatConfig && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Configure Chat Messages</h3>
                  <button onClick={() => setShowChatConfig(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    ✕
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-zinc-950/50">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                      Pre-written messages allow you to simulate a lively chat environment for evergreen webinars, or prime the discussion for live webinars.
                    </p>
                    <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-3">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded text-slate-500">{msg.time}</span>
                            <span className="text-sm font-medium">{msg.text}</span>
                          </div>
                          <button onClick={() => removeMessage(msg.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         placeholder="00:00" 
                         value={newMessageTime}
                         onChange={e => setNewMessageTime(e.target.value)}
                         className="w-20 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                       />
                       <input 
                         type="text" 
                         placeholder="Type message..." 
                         value={newMessageText}
                         onChange={e => setNewMessageText(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && handleAddMessage()}
                         className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                       />
                       <button onClick={handleAddMessage} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                         Add
                       </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-end">
                  <button 
                    onClick={() => setShowChatConfig(false)}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Room Preview Modal */}
        <AnimatePresence>
          {showPreviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-slate-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${previewMode === 'desktop' ? 'w-full max-w-6xl h-[85vh]' : 'w-[400px] h-[800px] max-h-[90vh]'}`}
              >
                {/* Preview Header */}
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                  <div className="flex items-center gap-4">
                     <span className="text-sm font-medium text-slate-300">Room Preview</span>
                     <div className="flex items-center bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                        <button 
                          onClick={() => setPreviewMode('desktop')}
                          className={`p-1.5 rounded-md flex items-center transition-colors ${previewMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                           <Monitor className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setPreviewMode('mobile')}
                          className={`p-1.5 rounded-md flex items-center transition-colors ${previewMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                           <Smartphone className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                  <button onClick={() => setShowPreviewModal(false)} className="text-zinc-400 hover:text-white transition-colors p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Simulated Room */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative bg-zinc-950">
                   {/* Main Video Area */}
                   <div className="flex-1 relative flex items-center justify-center bg-black">
                     <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <div className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full text-xs font-semibold flex items-center gap-2 backdrop-blur-md">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                          LIVE
                        </div>
                        <div className="px-3 py-1 bg-black/40 text-white rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-2">
                          <Users className="w-3 h-3" /> 1,248
                        </div>
                     </div>
                     <img src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=1600&q=80" alt="Webinar" className="w-full h-full object-cover opacity-80" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                       <div>
                         <h2 className="text-2xl font-bold text-white mb-2">{title || 'Your Webinar Title'}</h2>
                         <p className="text-zinc-300">Hosted by You</p>
                       </div>
                     </div>
                   </div>
                   
                   {/* Sidebar / Chat */}
                   <div className={`flex flex-col border-zinc-800 bg-zinc-900/50 ${previewMode === 'desktop' ? 'w-80 border-l' : 'h-64 border-t'}`}>
                      <div className="p-4 border-b border-zinc-800">
                         <h3 className="font-medium text-white flex items-center gap-2">
                           <MessageSquare className="w-4 h-4 text-indigo-400" />
                           Live Chat
                         </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                         {enableChat ? (
                           <>
                             {chatMessages.map(msg => (
                               <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2">
                                 <div className="flex items-baseline gap-2 mb-1">
                                   <span className="font-medium text-sm text-indigo-300">Simulated User</span>
                                   <span className="text-[10px] text-zinc-500">{msg.time}</span>
                                 </div>
                                 <p className="text-sm text-zinc-300">{msg.text}</p>
                               </div>
                             ))}
                             <div className="flex items-baseline gap-2 mb-1">
                               <span className="font-medium text-sm text-emerald-400">Jane Smith</span>
                               <span className="text-[10px] text-zinc-500">Just now</span>
                             </div>
                             <p className="text-sm text-zinc-300">Very excited for this presentation!</p>
                           </>
                         ) : (
                           <div className="h-full flex items-center justify-center text-center text-zinc-500 text-sm italic">
                             Chat disabled
                           </div>
                         )}
                      </div>
                      <div className="p-4 border-t border-zinc-800">
                         <input type="text" placeholder="Type a message..." className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" disabled />
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

