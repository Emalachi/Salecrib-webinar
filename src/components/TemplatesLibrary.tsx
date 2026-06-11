import React, { useState } from 'react';
import { Search, LayoutTemplate, Copy, ArrowRight, Video, Mail, Webhook, Clock } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

export default function TemplatesLibrary({ onUseTemplate }: { onUseTemplate: () => void }) {
  const { data: templates, loading, error } = useFirestore<any>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(templates.map((t: any) => t.category).filter(Boolean)))];

  const filteredTemplates = templates.filter((template: any) => {
    const matchesSearch = (template.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (template.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-indigo-500" />
            Templates Library
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Pre-designed funnels, landing pages, and automations.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-800">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <div className="col-span-full py-12 text-center text-slate-500">Loading templates...</div>}
        {error && <div className="col-span-full py-12 text-center text-red-500">Error: {error}</div>}
        {!loading && filteredTemplates.map((template: any) => (
          <div key={template.id} className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-slate-200 dark:bg-zinc-800 animate-pulse" />
              <img 
                src={template.thumbnail || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'} 
                alt={template.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                {(template.tags || []).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md rounded border border-white/10 text-[10px] font-semibold text-white uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-zinc-100 mb-2 truncate">{template.title}</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4 flex-1 line-clamp-3">
                {template.description}
              </p>
              
              <div className="flex items-center gap-4 mb-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                  <Video className="w-3.5 h-3.5" />
                  Avg {template.stats?.conversion || '0%'} Conv.
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  {template.stats?.duration || 'Unknown'}
                </div>
              </div>

              <button 
                onClick={onUseTemplate}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white rounded-xl text-sm font-medium transition-all group/btn"
              >
                Use Template
                <ArrowRight className="w-4 h-4 group-hover/btn:-rotate-45 group-hover/btn:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        ))}
        {!loading && filteredTemplates.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <LayoutTemplate className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100 mb-1">No templates found</h3>
            <p className="text-slate-500 dark:text-zinc-400">Try adjusting your search or category filter. (Firestore DB is empty)</p>
          </div>
        )}
      </div>
    </div>
  );
}
