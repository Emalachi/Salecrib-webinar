import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIMEZONES } from '../lib/timezones';
import { 
  ChevronRight, 
  ChevronLeft, 
  Video, 
  Settings, 
  Calendar, 
  MonitorPlay, 
  LayoutTemplate, 
  Mail, 
  Rocket,
  CheckCircle2,
  Upload,
  Clock,
  Monitor,
  Smartphone,
  Maximize,
  Volume2,
  Play,
  MessageSquare,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import PageBuilder from './PageBuilder';
import EmailBuilder from './EmailBuilder';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Settings },
  { id: 2, title: 'Webinar Type', icon: Video },
  { id: 3, title: 'Scheduling', icon: Calendar },
  { id: 4, title: 'Registration', icon: LayoutTemplate },
  { id: 5, title: 'Webinar Room', icon: MonitorPlay },
  { id: 6, title: 'Chat Simulation', icon: MessageSquare },
  { id: 7, title: 'Emails', icon: Mail },
  { id: 8, title: 'Publish', icon: Rocket }
];

export default function CreateWebinar({ onCancel }: { onCancel: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPageBuilderOpen, setIsPageBuilderOpen] = useState(false);
  const [editingEmailTemplate, setEditingEmailTemplate] = useState<{title: string, sendTime: string} | null>(null);
  
  // Form State
  const [scheduleDate, setScheduleDate] = useState('2026-10-15');
  const [scheduleTime, setScheduleTime] = useState('14:00');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (isPageBuilderOpen) {
    return <PageBuilder onClose={() => setIsPageBuilderOpen(false)} scheduleDate={scheduleDate} scheduleTime={scheduleTime} />;
  }

  if (editingEmailTemplate) {
    return <EmailBuilder template={editingEmailTemplate} onClose={() => setEditingEmailTemplate(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950/50">
      {/* Wizard Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-display font-semibold">Create New Webinar</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Configure your event settings below.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
            Save Draft
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Steps */}
        <div className="w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 p-6 hidden lg:block overflow-y-auto">
          <div className="space-y-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10",
                      isActive ? "bg-indigo-600 border-indigo-600 text-white" :
                      isPast ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400" :
                      "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-500"
                    )}>
                      {isPast ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-semibold">{step.id}</span>}
                    </div>
                    {idx < STEPS.length - 1 && (
                       <div className={cn(
                         "w-0.5 h-10 -mt-1 -mb-1",
                         isPast ? "bg-indigo-500" : "bg-slate-200 dark:bg-zinc-800"
                       )} />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <span className={cn(
                      "text-sm font-medium transition-colors duration-300 block",
                      isActive ? "text-indigo-600 dark:text-indigo-400" : 
                      isPast ? "text-slate-900 dark:text-zinc-100" : "text-slate-500 dark:text-zinc-500"
                    )}>
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
          <div className="flex-1 p-6 md:p-10 max-w-4xl w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                 {currentStep === 1 && <Step1Basic />}
                 {currentStep === 2 && <Step2Type />}
                 {currentStep === 3 && <Step3Schedule date={scheduleDate} setDate={setScheduleDate} time={scheduleTime} setTime={setScheduleTime} />}
                 {currentStep === 4 && <Step4Registration onOpenBuilder={() => setIsPageBuilderOpen(true)} />}
                 {currentStep === 5 && <Step5Room />}
                 {currentStep === 6 && <Step6ChatSimulation />}
                 {currentStep === 7 && <Step7Emails onEditTemplate={(template) => setEditingEmailTemplate(template)} />}
                 {currentStep === 8 && <Step8Publish onPublish={onCancel} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-6 flex justify-between items-center z-10 sticky bottom-0">
            <button 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button 
              onClick={nextStep}
              disabled={currentStep === STEPS.length}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-auto"
            >
              {currentStep === STEPS.length ? 'Ready to Publish' : 'Next Step'}
              {currentStep !== STEPS.length && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step1Basic() {
  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Basic Information</h2>
        <p className="text-slate-500 dark:text-zinc-400">Set up the core details of your webinar to get started.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Webinar Name</label>
          <input 
            type="text" 
            placeholder="e.g. 10x Your Marketing Strategy in 2026" 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Description</label>
          <textarea 
            rows={4}
            placeholder="What will attendees learn?" 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-slate-900 dark:text-white leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Presenter Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Category / Tags</label>
            <input 
              type="text" 
              placeholder="e.g. Marketing, Sales" 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
          <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Thumbnail Image</label>
          <div className="border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-950/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group">
             <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-slate-100 dark:border-zinc-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
               <Upload className="w-6 h-6 text-indigo-500" />
             </div>
             <p className="text-base font-medium text-slate-900 dark:text-zinc-100 mb-1">Click to upload or drag and drop</p>
             <p className="text-sm text-slate-500 dark:text-zinc-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step2Type() {
  const [selected, setSelected] = useState('live');
  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Webinar Type</h2>
        <p className="text-slate-500 dark:text-zinc-400">Choose the perfect delivery format for your audience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TypeCard 
          id="live"
          title="Live Webinar"
          desc="Real-time multi-presenter live stream via our native room, Zoom, or YouTube Live."
          icon={Video}
          selected={selected === 'live'}
          onClick={() => setSelected('live')}
          badge="Most Popular"
        />
        <TypeCard 
          id="evergreen"
          title="Evergreen Webinar"
          desc="Automated pre-recorded videos simulated as a live event with timed chat & offers."
          icon={Clock}
          selected={selected === 'evergreen'}
          onClick={() => setSelected('evergreen')}
          badge="Automated"
        />
        <TypeCard 
          id="recurring"
          title="Recurring Series"
          desc="A series of live or evergreen events scheduled at regular intervals."
          icon={Calendar}
          selected={selected === 'recurring'}
          onClick={() => setSelected('recurring')}
        />
        <TypeCard 
          id="jit"
          title="Just In Time"
          desc="Evergreen webinars that appear to start shortly after a visitor registers."
          icon={Rocket}
          selected={selected === 'jit'}
          onClick={() => setSelected('jit')}
        />
      </div>
    </div>
  )
}

function TypeCard({ id, title, desc, icon: Icon, selected, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 text-left rounded-2xl border-2 transition-all duration-300 flex flex-col gap-4 group relative overflow-hidden",
        selected 
          ? "border-indigo-600 bg-white dark:bg-zinc-900 shadow-md shadow-indigo-500/10" 
          : "border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm"
      )}
    >
      {selected && <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent blur-2xl" />}
      
      <div className="flex items-start justify-between relative z-10 w-full">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
          selected ? "bg-indigo-600 text-white shadow-indigo-500/25" : "bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:text-indigo-500 border border-slate-100 dark:border-zinc-700"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {badge && (
          <span className={cn(
             "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full",
             selected ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300" : "bg-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
          )}>
            {badge}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-2">
        <h3 className={cn("font-semibold text-lg mb-1.5 transition-colors", selected ? "text-indigo-950 dark:text-indigo-50" : "text-slate-900 dark:text-zinc-100")}>{title}</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">{desc}</p>
      </div>
      
      {selected && (
        <div className="absolute right-5 bottom-5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}
    </button>
  )
}

function Step3Schedule({ date, setDate, time, setTime }: any) {
  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Scheduling</h2>
        <p className="text-slate-500 dark:text-zinc-400">When will this webinar take place?</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-sm">
        <div className="flex items-center gap-4 mb-8 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
          <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Live Event Schedule</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">Set the date and time for your live broadcast.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Time</label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Timezone</label>
              <select className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium">
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Duration</label>
              <select className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium">
                <option>30 Minutes</option>
                <option>60 Minutes</option>
                <option>90 Minutes</option>
                <option>120 Minutes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step4Registration({ onOpenBuilder }: { onOpenBuilder: () => void }) {
  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Registration Page</h2>
        <p className="text-slate-500 dark:text-zinc-400">Design the landing page to capture attendees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Headline</label>
              <input 
                type="text" 
                placeholder="Register for our exclusive masterclass..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Subheadline</label>
              <textarea 
                rows={3}
                placeholder="Join us live to learn..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all resize-none leading-relaxed"
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100 block mb-2">Form Fields Capture</label>
            <div className="space-y-1">
              <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl">
                <span className="text-sm font-medium text-slate-900 dark:text-zinc-100">Email Address <span className="text-indigo-500 ml-1 text-xs uppercase tracking-wider font-bold">Required</span></span>
                <input type="checkbox" defaultChecked disabled className="toggle opacity-50" />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">First Name</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Last Name</span>
                <input type="checkbox" className="toggle" />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Phone Number</span>
                <input type="checkbox" className="toggle" />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-slate-100/50 dark:bg-zinc-900/30 border-2 border-dashed border-slate-200 dark:border-zinc-800/80 rounded-2xl p-8 flex flex-col justify-center items-center text-center h-full min-h-[400px]">
           <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-slate-200 dark:border-zinc-700 flex items-center justify-center mb-6">
             <LayoutTemplate className="w-8 h-8 text-indigo-500" />
           </div>
           <h3 className="font-semibold text-lg text-slate-900 dark:text-zinc-100 mb-2">Live Page Preview</h3>
           <p className="text-sm text-slate-500 dark:text-zinc-400 text-balance mb-8 max-w-sm">Launch the visual editor to customize your landing page layout, theme, and branding.</p>
           <button 
             onClick={onOpenBuilder}
             className="px-6 py-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-zinc-700 hover:shadow disabled:opacity-50 flex items-center gap-2"
           >
             <LayoutTemplate className="w-4 h-4 text-indigo-500" />
             Open Full Page Builder
           </button>
        </div>
      </div>
    </div>
  )
}

function Step5Room() {
  const [mockupView, setMockupView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Webinar Room Settings</h2>
        <p className="text-slate-500 dark:text-zinc-400">Configure the live experience, colors, and interactive features.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
           <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
             <div className="space-y-3">
               <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Wistia Video Link (Evergreen)</label>
               <input 
                 type="text" 
                 placeholder="e.g. https://fast.wistia.net/embed/iframe/..."
                 className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium"
               />
               <p className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 p-2 rounded-md">Controls will be automatically disabled to simulate a real live event.</p>
             </div>
             
             <div className="space-y-3">
               <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Room Layout</label>
               <select className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium">
                  <option>Standard (Video Left, Chat Right)</option>
                  <option>Theater (Video Top, Chat Bottom)</option>
                  <option>Focus (Video Only, Chat Hidden)</option>
               </select>
             </div>
           </div>
         </div>

         <div className="space-y-6">
           <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
             <div className="space-y-3">
               <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Interactive Features</label>
               <div className="space-y-1">
                  <label className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-zinc-950 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Public Chat</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>
                  <label className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-zinc-950 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Q&A Panel</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>
                  <label className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-zinc-950 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Emoji Reactions</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>
               </div>
             </div>
             
             <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
               <label className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Brand Color Accent</label>
               <div className="flex flex-wrap gap-3">
                 {['#4f46e5', '#ec4899', '#0d9488', '#f59e0b', '#ef4444', '#18181b'].map(color => (
                   <button 
                     key={color} 
                     className="w-10 h-10 rounded-xl shadow-sm ring-2 ring-transparent focus:ring-slate-400 focus:outline-none focus:scale-110 hover:scale-110 transition-transform cursor-pointer"
                     style={{ backgroundColor: color }}
                   />
                 ))}
                 <button className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-zinc-700 flex items-center justify-center text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors bg-slate-50 dark:bg-zinc-800/50">
                   +
                 </button>
               </div>
             </div>
           </div>
         </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-100">Live Experience Preview</h3>
          <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button 
              onClick={() => setMockupView('desktop')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
                mockupView === 'desktop' ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"
              )}
            >
              <Monitor className="w-4 h-4" /> Desktop
            </button>
            <button 
              onClick={() => setMockupView('mobile')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
                mockupView === 'mobile' ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"
              )}
            >
              <Smartphone className="w-4 h-4" /> Mobile
            </button>
          </div>
        </div>

        <div className={cn(
          "flex justify-center bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden relative",
           mockupView === 'desktop' ? "p-6 sm:p-10 z-0" : "h-[850px] items-start pt-12"
        )}>
          <div 
             className={cn(
               "bg-slate-900 relative shrink-0 transition-all duration-500 origin-top overflow-hidden border",
               mockupView === 'desktop' 
                 ? "w-full rounded-2xl border-slate-800 shadow-2xl" 
                 : "w-[375px] h-[812px] rounded-[3rem] border-[14px] border-slate-900 ring-4 ring-slate-800/10 shadow-[0_0_0_2px_rgba(30,41,59,1),0_20px_40px_rgba(0,0,0,0.5)] scale-[0.8] sm:scale-100"
             )}
          >
             {mockupView === 'mobile' && (
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-slate-900 rounded-b-[20px] z-50 flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-b border-white/5">
                 <div className="w-12 h-1.5 rounded-full bg-slate-800/80" />
                 <div className="w-2 h-2 rounded-full bg-slate-800/80" />
               </div>
             )}
             
             {mockupView === 'mobile' && (
               <div className="h-14 bg-slate-950 w-full flex items-center justify-between px-6 pt-2 z-40 relative">
                 <span className="text-[14px] font-semibold text-slate-100 pl-1 tracking-tight">9:41</span>
                 <div className="flex items-center gap-1.5 opacity-90 pr-1">
                    <div className="w-4 h-3 rounded-[3px] border-[1.5px] border-slate-100 relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-slate-100" />
                    </div>
                    <div className="w-4 h-2.5 flex items-end justify-between gap-[2px]">
                       <div className="w-[3px] h-[4px] bg-slate-100 rounded-sm" />
                       <div className="w-[3px] h-[6px] bg-slate-100 rounded-sm" />
                       <div className="w-[3px] h-[8px] bg-slate-100 rounded-sm" />
                       <div className="w-[3px] h-[10px] bg-slate-100 rounded-sm opacity-30" />
                    </div>
                 </div>
               </div>
             )}
            
            <div className="px-4 py-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 w-full">
                 <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5 text-white" />
                 </div>
                 <div className="min-w-0 pr-4">
                   <h3 className="text-white font-medium text-sm truncate">10x Your Marketing Strategy in 2026</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <span className="text-[10px] font-bold text-red-500 tracking-wider">LIVE MOCKUP</span>
                   </div>
                 </div>
              </div>
              <div className={cn("hidden sm:flex items-center gap-2 shrink-0", mockupView === 'mobile' && "hidden")}>
                <div className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium">1,204 Attendees</div>
              </div>
            </div>
            
            <div className={cn("flex", mockupView === 'desktop' ? "flex-row h-[460px]" : "flex-col h-[calc(100%-120px)]")}>
              <div className={cn(
                "bg-black relative flex flex-col items-center justify-center",
                mockupView === 'desktop' ? "flex-1 border-r border-slate-800 overflow-hidden" : "w-full aspect-video shrink-0 z-10"
              )}>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden bg-black">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" alt="Video Mockup" className="w-full h-full object-contain opacity-80" />
                 </div>

                 {/* Video Controls Overlay */}
                 {mockupView === 'desktop' && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-4 px-6 flex flex-col gap-3">
                       {/* Timeline */}
                       <div className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative">
                          <div className="absolute left-0 top-0 bottom-0 w-2/3 bg-indigo-500 rounded-full relative">
                             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
                          </div>
                          <div className="absolute left-2/3 right-4 top-0 bottom-0 bg-white/40 rounded-r-full" />
                       </div>
                       
                       {/* Controls bottom row */}
                       <div className="flex items-center justify-between text-white mt-1">
                          <div className="flex items-center gap-4">
                             <Play className="w-5 h-5 text-white cursor-pointer hover:text-indigo-400 transition" />
                             <Volume2 className="w-5 h-5 text-white cursor-pointer hover:text-indigo-400 transition" />
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Live</span>
                                <span className="text-sm font-medium text-slate-200">45:12</span>
                             </div>
                          </div>

                          <div className="flex items-center gap-4">
                             <Settings className="w-5 h-5 text-white cursor-pointer hover:text-indigo-400 transition" />
                             <Maximize className="w-5 h-5 text-white cursor-pointer hover:text-indigo-400 transition" />
                          </div>
                       </div>
                    </div>
                 )}
                 
                 <div className={cn(
                    "absolute w-full px-4",
                    mockupView === 'desktop' ? "top-6 right-6 max-w-[280px] w-auto left-auto" : "bottom-0 transform translate-y-1/2 z-20"
                 )}>
                    <div className={cn(
                       "bg-white rounded-xl shadow-2xl border border-slate-100 relative",
                       mockupView === 'desktop' ? "p-4" : "p-4 sm:p-5"
                    )}>
                       <div className={cn(
                          "absolute bg-red-500 text-white font-bold rounded-full uppercase tracking-widest shadow-md",
                          mockupView === 'desktop' ? "top-[-10px] right-[-10px] text-[9px] px-2 py-0.5" : "-top-3 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5"
                       )}>
                          Special Offer
                       </div>
                       <h4 className={cn("font-bold text-slate-900 mb-1", mockupView === 'desktop' ? "text-sm" : "text-center mt-1 text-sm sm:text-base")}>Webinar Mastery Course</h4>
                       <p className={cn("text-slate-500 mb-3", mockupView === 'desktop' ? "text-[11px]" : "text-[10px] sm:text-xs text-center")}>Claim your spot and bonuses now.</p>
                       <button className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg text-xs shadow-md hover:bg-indigo-700 transition">Claim Offer Now</button>
                    </div>
                 </div>
              </div>
              
              <div className={cn(
                "bg-slate-900 flex flex-col relative z-0",
                mockupView === 'desktop' ? "w-80" : "flex-1"
              )}>
                 <div className={cn(
                    "flex border-b border-slate-800 relative",
                    mockupView === 'mobile' && "mt-16 z-0"
                 )}>
                   <div className="flex-1 py-3 text-center text-sm font-medium text-white border-b-2 border-indigo-500">Chat</div>
                   <div className="flex-1 py-3 text-center text-sm font-medium text-slate-400">Q&A</div>
                 </div>
                 <div className="flex-1 p-4 space-y-4 overflow-hidden relative min-h-0">
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-slate-900 to-transparent z-10" />
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 text-[10px] text-white font-bold">SJ</div>
                      <div className="leading-tight">
                        <span className="text-[11px] sm:text-xs text-indigo-400 font-semibold mr-2 block mb-0.5">Sarah J.</span>
                        <span className="text-xs sm:text-sm text-slate-300">This strategy makes so much sense! 🤯</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-[10px] text-white font-bold">MR</div>
                      <div className="leading-tight">
                        <span className="text-[11px] sm:text-xs text-emerald-400 font-semibold mr-2 block mb-0.5">Mike R.</span>
                        <span className="text-xs sm:text-sm text-slate-300">Are we getting the slides after this?</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-[10px] text-white font-bold">HST</div>
                      <div className="leading-tight">
                        <span className="text-[11px] sm:text-xs text-amber-400 font-semibold mr-2 block mb-0.5 flex items-center gap-1">Host <CheckCircle2 className="w-3 h-3" /></span>
                        <span className="text-xs sm:text-sm text-slate-300">Yes Mike! A replay and slides will be sent via email.</span>
                      </div>
                    </div>
                 </div>
                 <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900 pb-8 sm:pb-4">
                   <div className="bg-slate-800 rounded-lg py-2.5 px-3 flex items-center">
                     <span className="text-slate-500 text-[11px] sm:text-sm">Type a message...</span>
                   </div>
                 </div>
              </div>
            </div>
            
            {/* Home indicator */}
            {mockupView === 'mobile' && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-1.5 bg-white/20 rounded-full z-50 pointer-events-none" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step6ChatSimulation() {
  const [messages, setMessages] = useState([
    { id: 1, time: '00:01:30', author: 'Sarah Jenkins', text: 'Hi everyone! Joining from London.' },
    { id: 2, time: '00:02:15', author: 'Mark T.', text: 'Will there be a replay?' },
    { id: 3, time: '00:15:45', author: 'David Chen', text: 'The audio is cutting out a bit for me.' },
    { id: 4, time: '00:45:00', author: 'Emma Wilson', text: 'This strategy completely changed how we do marketing.' }
  ]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      
      const newMessages = [];
      let startIdx = 0;
      if (lines[0] && lines[0].toLowerCase().includes('timestamp')) {
        startIdx = 1;
      }

      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        let row = [];
        let cur = '';
        let inQuote = false;
        for (let char of line) {
          if (char === '"') {
            inQuote = !inQuote;
          } else if (char === ',' && !inQuote) {
            row.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        row.push(cur.trim());

        if (row.length >= 3) {
          newMessages.push({
            id: Date.now() + i,
            time: row[0].replace(/^"|"$/g, ''),
            author: row[1].replace(/^"|"$/g, ''),
            text: row.slice(2).join(',').replace(/^"|"$/g, '')
          });
        }
      }

      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
      }
    };
    reader.readAsText(file);
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Automated Chat Simulation</h2>
        <p className="text-slate-500 dark:text-zinc-400">Pre-program chat messages to simulate a live audience during your evergreen webinar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100">Timeline</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                >
                  <Upload className="w-4 h-4" /> Import CSV
                </button>
                <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700"></div>
                <button 
                  onClick={() => setMessages([...messages, { id: Date.now(), time: '00:00:00', author: 'New User', text: 'New message' }])}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Message
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.sort((a, b) => a.time.localeCompare(b.time)).map(msg => (
                <div key={msg.id} className="flex gap-4 p-4 border border-slate-100 dark:border-zinc-800 rounded-xl hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors group relative">
                  <button 
                    onClick={() => setMessages(messages.filter(m => m.id !== msg.id))}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-20 shrink-0 pt-0.5 relative">
                    <input
                      type="text"
                      value={msg.time}
                      onChange={(e) => setMessages(messages.map(m => m.id === msg.id ? { ...m, time: e.target.value } : m))}
                      placeholder="00:00:00"
                      className="w-full text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded px-1.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={msg.author}
                        onChange={(e) => setMessages(messages.map(m => m.id === msg.id ? { ...m, author: e.target.value } : m))}
                        placeholder="Sender Name"
                        className="font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-500 p-0 focus:ring-0 outline-none w-full transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    <input
                      type="text"
                      value={msg.text}
                      onChange={(e) => setMessages(messages.map(m => m.id === msg.id ? { ...m, text: e.target.value } : m))}
                      placeholder="Enter chat message..."
                      className="text-slate-600 dark:text-zinc-400 text-sm bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-500 p-0 focus:ring-0 outline-none w-full transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setMessages([...messages, { id: Date.now(), time: '00:00:00', author: 'New User', text: 'New assigned message.' }])}
                className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl text-slate-500 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add New Message
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold">Why use simulation?</h3>
            <p className="text-indigo-100 text-sm leading-relaxed text-balance">
              Simulated chat messages increase engagement, provide social proof, and answer common objections automatically without you needing to be live.
            </p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4 text-sm">
            <h4 className="font-semibold text-slate-900 dark:text-zinc-100">Quick Tips</h4>
            <ul className="space-y-3 text-slate-600 dark:text-zinc-400">
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span> Add messages welcoming attendees in the first 5 minutes.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span> Ask leading questions right before you pitch your offer.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span> Plant "seeds" throughout to validate your authority.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step7Emails({ onEditTemplate }: { onEditTemplate: (template: {title: string, sendTime: string}) => void }) {
  const [emails, setEmails] = useState([
    { id: 1, title: 'Registration Confirmation', sendTime: 'Immediately after registration', enabled: true },
    { id: 2, title: '24 Hour Reminder', sendTime: '24 hours before webinar starts', enabled: true },
    { id: 3, title: '1 Hour Reminder', sendTime: '1 hour before webinar starts', enabled: true },
    { id: 4, title: '15 Minute Reminder', sendTime: '15 minutes before webinar starts', enabled: false },
    { id: 5, title: 'Replay Link', sendTime: '4 hours after webinar ends', enabled: true },
  ]);

  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Email Automation</h2>
        <p className="text-slate-500 dark:text-zinc-400">Automate and customize confirmation, reminder, and replay emails.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
        <div className="space-y-3">
           {emails.map(email => (
             <EmailTemplateCard 
               key={email.id}
               title={email.title} 
               sendTime={email.sendTime} 
               enabled={email.enabled} 
               onEdit={() => onEditTemplate({ title: email.title, sendTime: email.sendTime })}
             />
           ))}
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
           <button 
             onClick={() => setEmails([...emails, { id: Date.now(), title: 'Custom Email', sendTime: 'Specific Date/Time', enabled: true }])}
             className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
           >
             <span className="text-lg">+</span> Add Custom Email Automations
           </button>
        </div>
      </div>
    </div>
  )
}

function EmailTemplateCard({ title, sendTime, enabled: initialEnabled, onEdit }: any) {
  const [enabled, setEnabled] = useState(initialEnabled);
  
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors duration-300 gap-4",
      enabled ? "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 shadow-sm" : "bg-slate-50 dark:bg-zinc-900/30 border-transparent opacity-75"
    )}>
      <div className="flex items-start sm:items-center gap-4">
        <div className="pt-1 sm:pt-0">
           <input 
             type="checkbox" 
             checked={enabled} 
             onChange={(e) => setEnabled(e.target.checked)}
             className="toggle" 
           />
        </div>
        <div>
          <h4 className={cn("font-semibold", enabled ? "text-slate-900 dark:text-zinc-100" : "text-slate-500 dark:text-zinc-500")}>{title}</h4>
          <p className={cn("text-sm mt-0.5", enabled ? "text-slate-500 dark:text-zinc-400" : "text-slate-400 dark:text-zinc-600")}>{sendTime}</p>
        </div>
      </div>
      <button 
        disabled={!enabled} 
        onClick={onEdit}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-zinc-900"
      >
        Edit Template
      </button>
    </div>
  )
}

function Step8Publish({ onPublish }: { onPublish: () => void }) {
  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Review & Publish</h2>
        <p className="text-slate-500 dark:text-zinc-400">Everything looks great. Your webinar is almost live!</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
         <div className="relative bg-indigo-600 px-6 py-12 text-center text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.2)] border border-white/30">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h3 className="relative z-10 text-3xl font-display font-bold mb-3">Ready for Launch</h3>
            <p className="relative z-10 text-indigo-100 text-lg max-w-lg mx-auto">Click publish to deploy your webinar, activate automations, and generate your public registration links.</p>
         </div>
         
         <div className="p-8">
           <h4 className="font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-zinc-400 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Pre-flight Checklist
           </h4>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-zinc-950/50 p-6 rounded-xl border border-slate-100 dark:border-zinc-800 mb-8">
             <div>
               <span className="block text-sm text-slate-500 dark:text-zinc-400 mb-1">Webinar Type</span>
               <span className="font-semibold text-slate-900 dark:text-zinc-100">Live Webinar</span>
             </div>
             <div>
               <span className="block text-sm text-slate-500 dark:text-zinc-400 mb-1">Date & Time</span>
               <span className="font-semibold text-slate-900 dark:text-zinc-100">Oct 24, 2026, 2:00 PM EST</span>
             </div>
             <div>
               <span className="block text-sm text-slate-500 dark:text-zinc-400 mb-1">Email Automations</span>
               <span className="font-semibold text-slate-900 dark:text-zinc-100 text-emerald-600 dark:text-emerald-400">4 Active Sequences</span>
             </div>
             <div>
               <span className="block text-sm text-slate-500 dark:text-zinc-400 mb-1">Registration Page</span>
               <span className="font-semibold text-slate-900 dark:text-zinc-100">Configured</span>
             </div>
           </div>

           <button 
             onClick={onPublish}
             className="relative w-full py-4 text-white font-bold rounded-xl text-lg shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all overflow-hidden group"
           >
             <div className="absolute inset-0 bg-indigo-600 transition-colors group-hover:bg-indigo-700"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full duration-1000 transform -translate-x-full"></div>
             <span className="relative z-10 flex items-center justify-center gap-2">
               Publish Webinar Now <Rocket className="w-5 h-5" />
             </span>
           </button>
         </div>
      </div>
    </div>
  )
}

