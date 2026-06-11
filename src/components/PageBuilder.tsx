import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Monitor, 
  Smartphone, 
  Undo, 
  Redo, 
  Type, 
  Image as ImageIcon, 
  Square,
  AlignLeft,
  MousePointer2,
  Trash2,
  Copy,
  GripVertical,
  PlaySquare,
  Clock,
  User,
  LayoutTemplate
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function PageBuilder({ onClose, scheduleDate, scheduleTime }: { onClose: () => void, scheduleDate?: string, scheduleTime?: string }) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [elements, setElements] = useState([
    { id: 1, type: 'heading', content: '10x Your Marketing Strategy Using Automated Funnels', align: 'center' },
    { id: 2, type: 'paragraph', content: 'Learn the exact system we used to scale 50+ SaaS companies to over $10M ARR using high-converting evergreen webinars.', align: 'center' },
    { id: 3, type: 'timer', content: 'Ends in: 02:45:00', align: 'center' },
    { id: 4, type: 'video', content: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200', align: 'center' },
    { id: 5, type: 'button', content: 'Secure Your Spot Now', align: 'center' }
  ]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);

const [timeRemaining, setTimeRemaining] = useState({ days: '00', hours: '00', mins: '00' });

  React.useEffect(() => {
    if (!scheduleDate) return;
    
    const calculateTimeRemaining = () => {
      const targetStr = scheduleTime ? `${scheduleDate}T${scheduleTime}:00` : `${scheduleDate}T00:00:00`;
      const targetDate = new Date(targetStr);
      const now = new Date();
      
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining({ days: '00', hours: '00', mins: '00' });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      
      setTimeRemaining({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        mins: mins.toString().padStart(2, '0')
      });
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [scheduleDate, scheduleTime]);

  const addElement = (type: string) => {
    const newElement = {
      id: Date.now(),
      type,
      content: type === 'heading' ? 'New Heading' : 
               type === 'paragraph' ? 'New text block' : 
               type === 'video' ? 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200' :
               type === 'timer' ? 'Ends in: 02:45:00' :
               type === 'speaker' ? 'John Doe - Marketing Expert' :
               'Click Me',
      align: 'center'
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id: number, updates: any) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const removeElement = (id: number) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const duplicateElement = (id: number) => {
    const elToCopy = elements.find(el => el.id === id);
    if (elToCopy) {
      const newElement = { ...elToCopy, id: Date.now() };
      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 text-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Setup
          </button>
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
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Redo className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors ml-4">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Blocks) */}
        <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-medium text-slate-200 uppercase tracking-wider">Add Elements</h3>
          </div>
          
          <div className="p-4 space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Content</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Type, label: 'Heading', type: 'heading' },
                  { icon: AlignLeft, label: 'Paragraph', type: 'paragraph' },
                  { icon: Square, label: 'Button', type: 'button' }
                ].map(block => (
                  <button 
                    key={block.type}
                    onClick={() => addElement(block.type)}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 transition-colors"
                  >
                    <block.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{block.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Media & Widgets</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ImageIcon, label: 'Image', type: 'image' },
                  { icon: PlaySquare, label: 'Video', type: 'video' },
                  { icon: Clock, label: 'Timer', type: 'timer' },
                  { icon: User, label: 'Speaker', type: 'speaker' }
                ].map(block => (
                  <button 
                    key={block.type}
                    onClick={() => addElement(block.type)}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 transition-colors"
                  >
                    <block.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{block.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-slate-950/50 overflow-y-auto flex justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20 pb-32">
          <div className={cn(
             "bg-white min-h-[800px] rounded-xl shadow-2xl transition-all duration-300 relative",
             device === 'mobile' ? "w-[375px]" : "w-full max-w-4xl"
          )}>
            <div className="p-8 sm:p-12 space-y-4">
              {elements.map(el => (
                <div 
                  key={el.id}
                  onClick={() => setSelectedElement(el.id)}
                  className={cn(
                    "p-4 border-2 border-transparent cursor-pointer rounded-xl transition-all relative group",
                    selectedElement === el.id ? "border-indigo-500 ring-4 ring-indigo-500/10" : "hover:border-slate-200"
                  )}
                >
                  {/* Element Controls - Only show on hover/select */}
                  <div className={cn(
                    "absolute -top-3 right-4 bg-slate-900 rounded-lg shadow-lg border border-slate-800 flex items-center gap-1 p-1 z-10 transition-opacity",
                    selectedElement === el.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md cursor-grab">
                      <GripVertical className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); duplicateElement(el.id); }}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className={cn("w-full transition-all text-center", el.align === 'left' ? 'text-left' : el.align === 'right' ? 'text-right' : 'text-center')}>
                    {el.type === 'heading' && (
                      <h1 className="text-3xl sm:text-5xl font-bold font-display text-slate-900 tracking-tight leading-tight">{el.content}</h1>
                    )}
                    {el.type === 'paragraph' && (
                      <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">{el.content}</p>
                    )}
                    {el.type === 'button' && (
                      <div className={cn("flex", el.align === 'left' ? 'justify-start' : el.align === 'right' ? 'justify-end' : 'justify-center')}>
                        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-lg shadow-lg shadow-indigo-600/20 transition-all pointer-events-none">
                          {el.content}
                        </button>
                      </div>
                    )}
                    {el.type === 'image' && (
                      <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Placeholder" className="w-full max-w-2xl mx-auto rounded-2xl shadow-md border border-slate-100" />
                    )}
                    {el.type === 'video' && (
                      <div className="w-full max-w-3xl mx-auto aspect-video bg-slate-900 rounded-2xl relative overflow-hidden shadow-xl border border-slate-200">
                        <img src={el.content} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <PlaySquare className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                    {el.type === 'timer' && (
                      <div className="inline-flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Starting In</p>
                        <div className="flex items-center gap-4 text-slate-900">
                           <div className="text-center"><span className="text-4xl font-bold font-mono">{timeRemaining.days}</span><p className="text-[10px] text-slate-500 uppercase mt-1">Days</p></div>
                           <span className="text-2xl text-slate-300 pb-4">:</span>
                           <div className="text-center"><span className="text-4xl font-bold font-mono">{timeRemaining.hours}</span><p className="text-[10px] text-slate-500 uppercase mt-1">Hrs</p></div>
                           <span className="text-2xl text-slate-300 pb-4">:</span>
                           <div className="text-center"><span className="text-4xl font-bold font-mono">{timeRemaining.mins}</span><p className="text-[10px] text-slate-500 uppercase mt-1">Mins</p></div>
                        </div>
                      </div>
                    )}
                    {el.type === 'speaker' && (
                      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Speaker" className="w-16 h-16 rounded-full object-cover shadow-inner" />
                        <div className="text-left">
                          <h4 className="font-bold text-slate-900">{el.content.split(' - ')[0]}</h4>
                          <p className="text-sm text-indigo-600 font-medium">{el.content.split(' - ')[1] || 'Guest Speaker'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {elements.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4">
                <LayoutTemplate className="w-16 h-16 opacity-20" />
                <p className="text-lg">Drag elements here to build your page</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (Properties) */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 text-slate-200 hidden lg:flex">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-wider text-slate-200">Properties</h3>
            {selectedElement && (
              <span className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400 capitalize">
                {elements.find(e => e.id === selectedElement)?.type} Element
              </span>
            )}
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {selectedElement ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Content</label>
                  {(elements.find(e => e.id === selectedElement)?.type === 'heading' || elements.find(e => e.id === selectedElement)?.type === 'paragraph') ? (
                    <textarea 
                      rows={5}
                      value={elements.find(e => e.id === selectedElement)?.content}
                      onChange={(e) => updateElement(selectedElement, { content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 resize-none shadow-inner"
                    />
                  ) : (
                    <input 
                      type="text"
                      value={elements.find(e => e.id === selectedElement)?.content}
                      onChange={(e) => updateElement(selectedElement, { content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 shadow-inner"
                    />
                  )}
                </div>
                
                <div className="space-y-3 pt-4 border-t border-slate-800">
                   <label className="text-xs font-medium text-slate-400">Alignment</label>
                   <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                     {['left', 'center', 'right'].map((alignOpt) => (
                       <button 
                         key={alignOpt}
                         onClick={() => updateElement(selectedElement, { align: alignOpt })}
                         className={cn(
                           "flex-1 p-2 rounded text-xs capitalize transition-colors",
                           elements.find(e => e.id === selectedElement)?.align === alignOpt
                             ? "bg-indigo-600 text-white" 
                             : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                         )}
                       >
                         {alignOpt}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                   <button 
                     onClick={() => removeElement(selectedElement)}
                     className="w-full py-2.5 px-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg text-sm font-medium transition-colors border border-red-500/20 flex items-center justify-center gap-2"
                   >
                     <Trash2 className="w-4 h-4" />
                     Delete Element
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <MousePointer2 className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-sm text-center max-w-[200px] leading-relaxed">Select any element on the canvas to edit its properties, alignment, and styling.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
