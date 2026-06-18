import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { useFirestore } from '../hooks/useFirestore';
import { 
  ArrowLeft, Save, MousePointer2, Type, Image as ImageIcon, Video, 
  List, User, Calendar, Layout, Trash2, Plus, GripVertical, CheckCircle2, ChevronRight, Settings2, ShieldCheck, PlayCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface Block {
  id: string;
  type: string;
  props: any;
}

export const DEFAULT_BLOCKS: Block[] = [
  {
    id: 'b-1',
    type: 'hero',
    props: {
      headline: '10x Your Marketing Strategy Using Automated Funnels',
      subheadline: 'Learn the exact system we used to scale 50+ SaaS companies to over $10M ARR using high-converting evergreen webinars.',
      buttonText: 'Save My Seat',
      themeColor: 'indigo'
    }
  },
  {
    id: 'b-2',
    type: 'features',
    props: {
      title: 'What You\'ll Learn',
      features: [
        'How to build an automated funnel that converts cold traffic into customers.',
        'The exact webinar script that generated $1M+ in sales.',
        'How to use AI to follow up with leads and close deals 24/7.'
      ]
    }
  }
];

export default function LandingPageBuilder({ webinarSlug, onBack }: { webinarSlug: string | null; onBack: () => void }) {
  const { data: webinars, updateDocument } = useFirestore<any>('webinars');
  const webinar = webinars.find((w: any) => w.slug === webinarSlug);
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (webinar && webinar.landingPageBlocks) {
      setBlocks(webinar.landingPageBlocks);
    } else if (blocks.length === 0) {
      setBlocks(DEFAULT_BLOCKS);
    }
  }, [webinar]);

  const handleSave = async () => {
    if (!webinar) return;
    setIsSaving(true);
    try {
      await updateDocument(webinar.id, { landingPageBlocks: blocks });
      setTimeout(() => setIsSaving(false), 800);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  const addBlock = (type: string) => {
    const newBlock = { id: `b-${Date.now()}`, type, props: getDefaultProps(type) };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const removeBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < newBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    setBlocks(newBlocks);
  };

  const updateBlockProp = (id: string, key: string, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, props: { ...b.props, [key]: value } } : b));
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-zinc-950 overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Landing Page Builder</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400">{webinar?.title || 'Unknown Webinar'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={`/webinar/reg/${webinarSlug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            Preview
          </a>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saved' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Block Palette */}
        <div className="w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
            <h3 className="font-medium text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-500" /> Elements
            </h3>
          </div>
          <div className="p-4 grid gap-3">
            <BlockDraggable type="hero" icon={Type} label="Hero Header" onClick={() => addBlock('hero')} />
            <BlockDraggable type="features" icon={List} label="Feature List" onClick={() => addBlock('features')} />
            <BlockDraggable type="video" icon={Video} label="Video Embed" onClick={() => addBlock('video')} />
            <BlockDraggable type="instructor" icon={User} label="Instructor Bio" onClick={() => addBlock('instructor')} />
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-50 dark:bg-black/20" onClick={() => setSelectedBlockId(null)}>
          <div className="w-full max-w-4xl bg-white dark:bg-zinc-950 min-h-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
            {blocks.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <Layout className="w-16 h-16 mb-4 text-slate-300 dark:text-zinc-700" />
                 <p>Drag or add elements to start building</p>
               </div>
            ) : (
              <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="flex flex-col">
                {blocks.map((block) => (
                  <BlockWrapper 
                    key={block.id} 
                    block={block} 
                    selectedBlockId={selectedBlockId} 
                    setSelectedBlockId={setSelectedBlockId} 
                    removeBlock={removeBlock} 
                  />
                ))}
              </Reorder.Group>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shrink-0 overflow-y-auto flex flex-col">
          {selectedBlock ? (
            <>
              <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                <h3 className="font-semibold text-sm capitalize">{selectedBlock.type} Settings</h3>
              </div>
              <div className="p-5 space-y-6">
                {Object.keys(selectedBlock.props).map(key => {
                   if (Array.isArray(selectedBlock.props[key])) {
                     return (
                       <div key={key} className="space-y-3">
                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{key}</label>
                         {selectedBlock.props[key].map((item: string, i: number) => (
                           <div key={i} className="flex gap-2">
                             <input 
                               value={item}
                               onChange={(e) => {
                                 const newArr = [...selectedBlock.props[key]];
                                 newArr[i] = e.target.value;
                                 updateBlockProp(selectedBlock.id, key, newArr);
                               }}
                               className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                             />
                             <button 
                               onClick={() => {
                                 const newArr = selectedBlock.props[key].filter((_: any, idx: number) => idx !== i);
                                 updateBlockProp(selectedBlock.id, key, newArr);
                               }}
                               className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                             ><Trash2 className="w-4 h-4"/></button>
                           </div>
                         ))}
                         <button 
                           onClick={() => {
                             updateBlockProp(selectedBlock.id, key, [...selectedBlock.props[key], 'New item']);
                           }}
                           className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                         >
                           <Plus className="w-3 h-3" /> Add Item
                         </button>
                       </div>
                     );
                   }
                   return (
                     <div key={key} className="space-y-2">
                       <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{key}</label>
                       {key === 'subheadline' ? (
                         <textarea 
                           value={selectedBlock.props[key]}
                           onChange={(e) => updateBlockProp(selectedBlock.id, key, e.target.value)}
                           rows={3}
                           className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none"
                         />
                       ) : (
                         <input 
                           type="text"
                           value={selectedBlock.props[key]}
                           onChange={(e) => updateBlockProp(selectedBlock.id, key, e.target.value)}
                           className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                         />
                       )}
                     </div>
                   );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
               <Settings2 className="w-12 h-12 mb-4 text-slate-300 dark:text-zinc-700" />
               <p className="text-sm">Select an element on the canvas to configure its settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BlockDraggable({ type, icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-all gap-3"
    >
      <Icon className="w-6 h-6 text-slate-500 dark:text-zinc-400" />
      <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">{label}</span>
    </button>
  );
}

function BlockWrapper({ block, selectedBlockId, setSelectedBlockId, removeBlock }: any) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={dragControls}
      className={cn(
         "relative group border-2 transition-all cursor-pointer",
         selectedBlockId === block.id 
           ? "border-indigo-500 z-10 shadow-lg" 
           : "border-transparent hover:border-indigo-500/30"
      )}
      onClick={(e: any) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
    >
      {selectedBlockId === block.id && (
        <div className="absolute -top-10 right-0 bg-indigo-500 text-white flex items-center rounded-t-lg shadow-lg overflow-hidden h-9">
          <div 
             className="w-9 h-full flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-indigo-600"
             onPointerDown={(e) => dragControls.start(e)}
          >
             <GripVertical className="w-4 h-4" />
          </div>
          <div className="w-px h-5 bg-indigo-400"></div>
          <button onClick={(e) => removeBlock(block.id, e)} className="w-9 h-full flex items-center justify-center hover:bg-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      )}
      
      <RenderBlock block={block} />
    </Reorder.Item>
  );
}

// Default properties for new blocks
function getDefaultProps(type: string) {
  switch (type) {
    case 'hero':
      return { headline: 'Your Main Headline Here', subheadline: 'Add a compelling subheadline that elaborates on the value provided.', buttonText: 'Register Now' };
    case 'features':
      return { title: 'What You Will Discover', features: ['Key benefit one', 'Key benefit two', 'Key benefit three'] };
    case 'video':
      return { url: 'https://youtube.com/...', title: 'Watch the trailer' };
    case 'instructor':
      return { name: 'Host Name', bio: 'Expert in the field with years of experience.', role: 'CEO & Founder' };
    default: return {};
  }
}

// Renderers for different block types
export function RenderBlock({ block, onActionClick }: { block: Block; onActionClick?: () => void }) {
  const { type, props } = block;
  
  if (type === 'hero') {
    return (
      <div className="py-20 px-8 bg-gradient-to-b from-indigo-900 to-slate-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=2000&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-md mb-4">
            <Calendar className="w-4 h-4" /> Live Masterclass
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
            {props.headline}
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            {props.subheadline}
          </p>
          <div className="pt-8 text-center max-w-sm mx-auto">
             <button onClick={onActionClick} className="w-full py-4 px-8 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:shadow-xl transition-all shadow-indigo-500/20 active:scale-95">
               {props.buttonText}
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'features') {
    return (
      <div className="py-16 px-8 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">{props.title}</h2>
          <div className="grid gap-4">
            {props.features?.map((feat: string, i: number) => (
              <div key={i} className="flex gap-4 p-4 border border-slate-100 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900/50">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <p className="text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">{feat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="py-16 px-8 bg-slate-50 dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-6">{props.title}</h2>
          <div className="aspect-video bg-slate-200 dark:bg-black rounded-2xl border border-slate-300 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden group">
            <PlayCircle className="w-16 h-16 text-indigo-500 opacity-80 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'instructor') {
    return (
      <div className="py-16 px-8 bg-white dark:bg-zinc-950">
         <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 border-4 border-white dark:border-zinc-950 shadow-xl overflow-hidden">
               <User className="w-12 h-12 text-indigo-500" />
            </div>
            <div className="text-center md:text-left space-y-2">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{props.name}</h3>
               <p className="text-indigo-600 dark:text-indigo-400 font-medium">{props.role}</p>
               <p className="text-slate-600 dark:text-zinc-400 max-w-lg mt-4">{props.bio}</p>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-zinc-800 m-4 rounded-xl">
      Unknown Block Type: {type}
    </div>
  );
}
